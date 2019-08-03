import { Vector2 } from "./vector-math";
import { Nouns } from "./nouns";
import { Sprite } from "pixi.js";

export interface NounInstance {
  name: keyof typeof Nouns;
  velocity: Vector2;
  position: Vector2;
  graphic: Sprite;
}