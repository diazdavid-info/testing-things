import type { Game, PlayerKey } from "./game";
import { checkMill } from "./board";

export type PlaceResult =
  | { ok: true; mill: boolean }
  | { ok: false; error: string };

export function placePiece(
  game: Game,
  position: number,
  playerKey: PlayerKey,
): PlaceResult {
  if (game.status !== "playing") {
    return { ok: false, error: "La partida no esta en curso" };
  }

  if (game.phase !== "place") {
    return { ok: false, error: "No estas en fase de colocacion" };
  }

  if (game.turn !== playerKey) {
    return { ok: false, error: "Espera tu turno" };
  }

  if (position < 0 || position > 23 || !Number.isInteger(position)) {
    return { ok: false, error: "Posicion invalida" };
  }

  const player = game[playerKey];
  if (!player || player.piecesToPlace <= 0) {
    return { ok: false, error: "No tienes fichas por colocar" };
  }

  if (game.board[position] !== null) {
    return { ok: false, error: "Esa posicion ya esta ocupada" };
  }

  // Place the piece
  game.board[position] = playerKey;
  player.piecesToPlace--;
  player.piecesOnBoard++;

  // Check if a mill was formed
  const mill = checkMill(game.board, position, playerKey);

  if (mill) {
    game.turnState = "remove";
  } else {
    // Switch turn
    game.turn = playerKey === "player1" ? "player2" : "player1";
    game.turnState = "place";
  }

  // Check if placement phase is over
  const p1 = game.player1;
  const p2 = game.player2;
  if (p1.piecesToPlace === 0 && p2 && p2.piecesToPlace === 0 && !mill) {
    game.phase = "move";
    game.turnState = "move";
  }

  return { ok: true, mill };
}
