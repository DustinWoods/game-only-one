import './css/styles.css';
import { Application, Container, Sprite, Texture } from 'pixi.js';
import { LevelState, tick } from './engine';
import { Nouns, NounTextures,  generateNounTextures, NounKeys } from './nouns';

window.onload = (): void => {

  const app = new Application({
    antialias: false,
    transparent: false,
    autoDensity: true,
    resolution: 0.5, // TODO: auto
    resizeTo: window,
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

  let state: LevelState = {
    instances: [

    ]
  };

  // Demo initial state
  for (let i = 0; i < 30; i++) {
    const nounName: NounKeys = Object.keys(Nouns)[Math.floor(Object.keys(Nouns).length*Math.random())] as NounKeys;

    state.instances.push({
      name: nounName,
      position: [Math.random() * 1000, Math.random() * 1000],
      velocity: [0,0],//[0.5 - Math.random(), 0.5 - Math.random()],
      graphic: createTextureSprite(textures[nounName]),
    });
  }

  setInterval(() => {
    tick(state, 0.5);
  }, 50);

};