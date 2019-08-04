import { NounKeys as N } from "./nouns";

export type NounCollection = Array<N>;

export type RuleInput = NounCollection;

export type RuleOutput = NounCollection;

export type Rule = [
  RuleInput,
  RuleOutput,
];

export const GAME_RULES: Rule[] = [

  [
    [
      "A",
      "A"
    ],
    [
      "B"
    ]
  ],
  [
    [
      "A",
      "B"
    ],
    [
      "C"
    ]
  ],
  [
    [
      "B",
      "B"
    ],
    [
      "A",
      "A",
      "A",
      "A"
    ]
  ],
  [
    [
      "A",
      "C"
    ],
    [
      "A",
      "A",
      "A",
      "A",
      "A"
    ]
  ],
  [
    [
      "C",
      "B",
    ],
    [
      "D",
    ]
  ],
  [
    [
      "C",
      "C",
    ],
    [

    ]
  ]
];