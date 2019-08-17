import { Vector2 } from "./vector-math";
import { NounKeys } from "./nouns";
import { Sprite } from "pixi.js";

export interface NounInstance {
  name: NounKeys;
  attractor?: Vector2;
  dragTo?: NounInstance,
  releaseCooldown?: number;
  velocity: Vector2;
  position: Vector2;
  graphic?: Sprite;
  cooldown?: number;
}