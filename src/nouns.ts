import { Graphics, Text, Texture, BaseRenderTexture, RenderTexture, SCALE_MODES, Application, Container } from "pixi.js";
import { NOUN_RADIUS } from "./constants";

export enum Nouns {
  puddle = "puddle",
  pond = "pond",
  fire = "fire",
  forest = "forest",
  inferno = "inferno",
  steam = "steam",
}

export const NounColors: {[key in Nouns]: number} = {
  puddle: 0x0000ff,
  pond: 0x0000ff,
  fire: 0xffaa00,
  forest: 0x00ff00,
  inferno: 0xff0000,
  steam: 0xaaaaaa,
}

export const NounScales: {[key in Nouns]?: number} = {
  pond: 2,
  forest: 2,
  inferno: 2,
}

export type NounTextures = {[key in Nouns]: RenderTexture};

export function generateNounTextures(app: Application): NounTextures {
  return Object.keys(Nouns).reduce((o, n: Nouns) => {
    return {
      ...o,
      [n]: createNounGraphics(n, NounColors[n], NOUN_RADIUS * (NounScales[n] || 1), app)
    }
  }, {}) as NounTextures;
}

export function createNounGraphics(text: string, color: number, radius: number, app: Application): RenderTexture {
  const brt = new BaseRenderTexture({
    width: radius * 2,
    height: radius * 2,
    scaleMode: SCALE_MODES.LINEAR,
    resolution: app.renderer.resolution,
  });
  const rt = new RenderTexture(brt);

  const container = new Container();

  const g = new Graphics();
  g.beginFill(color);
  g.drawCircle(radius, radius, radius);
  g.endFill();
  container.addChild(g);

  const nameText = new Text(text);
  nameText.x = radius;
  nameText.y = radius;
  nameText.anchor.set(0.5, 0.5);
  nameText.scale.set(radius / 100);
  container.addChild(nameText);

  app.renderer.render(container, rt);
  container.destroy();

  return rt;
}