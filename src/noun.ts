import { Vector2 } from "./vector-math";
import { Nouns, NounKeys } from "./nouns";
import { Sprite } from "pixi.js";

export interface NounInstance {
  name: NounKeys;
  attractor?: Vector2;
  velocity: Vector2;
  position: Vector2;
  graphic: Sprite;
}