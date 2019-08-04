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
    ["the", "end"],
    ["you", "fun"]
  ],
  [
    ["you", "fun"],
    ["you", "fun", "fun", "love"]
  ],
  [
    ["love", "love"],
    ["obsession"]
  ],
  [
    ["obsession", "obsession"],
    ["bigobsession"]
  ],
  [
    ["bigobsession", "bigobsession"],
    ["bigobsession"]
  ],

  // colors
  [
    [
      "red",
      "red"
    ],
    [
      "red"
    ]
  ],
  [
    [
      "red",
      "green"
    ],
    [
      "banana"
    ]
  ],
  [
    [
      "green",
      "green"
    ],
    [
      "green"
    ]
  ],
  [
    [
      "red",
      "blue"
    ],
    [
      "grape"
    ]
  ],
  [
    [
      "green",
      "blue"
    ],
    [
      "ice"
    ]
  ],
  [
    [
      "blue",
      "blue"
    ],
    [
      "blue"
    ]
  ],
  [
    [
      "red",
      "scissors"
    ],
    []
  ],
  [
    [
      "green",
      "scissors"
    ],
    []
  ],
  [
    [
      "blue",
      "scissors"
    ],
    []
  ],
  [
    [
      "grape",
      "scissors"
    ],
    [
      "red",
      "blue"
    ]
  ],
  [
    [
      "banana",
      "scissors"
    ],
    [
      "green",
      "red"
    ]
  ],
  [
    [
      "ice",
      "scissors"
    ],
    [
      "green",
      "blue"
    ]
  ],
  [
    [
      "red",
      "double"
    ],
    [
      "red",
      "red"
    ]
  ],
  [
    [
      "green",
      "double"
    ],
    [
      "green",
      "green"
    ]
  ],
  [
    [
      "blue",
      "double"
    ],
    [
      "blue",
      "blue"
    ]
  ],
  [
    [
      "grape",
      "double"
    ],
    [
      "grape",
      "grape"
    ]
  ],
  [
    [
      "banana",
      "double"
    ],
    [
      "banana",
      "banana"
    ]
  ],
  [
    [
      "ice",
      "double"
    ],
    [
      "ice",
      "ice"
    ]
  ],
  [
    [
      "scissors",
      "double"
    ],
    []
  ]

];