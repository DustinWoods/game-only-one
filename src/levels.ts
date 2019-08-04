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
    name: "Colors",
    nouns: [
      ["red", [100, 0]],
      ["blue", [-100, 0]],
      ["red", [0, 100]],
      ["blue", [0, -100]]
    ]
  },
  {
    name: "Colors",
    nouns: [
      ["red", [100, 0]],
      ["blue", [-100, 0]],
      ["red", [0, 100]],
    ]
  },
  {
    name: "Colors",
    nouns: [
      ["red", [100, 0]],
      ["blue", [-100, 0]],
      ["green", [0, 100]],
      ["scissors", [0, -100]]
    ]
  },
  {
    name: "Colors",
    nouns: [
      ["banana", [100, 0]],
      ["green", [-100, 0]],
      ["green", [0, 100]],
      ["scissors", [0, -100]]
    ]
  },
  // {
  //   name: "Colors",
  //   nouns: [
  //     ["banana", [100, 0]],
  //     ["green", [-100, 0]],
  //     ["scissors", [0, 100]],
  //     ["double", [0, -100]]
  //   ]
  // },
  // {
  //   name: "Colors",
  //   nouns: [
  //     ["red", [150, 0]],
  //     ["blue", [-150, 0]],
  //     ["blue", [0, 150]],
  //     ["red", [0, -150]],
  //     ["green", [150, 150]],
  //     //["blue", [-150, -150]],
  //     //["scissors", [-150, 150]],
  //     ["scissors", [0, 0]],
  //   ]
  // },
  // {
  //   name: "Colors",
  //   nouns: [
  //     ["red", [150, 0]],
  //     ["green", [-150, 0]],
  //     ["blue", [0, 150]],
  //     ["red", [0, -150]],
  //     ["green", [150, 150]],
  //     //["blue", [-150, -150]],
  //     //["scissors", [-150, 150]],
  //     ["scissors", [150, -150]],
  //   ]
  // },
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