import { NounKeys } from "./nouns";
import { Vector2 } from "./vector-math";

export type Level = {
  name: string,
  nouns: Array<[
    NounKeys,
    Vector2
  ]>
}

export const LEVELS: Array<Level> = [
  {
    name: "Pairs",
    nouns: [
      ["A", [100, 0]],
      ["A", [-100, 0]],
      // ["A", [0, 100]],
      // ["A", [0, -100]]
    ]
  },
  // {
  //   name: "Not Pairs",
  //   nouns: [
  //     ["A", [100, 0]],
  //     ["A", [-100, 0]],
  //     ["A", [0, 100]],
  //     ["D", [0, -100]]
  //   ]
  // }
];