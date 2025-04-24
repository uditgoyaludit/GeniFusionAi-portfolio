import { create } from 'zustand';

interface Snippet {
  id: string;
  code: string;
}

interface Output {
  id: string;
  value: string;
  correctSnippetCode: string;
  matchedSnippet?: Snippet;
}

interface GameState {
  snippets: Snippet[];
  outputs: Output[];
  moveSnippet: (snippetId: string, outputId: string) => void;
  checkWin: () => void;
  generateRandomSnippets: () => void;
}

const snippetPool = [
  { code: 'console.log("Hello, World!");', output: 'Hello, World!' },
  { code: '[1, 2, 3].map(n => n * 2);', output: '[2, 4, 6]' },
  { code: 'let x = 5; x += 10;', output: '15' },
  { code: '[1, 2, 3].reduce((a, b) => a + b, 0);', output: '6' },
  { code: 'Math.max(10, 5, 8);', output: '10' },
  { code: '"abc".toUpperCase();', output: 'ABC' },
];

const getRandomItems = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const useStore = create<GameState>((set, get) => ({
  snippets: [],
  outputs: [],
  moveSnippet: (snippetId, outputId) => {
    set((state) => {
      const snippet = state.snippets.find((s) => s.id === snippetId);
      if (!snippet) return state;

      const newOutputs = state.outputs.map((output) =>
        output.id === outputId ? { ...output, matchedSnippet: snippet } : output,
      );

      const newSnippets = state.snippets.filter((s) => s.id !== snippetId);

      return { snippets: newSnippets, outputs: newOutputs };
    });
  },
  checkWin: () => {
    const { outputs } = get();
    const isWin = outputs.every((output) => output.matchedSnippet?.code === output.correctSnippetCode);

    if (isWin) {
      alert('Nice job! You matched the snippets correctly! Try another round!');
    }
  },
  generateRandomSnippets: () => {
    const selectedPairs = getRandomItems(snippetPool, 2);
    const newSnippets: Snippet[] = selectedPairs.map((pair, index) => ({
      id: `snippet-${index + 1}`,
      code: pair.code,
    }));
    const newOutputs: Output[] = selectedPairs.map((pair, index) => ({
      id: `out-${index + 1}`,
      value: pair.output,
      correctSnippetCode: pair.code,
    }));

    set({ snippets: newSnippets, outputs: newOutputs });
  },
}));