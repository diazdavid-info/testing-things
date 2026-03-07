import type { Game, PlayerKey } from "./game";
import { ADJACENCY, checkMill, getRemovablePositions, isPlayerBlocked, canPlayerFly } from "./board";

export type PlaceResult =
  | { ok: true; mill: boolean }
  | { ok: false; error: string };

export type RemoveResult =
  | { ok: true }
  | { ok: false; error: string };

export type MoveResult =
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

export function removePiece(
  game: Game,
  position: number,
  playerKey: PlayerKey,
): RemoveResult {
  if (game.status !== "playing") {
    return { ok: false, error: "La partida no esta en curso" };
  }

  if (game.turnState !== "remove") {
    return { ok: false, error: "No estas en estado de eliminacion" };
  }

  if (game.turn !== playerKey) {
    return { ok: false, error: "Espera tu turno" };
  }

  if (position < 0 || position > 23 || !Number.isInteger(position)) {
    return { ok: false, error: "Posicion invalida" };
  }

  if (game.board[position] === null) {
    return { ok: false, error: "Selecciona una ficha del rival" };
  }

  if (game.board[position] === playerKey) {
    return { ok: false, error: "Solo puedes eliminar fichas del rival" };
  }

  const removable = getRemovablePositions(game.board, playerKey);
  if (!removable.includes(position)) {
    return { ok: false, error: "No puedes eliminar una ficha que esta en un molino" };
  }

  // Remove the piece
  const rival: PlayerKey = playerKey === "player1" ? "player2" : "player1";
  game.board[position] = null;
  const rivalPlayer = game[rival]!;
  rivalPlayer.piecesOnBoard--;

  // Check if rival has fewer than 3 pieces and no pieces left to place
  if (rivalPlayer.piecesOnBoard < 3 && rivalPlayer.piecesToPlace === 0) {
    game.status = "finished";
    game.winner = playerKey;
    return { ok: true };
  }

  // Switch turn
  game.turn = rival;

  // Restore turnState based on current phase
  if (game.phase === "place") {
    game.turnState = "place";
    // Check if both players have placed all pieces
    const p1 = game.player1;
    const p2 = game.player2;
    if (p1.piecesToPlace === 0 && p2 && p2.piecesToPlace === 0) {
      game.phase = "move";
      game.turnState = "move";
    }
  } else {
    game.turnState = "move";
  }

  // Transition to fly phase if any player has exactly 3 pieces
  if (game.phase === "move") {
    const p1 = game.player1;
    const p2 = game.player2;
    if (
      (p1.piecesToPlace === 0 && p1.piecesOnBoard === 3) ||
      (p2 && p2.piecesToPlace === 0 && p2.piecesOnBoard === 3)
    ) {
      game.phase = "fly";
    }
  }

  return { ok: true };
}

function isValidPosition(pos: number): boolean {
  return Number.isInteger(pos) && pos >= 0 && pos <= 23;
}

export function movePiece(
  game: Game,
  from: number,
  to: number,
  playerKey: PlayerKey,
): MoveResult {
  if (game.status !== "playing") {
    return { ok: false, error: "La partida no esta en curso" };
  }

  if (game.phase !== "move" && game.phase !== "fly") {
    return { ok: false, error: "No estas en fase de movimiento" };
  }

  if (game.turnState !== "move") {
    return { ok: false, error: "No estas en estado de movimiento" };
  }

  if (game.turn !== playerKey) {
    return { ok: false, error: "Espera tu turno" };
  }

  if (!isValidPosition(from) || !isValidPosition(to)) {
    return { ok: false, error: "Posicion invalida" };
  }

  if (game.board[from] !== playerKey) {
    return { ok: false, error: "Solo puedes mover tus fichas" };
  }

  if (game.board[to] !== null) {
    return { ok: false, error: "Esa posicion ya esta ocupada" };
  }

  // Check if this player can fly (3 pieces, 0 to place). If not, must be adjacent.
  const player = game[playerKey]!;
  const isFlying = canPlayerFly(player.piecesOnBoard, player.piecesToPlace);
  if (!isFlying && !ADJACENCY[from].includes(to)) {
    return { ok: false, error: "Solo puedes mover a posiciones adyacentes" };
  }

  // Move the piece
  game.board[from] = null;
  game.board[to] = playerKey;

  // Check if a mill was formed at the destination
  const mill = checkMill(game.board, to, playerKey);

  if (mill) {
    game.turnState = "remove";
  } else {
    const rival: PlayerKey = playerKey === "player1" ? "player2" : "player1";
    game.turn = rival;
    game.turnState = "move";

    // Check if the rival is blocked (no valid moves)
    if (isPlayerBlocked(game.board, rival)) {
      game.status = "finished";
      game.winner = playerKey;
    }
  }

  return { ok: true, mill };
}
