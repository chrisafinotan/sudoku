import { useState } from 'react';

import { initGuesses } from '../../lib/Sudoku';

// Components
import Cell from './Cell';

// Types
import {
   INT_CellValue,
   INT_HighlightedCells,
   INT_BoardProps,
} from '../../types';

// CSS
import '../styles/board.css';

const Board: React.FC<INT_BoardProps> = ({
   puzzle,
   setPuzzle,
   allGuesses,
   setGuesses,
   solution,
   notesMode,
}) => {
   const [highlightedCells, setHighlightCells] = useState<INT_HighlightedCells>(
      { row: -1, col: -1, num: -1 }
   );

   const highlightCells = (row: number, col: number, num: INT_CellValue) => {
      setHighlightCells({ row, col, num });
   };

   const updateCellGuesses = (x: number, y: number, numKey: number) => {
      const currentGuessesState = allGuesses.map((row, rowIndex) => {
         row.map((cell, cellIndex) => {
            if ((rowIndex === x || cellIndex === y) && cell[numKey] === true) {
               return Object.assign(cell, { [numKey]: false });
            }
            return cell;
         });
         return row;
      });
      setGuesses(currentGuessesState);
   };

   const setCellGuesses = (x: number, y: number, numKey: number) => {
      const currentGuessesState = allGuesses.map((row, rowIndex) => {
         if (rowIndex === x) {
            row.map((cell, cellIndex) => {
               if (cellIndex === y) {
                  if (numKey === -1) return Object.assign(cell, initGuesses());
                  const current = cell[numKey];
                  return Object.assign(cell, { [numKey]: !current });
               }
               return cell;
            });
         }
         return row;
      });
      setGuesses(currentGuessesState);
   };

   const setPuzzleState = (x: number, y: number, number: number) => {
      const currentPuzzleState = puzzle.map((row, rowIndex) => {
         if (rowIndex === x) {
            row.map((cell, cellIndex) => {
               if (cellIndex === y)
                  cell.solved = number === solution[rowIndex][cellIndex];
               return cell;
            });
         }
         return row;
      });
      setPuzzle(currentPuzzleState);
      updateCellGuesses(x, y, number);
   };

   return (
      <div className='board'>
         {puzzle.map((el, rowIndex) =>
            el.map((puzzleState, cellIndex) => (
               <Cell
                  key={`cell_${rowIndex}${cellIndex}`}
                  initial={puzzleState}
                  x={rowIndex}
                  y={cellIndex}
                  highlight={highlightCells}
                  highlightedCells={highlightedCells}
                  notesMode={notesMode}
                  answer={solution[rowIndex][cellIndex]}
                  setPuzzleState={setPuzzleState}
                  guesses={allGuesses[rowIndex][cellIndex]}
                  setCellGuesses={setCellGuesses}
               />
            ))
         )}
      </div>
   );
};

export default Board;
