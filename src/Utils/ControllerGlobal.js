
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

function SentenceFunc() {
  let sentence = "S", steps = 0;
  while (steps < 15) {
    const match = sentence.match(/[A-Z]/);
    if (!match) return sentence;

    const nTerminal = match[0];
    const rule = grammar.find(r => r.key === nTerminal);
    const prod = rule.list[Math.floor(Math.random() * rule.list.length)];

    sentence = sentence.replace(nTerminal, prod.production !== end ? prod.production : '');
    steps++;
  }
  return SentenceFunc();
}

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
    SentenceSuccess: () => set(state => {
      const s = SentenceFunc();
      return { state: { ...state.state, sentence: s, resolver: [], iteration: 0, pile: "$S", entry: "", end: false, action: '', topEntry: s[0], log: '' } };
    }),
    SentenceError: () => set(state => {
      const s = SentenceFunc();
      const sErr = s + s[s.length - 1];
      return { state: { ...state.state, sentence: sErr, resolver: [], iteration: 0, pile: "$S", entry: "", end: false, action: '', topEntry: sErr[0], log: '' } };
    }),
    changeSentenceGrammar: (s) => set(state => ({
      state: { ...state.state, sentence: s, resolver: [], iteration: 0, pile: "$S", entry: "", end: false, action: '', topEntry: s[0], log: '' }
    }))
  }
}));


