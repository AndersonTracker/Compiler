
import { create } from 'zustand';

export const ended = "ε";

export const grammar = [
  {
    key: 'S',
    list: [
      { nonTerminal: "S", initial: ["a"], production: "aA" },
      { nonTerminal: "S", initial: ["b"], production: "bB" },
      { nonTerminal: "S", initial: ["c"], production: "Cc" }
    ]
  },
  {
    key: 'A',
    list: [
      { nonTerminal: "A", initial: ["a"], production: "aA" },
      { nonTerminal: "A", initial: ["d"], production: "d" }
    ]
  },
  {
    key: 'B',
    list: [
      { nonTerminal: "B", initial: ["b"], production: "b" },
      { nonTerminal: "B", initial: ["d"], production: ended }
    ]
  },
  {
    key: 'C',
    list: [
      { nonTerminal: "C", initial: ["a"], production: ended },
      { nonTerminal: "C", initial: ["c"], production: "cS" }
    ]
  }
];

export const getTerminal = () => {
  return Array.from(new Set(
    grammar.flatMap(rule => rule.list.flatMap(prod => prod.initial))
  )).sort().concat('$');
};

function searchProduction(pile, char) {
  const nonTerminal = grammar.find(rule => rule.key === pile);
  return nonTerminal?.list.find(prod => prod.nonTerminal === pile && prod.initial.includes(char)) || false;
}

function SentenceFunc() {
  let sentence = "S";
  let steps = 0;
  while (steps < 15) {
    const match = sentence.match(/[A-Z]/);
    if (!match) return sentence;

    const nTerminal = match[0];
    const rule = grammar.find(r => r.key === nTerminal);
    const prod = rule.list[Math.floor(Math.random() * rule.list.length)];

    sentence = sentence.replace(nTerminal, prod.production !== ended ? prod.production : '');
    steps++;
  }
  return SentenceFunc();
}

export function next({ entry, sentence, pile, iteration, end, resolver, log }) {
  if (!sentence.length) return { entry, sentence, pile, iteration, end: true, resolver, log };

  if (end) {
    return {
      entry: sentence + "$", sentence, pile: "$S", iteration: 0, end: false, resolver: [], log: ''
    };
  }

  entry ||= sentence + "$";
  const charPile = pile.slice(-1);
  const pileTable = pile;
  const entryTable = entry;
  pile = pile.slice(0, -1);
  iteration++;
  let action = "";

  if (charPile === entry[0] && charPile === "$") {
    action = `Accept in ${iteration} iterations`;
    end = true;
  } else if (charPile && charPile === charPile.toUpperCase()) {
    const prod = searchProduction(charPile, entry[0]);
    if (prod) {
      action = `${prod.nonTerminal} -> ${prod.production}`;
      if (prod.production !== ended) pile += prod.production.split('').reverse().join('');
    } else {
      end = true;
      action = `Error in ${iteration} iterations!`;
    }
  } else if (charPile === entry[0]) {
    action = `Read '${entry[0]}'`;
    log += entry[0];
    entry = entry.slice(1);
  } else {
    end = true;
    action = `Error in ${iteration} iterations!`;
  }

  resolver.push([pileTable, entryTable, action]);
  return { entry, sentence, pile, iteration, end, resolver, topEntry: entry[0], action, log };
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
    })),
    next: () => set(state => {
      const newState = next(state.state);
      return { state: { ...state.state, ...newState } };
    }),
    ResolverSentence: () => set(state => {
      let newState = next(state.state);
      while (!newState.end) newState = next({ ...state.state, ...newState });
      return { state: { ...state.state, ...newState } };
    }),
  }
}));


