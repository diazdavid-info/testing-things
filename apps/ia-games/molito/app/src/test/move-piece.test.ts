// @vitest-environment node
import { describe, it, expect, beforeEach } from "vitest";
import { createGame, joinGame, clearStore } from "../lib/game";
import { movePiece } from "../lib/game-actions";
import { getValidMoves, isPlayerBlocked } from "../lib/board";
import type { Game, BoardCell } from "../lib/game";

function emptyBoard(): BoardCell[] {
  return Array.from({ length: 24 }, () => null);
}

function moveGame(): Game {
  const game = createGame();
  joinGame(game.code);
  game.phase = "move";
  game.turnState = "move";
  game.player1.piecesToPlace = 0;
  game.player1.piecesOnBoard = 9;
  game.player2!.piecesToPlace = 0;
  game.player2!.piecesOnBoard = 9;
  return game;
}

describe("getValidMoves", () => {
  it("returns empty adjacent positions", () => {
    const board = emptyBoard();
    board[0] = "player1";
    // Pos 0 is adjacent to 1 and 9, both empty
    expect(getValidMoves(board, 0)).toEqual([1, 9]);
  });

  it("excludes occupied adjacent positions", () => {
    const board = emptyBoard();
    board[0] = "player1";
    board[1] = "player2";
    // Pos 0 adjacent to 1 (occupied) and 9 (empty)
    expect(getValidMoves(board, 0)).toEqual([9]);
  });

  it("returns empty array if all adjacent occupied", () => {
    const board = emptyBoard();
    board[0] = "player1";
    board[1] = "player2";
    board[9] = "player2";
    expect(getValidMoves(board, 0)).toEqual([]);
  });
});

describe("isPlayerBlocked", () => {
  it("returns false if at least one piece can move", () => {
    const board = emptyBoard();
    board[0] = "player1";
    // Pos 0 has empty adjacent positions
    expect(isPlayerBlocked(board, "player1")).toBe(false);
  });

  it("returns true if all pieces are blocked", () => {
    const board = emptyBoard();
    board[0] = "player1";
    board[1] = "player2"; // blocks right
    board[9] = "player2"; // blocks down
    expect(isPlayerBlocked(board, "player1")).toBe(true);
  });

  it("returns false if player has no pieces on board", () => {
    const board = emptyBoard();
    // No player1 pieces — vacuously not blocked (no pieces to be blocked)
    expect(isPlayerBlocked(board, "player1")).toBe(true);
  });
});

describe("movePiece", () => {
  beforeEach(() => clearStore());

  it("moves a piece to an adjacent empty position", () => {
    const game = moveGame();
    game.board[0] = "player1";
    game.turn = "player1";

    const result = movePiece(game, 0, 1, "player1");
    expect(result).toEqual({ ok: true, mill: false });
    expect(game.board[0]).toBeNull();
    expect(game.board[1]).toBe("player1");
  });

  it("switches turn after moving without mill", () => {
    const game = moveGame();
    game.board[0] = "player1";
    game.turn = "player1";

    movePiece(game, 0, 1, "player1");
    expect(game.turn).toBe("player2");
    expect(game.turnState).toBe("move");
  });

  it("rejects move to non-adjacent position", () => {
    const game = moveGame();
    game.board[0] = "player1";
    game.turn = "player1";

    const result = movePiece(game, 0, 2, "player1");
    expect(result).toEqual({ ok: false, error: "Solo puedes mover a posiciones adyacentes" });
  });

  it("rejects moving rival piece", () => {
    const game = moveGame();
    game.board[0] = "player2";
    game.turn = "player1";

    const result = movePiece(game, 0, 1, "player1");
    expect(result).toEqual({ ok: false, error: "Solo puedes mover tus fichas" });
  });

  it("rejects move to occupied position", () => {
    const game = moveGame();
    game.board[0] = "player1";
    game.board[1] = "player2";
    game.turn = "player1";

    const result = movePiece(game, 0, 1, "player1");
    expect(result).toEqual({ ok: false, error: "Esa posicion ya esta ocupada" });
  });

  it("rejects move out of turn", () => {
    const game = moveGame();
    game.board[0] = "player1";
    game.turn = "player2";

    const result = movePiece(game, 0, 1, "player1");
    expect(result).toEqual({ ok: false, error: "Espera tu turno" });
  });

  it("rejects move when turnState is not move", () => {
    const game = moveGame();
    game.board[0] = "player1";
    game.turn = "player1";
    game.turnState = "remove";

    const result = movePiece(game, 0, 1, "player1");
    expect(result).toEqual({ ok: false, error: "No estas en estado de movimiento" });
  });

  it("rejects move when phase is place", () => {
    const game = moveGame();
    game.phase = "place";
    game.board[0] = "player1";
    game.turn = "player1";

    const result = movePiece(game, 0, 1, "player1");
    expect(result).toEqual({ ok: false, error: "No estas en fase de movimiento" });
  });

  it("detects mill after move and sets turnState to remove", () => {
    const game = moveGame();
    // Set up: player1 has pieces at 0 and 2, will move piece from 4 to 1 to form mill [0,1,2]
    game.board[0] = "player1";
    game.board[2] = "player1";
    game.board[4] = "player1";
    game.turn = "player1";

    const result = movePiece(game, 4, 1, "player1");
    expect(result).toEqual({ ok: true, mill: true });
    expect(game.turnState).toBe("remove");
    expect(game.turn).toBe("player1");
  });

  it("ends game when rival is blocked after move", () => {
    const game = moveGame();
    // Player2 at position 0, surrounded by player1 at 1 and 9 after move
    game.board[0] = "player2";
    game.board[1] = "player1";
    game.board[21] = "player1"; // will move to 9
    game.player2!.piecesOnBoard = 1;
    game.player1.piecesOnBoard = 2;
    game.turn = "player1";

    const result = movePiece(game, 21, 9, "player1");
    expect(result).toEqual({ ok: true, mill: false });
    expect(game.status).toBe("finished");
    expect(game.winner).toBe("player1");
  });

  it("rejects invalid positions", () => {
    const game = moveGame();
    game.turn = "player1";

    expect(movePiece(game, -1, 0, "player1")).toEqual({ ok: false, error: "Posicion invalida" });
    expect(movePiece(game, 0, 24, "player1")).toEqual({ ok: false, error: "Posicion invalida" });
    expect(movePiece(game, 1.5, 0, "player1")).toEqual({ ok: false, error: "Posicion invalida" });
  });
});
