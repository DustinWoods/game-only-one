import './css/styles.css';
import { Application, Sprite, Texture, interaction, Container } from 'pixi.js';
import { LevelState, tick } from './engine';
import { Nouns, NounTextures,  generateNounTextures, NounKeys, NounScales } from './nouns';
import { Vector2, magnitude, subtract } from './vector-math';
import { NounInstance } from './noun';
import { NOUN_RADIUS, LEVEL_WIDTH, LEVEL_HEIGHT } from './constants';

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

  const textures: NounTextures = generateNounTextures(app);

  function createTextureSprite(stage: Container, t: Texture): Sprite {
    const s = new Sprite(t);
    s.cursor = 'pointer';
    s.interactive = true;
    s.anchor.set(0.5, 0.5);
    stage.addChild(s);
    return s;
  }

  const mousePos: Vector2 = [0,0]
  let clickTarget: NounInstance | undefined = undefined;

  app.stage.interactive = true;
  app.renderer.plugins.interaction.on("mousedown", (e: interaction.InteractionEvent) => {
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
  });
  function cancelClickTarget(e: interaction.InteractionEvent) {
    if(clickTarget) {
      delete clickTarget.attractor;
    }
    clickTarget = undefined;
  }
  app.renderer.plugins.interaction.on("mouseup",cancelClickTarget);
  app.renderer.plugins.interaction.on("mousemove", (e: interaction.InteractionEvent) => {
    mousePos[0] = e.data.global.x;
    mousePos[1] = e.data.global.y;
  });

  let state: LevelState = {
    instances: []
  };

  const stateHistory: Array<LevelState> = [];

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

  function saveState() {
    stateHistory.push(cleanState(state));
  }

  function loadState() {
    const ns = stateHistory.pop();
    if(ns) {
      state.instances.forEach(({graphic}) => {
        if(graphic) app.stage.removeChild(graphic);
      })
      state = ns;
    }
  }

  window.addEventListener(
    "keyup", (e) => {
      if(e.key === "z") {
        console.log("loaded");
        loadState();
      }
    }, false
  );

  // Demo initial state

  [
    // "A",
    // "A",
    // "A",
    // "A",
    "A",
    "A",
    "A",
    "A",
    "A",
    "A",

  ].forEach((k: NounKeys) => {
    state.instances.push({
      name: k,
      position: [Math.random() * 1000, Math.random() * 1000],
      velocity: [2 - Math.random() * 4, 2 - Math.random() * 4],
    });
  });

  setInterval(() => {
    tick(state, 0.5);
    for (let i = 0; i < state.instances.length; i++) {
      const instance = state.instances[i];
      if(!instance.graphic) {
        instance.graphic = createTextureSprite(app.stage, textures[instance.name]);
      }
      if(instance.attractor) {
        instance.graphic.alpha = 0.6;
      } else if(instance.graphic.alpha !== 1) {
        instance.graphic.alpha = 1;
      }
      instance.graphic.position.set(...instance.position);
    }
  }, 50);

};