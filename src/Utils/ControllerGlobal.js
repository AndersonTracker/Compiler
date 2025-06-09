
import { create } from 'zustand';

export const end = "ε";

export const grammar = [
  {
    key: 'S',
    list: [
      { nonTerminal: "S", initial: ["a"], production: "aA" },
      { nonTerminal: "S", initial: ["b"], production: "bB" },
      { nonTerminal: "S", initial: ["c"], production: "Cc" },
      { nonTerminal: "S", initial: ["d"], production: "-" },
      { nonTerminal: "S", initial: ["$"], production: "-" },
    ]
  },
  {
    key: 'A',
    list: [
      { nonTerminal: "A", initial: ["a"], production: "aA" },
      { nonTerminal: "A", initial: ["b"], production: "-" },
      { nonTerminal: "A", initial: ["c"], production: "-" },
      { nonTerminal: "A", initial: ["d"], production: "d" },
      { nonTerminal: "A", initial: ["$"], production: "-" },
    ]
  },
  {
    key: 'B',
    list: [
      { nonTerminal: "B", initial: ["a"], production: "-" },
      { nonTerminal: "B", initial: ["b"], production: "b" },
      { nonTerminal: "B", initial: ["c"], production: "-" },
      { nonTerminal: "B", initial: ["d"], production: end },
      { nonTerminal: "B", initial: ["$"], production: "-" }
    ]
  },
  {
    key: 'C',
    list: [
      { nonTerminal: "C", initial: ["a"], production: end },
      { nonTerminal: "c", initial: ["b"], production: "-" },
      { nonTerminal: "C", initial: ["c"], production: "cS" },
      { nonTerminal: "C", initial: ["d"], production: "-" },
      { nonTerminal: "C", initial: ["$"], production: "-" }
    ]
  }
];

export const getTerminal = () => {
  return Array.from(new Set(
    grammar.flatMap(rule => rule.list.flatMap(prod => prod.initial))
  )).sort().concat('$');
};

export const ControllerGlobal = create((set) => ({
  state: {
    grammar: grammar,
    sentence: '',
    terminal: getTerminal(),
    pile: '$S',
    entry: '',
    action: '',
    iteration: 0,
    end: false,
    resolver: [],
    topEntry: '',
    log: ''
  },
  actions: {
    changeSentenceGrammar: (s) => set(state => ({
      state: { ...state.state, sentence: s, resolver: [], iteration: 0, pile: "$S", entry: "", end: false, action: '', topEntry: s[0], log: '' }
    }))
  }
}));
