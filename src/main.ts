import './css/styles.css';
import { Application, Container, Sprite, Texture } from 'pixi.js';
import { LevelState, tick } from './engine';
import { Nouns, NounTextures,  generateNounTextures } from './nouns';

window.onload = (): void => {

  const app = new Application({
    antialias: true,
    transparent: false,
    autoDensity: true,
    resolution: 2, // TODO: auto
    resizeTo: window,
    backgroundColor: 0xffffff,
  });

  document.body.appendChild(app.view);

  const textures: NounTextures = generateNounTextures(app);

  function createTextureSprite(t: Texture): Sprite {
    const s = new Sprite(t);
    app.stage.addChild(s);
    return s;
  }

  let state: LevelState = {
    instances: [

    ]
  };

  // Demo initial state
  for (let i = 0; i < Object.keys(Nouns).length; i++) {
    const nounName: Nouns = Object.keys(Nouns)[i] as Nouns;

    state.instances.push({
      name: nounName,
      position: [Math.random() * 1000, Math.random() * 1000],
      velocity: [0.5 - Math.random(), 0.5 - Math.random()],
      graphic: createTextureSprite(textures[nounName]),
    });
  }

  app.ticker.add((delta) => {
    tick(state, delta);
  });

};