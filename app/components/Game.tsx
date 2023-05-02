'use client';

import { useEffect, useState } from 'react';
import _ from 'lodash';

import { generateSudoku } from '../../lib/Sudoku';

import Board from './Board';

const NUMBERS_TO_REMOVE = 50;

function Game() {
   const sudoku = generateSudoku(NUMBERS_TO_REMOVE);
   const { solution, puzzle: p, allGuesses: g } = sudoku;
   const [puzzle, setPuzzle] = useState(p);
   const [allGuesses, setGuesses] = useState(g);
   const [gameState, setGameState] = useState({ remaining: -1 });
   const [notesMode, setNotesMode] = useState(false);

   const handleNotesMode = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setNotesMode(!notesMode);
   };

   const controls = [
      {
         name: 'Notes',
         handler: handleNotesMode,
         classes: notesMode ? 'notes' : '',
      },
      {
         name: 'Undo',
         handler: undefined,
      },
      {
         name: 'Erase',
         handler: undefined,
      },
   ];

   const newGame = (e) => {
      console.log('new game');
   };

   useEffect(() => {
      setGameState({
         remaining: _.filter(_.flattenDeep(puzzle), {
            solved: false,
         }).length,
      });
   }, [puzzle]);

   useEffect(() => {
      if (gameState.remaining === 0) {
         window.alert('Congrats');
      }
   }, [gameState]);

   return (
      <div className='game'>
         <div className='flex justify-center gap-2 w-full'>
            {controls.map(({ name, handler, classes }) => {
               return (
                  <div className={`control`} key={`${name}_control_div`}>
                     <button className={`${classes}`} onClick={handler}>
                        {name}
                     </button>
                  </div>
               );
            })}
         </div>
         <div className={`btn`}>
            <button className={`btn`} onClick={newGame}>
               New Game
            </button>
         </div>
         <Board
            puzzle={puzzle}
            setPuzzle={setPuzzle}
            allGuesses={allGuesses}
            setGuesses={setGuesses}
            solution={solution}
            notesMode={notesMode}
         ></Board>
      </div>
   );
}

export default Game;
