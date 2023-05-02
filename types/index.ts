export type INT_CellValue = number;

export interface INT_CellProps {
   initial: INT_Puzzle;
   x: number;
   y: number;
   highlight: (row: number, col: number, num: INT_CellValue) => void;
   highlightedCells: INT_HighlightedCells;
   notesMode: any;
   answer: number;
   // setSolvedCell: (x: number, y: number, isSolved: boolean) => any;
   setPuzzleState: (x: number, y: number, number: number) => any;
   guesses: INT_Guesses;
   setCellGuesses: (x: number, y: number, numKey: number) => any;
}

export interface INT_HighlightedCells {
   row: number;
   col: number;
   num: INT_CellValue;
}

export interface INT_Guesses {
   [key: number]: boolean;
}

export interface INT_Puzzle {
   value: number;
   solved: boolean;
   initSolved: boolean;
}

export interface INT_BoardProps {
   puzzle: INT_Puzzle[][];
   setPuzzle: any;
   allGuesses: INT_Guesses[][];
   setGuesses: any;
   solution: number[][];
   notesMode: any;
}
