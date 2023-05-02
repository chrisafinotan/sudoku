import { useState, useEffect } from 'react';
import clsx from 'clsx';

// Types
import {
   INT_CellProps,
   INT_CellValue,
   INT_HighlightedCells,
} from '../../types';

// CSS
import '../styles/cell.css';

const Cell: React.FC<INT_CellProps> = ({
   initial,
   x,
   y,
   highlight,
   highlightedCells,
   notesMode,
   answer,
   setPuzzleState,
   guesses,
   setCellGuesses,
}) => {
   const { value, initSolved } = initial;
   const [cellVal, setNumber] = useState<INT_CellValue>(
      value !== 0 ? value : -1
   );

   const { row, col, num }: INT_HighlightedCells = highlightedCells;
   const inRow = () => {
      if (row === x) return true;
   };
   const inCol = () => {
      if (col === y) return true;
   };
   const inBox = () => {
      if (
         Math.floor(x / 3) === Math.floor(row / 3) &&
         x % 3 < 3 &&
         Math.floor(y / 3) === Math.floor(col / 3) &&
         y % 3 < 3
      )
         return true;
   };
   const isSameNum = () => {
      if (cellVal < 0) return false;
      if (cellVal && num === cellVal) return true;
   };
   const isCorrect = () => {
      if (initSolved) return '';
      if (answer === cellVal) return 'correct';
      else return 'wrong';
   };

   const highlightBack: boolean | undefined = inRow() || inCol() || inBox();
   const sameNum: boolean | undefined = isSameNum();

   const handleKeyPress = (e) => {
      if (!notesMode) return;
      if (e.key === 'Backspace') {
         setCellGuesses(x, y, -1);
         return;
      }
      const numKey = Number(e.key);
      if (!isNaN(numKey) && numKey > 0) {
         setCellGuesses(x, y, numKey);
         return;
      }
   };

   const handleCellInput = (e) => {
      const string = e.target.value.slice(-1);
      if (!string) return setNumber(-1);
      const number = Number(string);
      setNumber((prev) => {
         return !isNaN(number) && number > 0 ? number : prev;
      });
      setPuzzleState(x, y, number);
   };

   useEffect(() => {
      highlight(x, y, cellVal);
   }, [cellVal]);

   return (
      <div
         className={`cell ${x > 0 && x % 3 === 0 ? 'topBorder' : ''} 
         ${y > 0 && y % 3 === 0 ? 'leftBorder' : ''} 
         ${highlightBack && 'highlight'} 
         ${sameNum && 'selected'}`}
         // onFocus={() => setActive(true)}
         onKeyUp={handleKeyPress}
      >
         <input
            className={clsx('cellinput', {
               'bg-red-400': isCorrect() === 'wrong',
               'bg-green-400': isCorrect() === 'correct',
            })}
            value={cellVal === -1 ? '' : cellVal}
            name='cellinput'
            type='number'
            onChange={handleCellInput}
            onFocus={() => highlight(x, y, cellVal)}
            readOnly={initSolved || notesMode}
         ></input>

         {cellVal === -1 && (
            <div className='guesses'>
               {Object.entries(guesses).map(([guess, val]) => {
                  return (
                     <div key={`guess_${x}${y}_${guess}`} className='guess'>
                        {val ? guess : undefined}
                     </div>
                  );
               })}
            </div>
         )}
      </div>
   );
};
export default Cell;
