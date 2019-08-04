import './css/styles.css';
import { Application, Sprite, Texture, interaction, Container, Text } from 'pixi.js';
import { LevelState, tick } from './engine';
import { NounTextures,  generateNounTextures, NounScales } from './nouns';
import { Vector2, magnitude, subtract } from './vector-math';
import { NounInstance } from './noun';
import { NOUN_RADIUS, LEVEL_WIDTH, LEVEL_HEIGHT } from './constants';
import { Level, LEVELS } from './levels';

window.onload = (): void => {

  const app = new Application({
    antialias: false,
    transparent: false,
    autoDensity: true,
    resolution: 2, // TODO: auto
    width: LEVEL_WIDTH,
    height: LEVEL_HEIGHT,
    backgroundColor: 0xffffff,
  });

  document.body.appendChild(app.view);

  const levelContainer = new Container();

  // Generate textures for each noun
  const textures: NounTextures = generateNounTextures(app);

  // Create sprite for noun, add to stage
  function createTextureSprite(stage: Container, t: Texture): Sprite {
    const s = new Sprite(t);
    s.cursor = 'pointer';
    s.interactive = true;
    s.anchor.set(0.5, 0.5);
    stage.addChild(s);
    return s;
  }

  // Current level state
  let state: LevelState = {
    instances: []
  };

  const stateHistory: Array<LevelState> = [];

  // Cleans up a state object to remove graphics and attractor
  function cleanState(state: LevelState): LevelState {
    return {
      instances: state.instances.map((o: NounInstance) => ({
        name: o.name,
        velocity: o.velocity,
        position: o.position,
        cooldown: o.cooldown,
      }))
    }
  }

  // Saves current state to history
  function saveState() {
    stateHistory.push(cleanState(state));
  }

  // Pops recent state from history and loads it
  function loadState() {
    const ns: LevelState | undefined = stateHistory.pop();
    if(ns) {
      state.instances.forEach(({graphic}) => {
        if(graphic) levelContainer.removeChild(graphic);
      });
      state = ns;
    }
  }

  // UI stuff
  // Store current mouse/pointer position
  const mousePos: Vector2 = [0,0]
  let clickTarget: NounInstance | undefined = undefined;

  // Enable interactions
  levelContainer.interactive = true;
  function cancelClickTarget(e: interaction.InteractionEvent) {
    if(clickTarget) {
      delete clickTarget.attractor;
      clickTarget.releaseCooldown = 1;
    }
    clickTarget = undefined;
  }
  function setClickTarget(e: interaction.InteractionEvent) {
    if(e.type === "mousedown") {
      clickTarget = state.instances.find((n: NounInstance) => {
        return magnitude(subtract([e.data.global.x, e.data.global.y], n.position)) <= (NOUN_RADIUS * (NounScales[n.name] || 1));
      });
      if(clickTarget) {
        mousePos[0] = e.data.global.x;
        mousePos[1] = e.data.global.y;
        clickTarget.attractor = mousePos;
        saveState();
      }
    }
  }
  function updateClickTarget(e: interaction.InteractionEvent) {
    mousePos[0] = e.data.global.x;
    mousePos[1] = e.data.global.y;
  }

  app.renderer.plugins.interaction.on("pointerdown", setClickTarget);
  app.renderer.plugins.interaction.on("pointerup",cancelClickTarget);
  app.renderer.plugins.interaction.on("pointermove", updateClickTarget);

  // Undo recent move
  window.addEventListener(
    "keyup", (e) => {
      if(e.key === "z") {
        loadState();
      }
    }, false
  );

  const undoButton = new Container();
  undoButton.interactive = true;
  undoButton.on("click", loadState);
  undoButton.cursor = "pointer";
  undoButton.addChild(new Text("UNDO (Z)"));
  undoButton.position.set(15, LEVEL_HEIGHT - 40);
  levelContainer.addChild(undoButton);

  const restartButton = new Container();
  restartButton.interactive = true;
  restartButton.on("click", () => loadLevel(LEVELS[currentLevel]));
  restartButton.cursor = "pointer";
  restartButton.addChild(new Text("RESTART"));
  restartButton.position.set(undoButton.width + 30, LEVEL_HEIGHT - 40);
  levelContainer.addChild(restartButton);

  const levelText = new Text("");
  levelText.anchor.set(0.5, 0);
  levelText.position.set(LEVEL_WIDTH/2, 15);
  levelContainer.addChild(levelText);

  const instructionText = new Text("GOAL: ONLY ONE WORD");
  instructionText.anchor.set(1, 1);
  instructionText.position.set(LEVEL_WIDTH-15, LEVEL_HEIGHT-10);
  levelContainer.addChild(instructionText);

  function loadLevel(level: Level) {
    stateHistory.splice(0, stateHistory.length);
    state.instances.forEach(({graphic}) => {
      if(graphic) levelContainer.removeChild(graphic);
    });
    state.instances = [];

    level.nouns.forEach((k) => {
      state.instances.push({
        name: k[0],
        position: [k[1][0] + LEVEL_WIDTH/2, k[1][1] + LEVEL_HEIGHT/2],
        velocity: [0,0],
      });
    });
    //levelText.text = `LEVEL ${LEVELS.indexOf(level) + 1} OF ${LEVELS.length}: ${level.name}`;
    app.stage.addChild(levelContainer);
    levelContainer.alpha = 1;
  }

  let currentLevel = 0;
  let gameOver = false;
  loadLevel(LEVELS[currentLevel]);

  function completeLevel() {
    if(currentLevel < LEVELS.length - 1) {
      currentLevel += 1;
      loadLevel(LEVELS[currentLevel]);
    } else {
      gameOver = true;
      // GAME OVER!
      instructionText
      levelContainer.removeChild(instructionText);
      levelContainer.removeChild(undoButton);
      levelContainer.removeChild(restartButton);
      loadLevel({
        name: '',
        nouns: [
          ["the", [-96, 0]],
          ["end", [96, 0]]
        ]
      })
    }
  }

  let winningAnimationStatus = 0;
  function checkWinState() {
    if(state.instances.length === 1) {
      winningAnimationStatus = 1;
    }
  }

  // Some game loop stuff
  app.ticker.add(() => {
    if(winningAnimationStatus > 0) {
      winningAnimationStatus -= 0.01;

      const lastGraphic = state.instances[0].graphic;
      if(lastGraphic) {
        let maxScale = 100;
        lastGraphic.scale.set(2-winningAnimationStatus);
        levelContainer.alpha = winningAnimationStatus;
      }

      if(winningAnimationStatus <= 0) {
        winningAnimationStatus = 0;
        completeLevel();
      }
    } else {
      tick(state, 0.5);
      for (let i = 0; i < state.instances.length; i++) {
        const instance = state.instances[i];
        if(!instance.graphic) {
          instance.graphic = createTextureSprite(levelContainer, textures[instance.name]);
        }
        if(instance.attractor) {
          instance.graphic.alpha = 0.6;
        } else if(instance.graphic.alpha !== 1) {
          instance.graphic.alpha = 1;
        }
        instance.graphic.position.set(...instance.position);
      }
      checkWinState();
    }
  });

};