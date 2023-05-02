import _ from 'lodash';
import { INT_Guesses, INT_Puzzle } from '../src/types/cellTypes';
const N = 9;
const SRN = Math.floor(Math.sqrt(N));

interface ObjNumber {
   [key: number]: boolean;
}

const randomGenerator = (items: ObjNumber): number => {
   const numbers = Object.entries(items)
      .filter(([_, bool]) => bool === false)
      .map(([num]) => Number(num));
   return Number(numbers[Math.floor(Math.random() * numbers.length)]);
};

const unUsedInRow = (i: number, num: number, mat: number[][]) => {
   for (let j = 0; j < N; j++) {
      if (mat[i][j] === num) {
         return false;
      }
   }
   return true;
};

const unUsedInCol = (j: number, num: number, mat: number[][]) => {
   for (let i = 0; i < N; i++) {
      if (mat[i][j] === num) {
         return false;
      }
   }
   return true;
};

const unUsedInBox = (
   rowStart: number,
   colStart: number,
   num: number,
   mat: number[][]
) => {
   for (let i = 0; i < SRN; i++) {
      for (let j = 0; j < SRN; j++) {
         if (mat[rowStart + i][colStart + j] === num) {
            return false;
         }
      }
   }
   return true;
};

const checkIfSafe = (i: number, j: number, num: number, mat: number[][]) => {
   return (
      unUsedInRow(i, num, mat) &&
      unUsedInCol(j, num, mat) &&
      unUsedInBox(i - (i % SRN), j - (j % SRN), num, mat)
   );
};

const fillBox = (row: number, col: number, mat: number[][]) => {
   let num = 0;
   const items: ObjNumber = {};
   for (let i = 1; i <= N; i++) {
      items[i] = false;
   }
   for (let i = 0; i < SRN; i++) {
      for (let j = 0; j < SRN; j++) {
         num = randomGenerator(items);
         items[num] = true;
         mat[row + i][col + j] = num;
      }
   }
   return mat;
};

const fillDiagonal = (mat: number[][]) => {
   for (let i = 0; i < N; i += SRN) {
      mat = fillBox(i, i, mat);
   }
   return mat;
};

const fillRemaining = (i: number, j: number, mat: number[][]): any => {
   if (i === N - 1 && j === N) {
      return mat;
   }
   if (j === N) {
      i += 1;
      j = 0;
   }
   if (mat[i][j] !== 0) {
      return fillRemaining(i, j + 1, mat);
   }
   for (let num = 1; num <= N; num++) {
      if (checkIfSafe(i, j, num, mat)) {
         mat[i][j] = num;
         if (fillRemaining(i, j + 1, mat)) {
            return mat;
         }
         mat[i][j] = 0;
      }
   }
   return false;
};

const removeKDigits = (K: number, mat: number[][]) => {
   let count = K;
   const removed = Array.from({ length: N }, (): ObjNumber => {
      return {};
   });
   const rows: ObjNumber = {};
   for (let i = 0; i < N; i++) {
      rows[i] = false;
      for (let j = 0; j < N; j++) {
         removed[i][j] = false;
      }
   }
   while (count !== 0) {
      let i = randomGenerator(rows);
      let j = randomGenerator(removed[i]);
      if (mat[i][j] !== 0) {
         removed[i][j] = true;
         mat[i][j] = 0;
         count--;
      }
   }
   return mat;
};

export const initGuesses = () => {
   const list: INT_Guesses = {};
   Array.from({ length: 9 }, (_, i) => i + 1).forEach((number) => {
      list[number] = false;
   });
   return list;
};

export const generateSudoku = (K: number) => {
   const mat = Array.from({ length: N }, () =>
      Array.from({ length: N }, () => 0)
   );
   fillDiagonal(mat);

   const solution = fillRemaining(0, SRN, _.cloneDeep(mat));

   const puzzle0 = removeKDigits(K, _.cloneDeep(solution));
   const puzzle: INT_Puzzle[][] = puzzle0.map((row) => {
      return row.map((value) => {
         return {
            initSolved: value == 0 ? false : true,
            solved: value == 0 ? false : true,
            value,
         };
      });
   });

   const allGuesses = Array.from({ length: N }, () =>
      Array.from({ length: N }, () => initGuesses())
   );

   // console.log({ solution, puzzle, allGuesses });

   return { solution, puzzle, allGuesses };
};
