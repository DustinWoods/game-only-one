import { Nouns as N } from "./nouns";

export type NounCollection = Array<N>;

export type RuleInput = NounCollection;

export type RuleOutput = NounCollection;

export type Rule = [
  RuleInput,
  RuleOutput,
];

export const GAME_RULES: Rule[] = [
  [
    [N.puddle, N.puddle],
    [N.pond],
  ],
  [
    [N.fire, N.forest],
    [N.inferno],
  ],
  [
    [N.fire, N.puddle],
    [N.fire, N.steam],
  ],
  [
    [N.fire, N.pond],
    [],
  ],
  [
    [N.inferno, N.pond],
    [N.steam, N.inferno, N.pond],
  ]
];