import { Graphics, Text, Texture, BaseRenderTexture, RenderTexture, SCALE_MODES, Application, Container } from "pixi.js";
import { NOUN_RADIUS } from "./constants";

export type NounKeys = Extract<keyof typeof Nouns, string>;

export enum Nouns {
  the = "the",
  end = "end",
  you = "you",
  fun = "fun",
  heart = "❤",
  obsession = "obsession",
  bigobsession = "obsession",

  A = "A",
  B = "B",
  C = "C",
  D = "D",
}

export const NounColors: {[key in NounKeys]?: number} = {
  heart: 0xaa5555,
  the: 0xffffff,
  end: 0xffffff,
  you: 0xccccff,
  obsession: 0x888888,
  bigobsession: 0x777777,
  A: 0xff3300,
  B: 0x00aa00,
  C: 0x4400aa,
  D: 0x0044cc,
}

export const NounScales: {[key in NounKeys]?: number} = {
  bigobsession: 2,
  the: 2,
  end: 2,
}

export type NounTextures = {[key in NounKeys]: RenderTexture};

export function generateNounTextures(app: Application): NounTextures {
  return Object.keys(Nouns).reduce((o, n: NounKeys) => {
    return {
      ...o,
      [n]: createNounGraphics(Nouns[n].toLocaleUpperCase(), NounColors[n] || 0xdddddd, NOUN_RADIUS * (NounScales[n] || 1), app)
    }
  }, {}) as NounTextures;
}

export function createNounGraphics(text: string, color: number, radius: number, app: Application): RenderTexture {
  const brt = new BaseRenderTexture({
    width: radius * 2,
    height: radius * 2,
    scaleMode: SCALE_MODES.NEAREST,
    resolution: app.renderer.resolution,
  });
  const rt = new RenderTexture(brt);

  const container = new Container();

  const g = new Graphics();
  g.beginFill(color);
  g.drawCircle(radius, radius, radius);
  g.endFill();
  container.addChild(g);

  const nameText = new Text(text, {fontSize: Math.floor(26 * (radius / NOUN_RADIUS) * 0.5)});
  nameText.x = radius;
  nameText.y = radius;
  nameText.anchor.set(0.5, 0.5);
  container.addChild(nameText);

  app.renderer.render(container, rt);
  container.destroy();

  return rt;
}