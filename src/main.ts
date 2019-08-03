import './css/styles.css';
import { Application, Sprite, Texture, interaction } from 'pixi.js';
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
    resolution: 0.5, // TODO: auto
    width: LEVEL_WIDTH,
    height: LEVEL_HEIGHT,
    backgroundColor: 0xffffff,
  });

  document.body.appendChild(app.view);

  const textures: NounTextures = generateNounTextures(app);

  function createTextureSprite(t: Texture): Sprite {
    const s = new Sprite(t);
    s.anchor.set(0.5, 0.5);
    app.stage.addChild(s);
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
  app.renderer.plugins.interaction.on("pointerout", cancelClickTarget);
  app.renderer.plugins.interaction.on("mousemove", (e: interaction.InteractionEvent) => {
    mousePos[0] = e.data.global.x;
    mousePos[1] = e.data.global.y;
  });

  let state: LevelState = {
    instances: []
  };
  // Demo initial state
  for (let i = 0; i < 10; i++) {
    const nounName: NounKeys = Object.keys(Nouns)[Math.floor(Object.keys(Nouns).length*Math.random())] as NounKeys;

    state.instances.push({
      name: nounName,
      position: [Math.random() * 1000, Math.random() * 1000],
      velocity: [0.5 - Math.random(), 0.5 - Math.random()],
      graphic: createTextureSprite(textures[nounName]),
    });
  }

  setInterval(() => {
    tick(state, 0.5);
  }, 50);

};