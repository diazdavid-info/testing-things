/**
 * Nine Men's Morris board topology.
 *
 * Position numbering (standard):
 *
 *  0 -------- 1 -------- 2
 *  |          |          |
 *  |  3 ----- 4 ----- 5 |
 *  |  |       |       |  |
 *  |  |  6 -- 7 -- 8 |  |
 *  |  |  |         |  |  |
 *  9--10-11       12-13-14
 *  |  |  |         |  |  |
 *  |  | 15 --16 --17 |  |
 *  |  |       |       |  |
 *  | 18 -----19 -----20 |
 *  |          |          |
 * 21 --------22 --------23
 */

export interface Position {
  x: number;
  y: number;
}

/** Logical grid coordinates (0–6) for each of the 24 positions. */
export const POSITIONS: Position[] = [
  // Outer square
  { x: 0, y: 0 }, // 0
  { x: 3, y: 0 }, // 1
  { x: 6, y: 0 }, // 2
  // Middle square
  { x: 1, y: 1 }, // 3
  { x: 3, y: 1 }, // 4
  { x: 5, y: 1 }, // 5
  // Inner square
  { x: 2, y: 2 }, // 6
  { x: 3, y: 2 }, // 7
  { x: 4, y: 2 }, // 8
  // Left-center row
  { x: 0, y: 3 }, // 9
  { x: 1, y: 3 }, // 10
  { x: 2, y: 3 }, // 11
  // Right-center row
  { x: 4, y: 3 }, // 12
  { x: 5, y: 3 }, // 13
  { x: 6, y: 3 }, // 14
  // Inner square bottom
  { x: 2, y: 4 }, // 15
  { x: 3, y: 4 }, // 16
  { x: 4, y: 4 }, // 17
  // Middle square bottom
  { x: 1, y: 5 }, // 18
  { x: 3, y: 5 }, // 19
  { x: 5, y: 5 }, // 20
  // Outer square bottom
  { x: 0, y: 6 }, // 21
  { x: 3, y: 6 }, // 22
  { x: 6, y: 6 }, // 23
];

/** Adjacency list: for each position index, the list of neighboring positions. */
export const ADJACENCY: readonly number[][] = [
  [1, 9],       // 0
  [0, 2, 4],    // 1
  [1, 14],      // 2
  [4, 10],      // 3
  [1, 3, 5, 7], // 4
  [4, 13],      // 5
  [7, 11],      // 6
  [4, 6, 8],    // 7
  [7, 12],      // 8
  [0, 10, 21],  // 9
  [3, 9, 11, 18], // 10
  [6, 10, 15],  // 11
  [8, 13, 17],  // 12
  [5, 12, 14, 20], // 13
  [2, 13, 23],  // 14
  [11, 16],     // 15
  [15, 17, 19], // 16
  [12, 16],     // 17
  [10, 19],     // 18
  [16, 18, 20, 22], // 19
  [13, 19],     // 20
  [9, 22],      // 21
  [19, 21, 23], // 22
  [14, 22],     // 23
];

/**
 * All 16 possible mills (lines of 3).
 * Each entry is a tuple of 3 position indices.
 */
export const MILLS: readonly [number, number, number][] = [
  // Outer square
  [0, 1, 2],
  [2, 14, 23],
  [21, 22, 23],
  [0, 9, 21],
  // Middle square
  [3, 4, 5],
  [5, 13, 20],
  [18, 19, 20],
  [3, 10, 18],
  // Inner square
  [6, 7, 8],
  [8, 12, 17],
  [15, 16, 17],
  [6, 11, 15],
  // Cross lines (connecting squares via midpoints)
  [1, 4, 7],
  [9, 10, 11],
  [12, 13, 14],
  [16, 19, 22],
];

/** Precomputed: for each position, which mills include it. */
const POSITION_MILLS: readonly number[][] = (() => {
  const result: number[][] = Array.from({ length: 24 }, () => []);
  MILLS.forEach((mill, idx) => {
    for (const pos of mill) {
      result[pos].push(idx);
    }
  });
  return result;
})();

import type { BoardCell, PlayerKey } from "./game";

/**
 * Check if placing a piece at `position` completes a mill for `playerKey`.
 * Only checks mills that include the given position.
 */
export function checkMill(
  board: BoardCell[],
  position: number,
  playerKey: PlayerKey,
): boolean {
  for (const millIdx of POSITION_MILLS[position]) {
    const [a, b, c] = MILLS[millIdx];
    if (board[a] === playerKey && board[b] === playerKey && board[c] === playerKey) {
      return true;
    }
  }
  return false;
}
