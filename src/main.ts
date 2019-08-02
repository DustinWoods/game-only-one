import './css/styles.css';
import { Application, Text } from 'pixi.js';

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

  const helloWorld = new Text("Hello World");
  app.stage.addChild(helloWorld);

};