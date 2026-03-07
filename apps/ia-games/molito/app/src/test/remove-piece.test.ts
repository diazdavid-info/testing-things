// @vitest-environment node
import { describe, it, expect, beforeEach } from "vitest";
import { createGame, joinGame, clearStore } from "../lib/game";
import { placePiece, removePiece } from "../lib/game-actions";
import { getRemovablePositions, getFormedMills } from "../lib/board";
import type { Game, BoardCell } from "../lib/game";

function startedGame(): Game {
  const game = createGame();
  joinGame(game.code);
  return game;
}

function emptyBoard(): BoardCell[] {
  return Array.from({ length: 24 }, () => null);
}

describe("getRemovablePositions", () => {
  it("returns rival pieces not in a mill", () => {
    const board = emptyBoard();
    board[0] = "player2";
    board[3] = "player2";
    board[9] = "player2";
    const result = getRemovablePositions(board, "player1");
    expect(result).toEqual([0, 3, 9]);
  });

  it("excludes rival pieces in an active mill", () => {
    const board = emptyBoard();
    // Mill [0,1,2] for player2
    board[0] = "player2";
    board[1] = "player2";
    board[2] = "player2";
    // Non-mill piece
    board[9] = "player2";
    const result = getRemovablePositions(board, "player1");
    expect(result).toEqual([9]);
  });

  it("returns all rival pieces if all are in mills", () => {
    const board = emptyBoard();
    // Mill [0,1,2] and mill [3,4,5]
    board[0] = "player2";
    board[1] = "player2";
    board[2] = "player2";
    board[3] = "player2";
    board[4] = "player2";
    board[5] = "player2";
    const result = getRemovablePositions(board, "player1");
    expect(result).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it("does not return empty positions or own pieces", () => {
    const board = emptyBoard();
    board[0] = "player1";
    board[1] = "player2";
    const result = getRemovablePositions(board, "player1");
    expect(result).toEqual([1]);
  });
});

describe("getFormedMills", () => {
  it("returns the mill positions when a mill is formed", () => {
    const board = emptyBoard();
    board[0] = "player1";
    board[1] = "player1";
    board[2] = "player1";
    const result = getFormedMills(board, 2, "player1");
    expect(result).toEqual([[0, 1, 2]]);
  });

  it("returns empty array when no mill is formed", () => {
    const board = emptyBoard();
    board[0] = "player1";
    board[1] = "player1";
    const result = getFormedMills(board, 1, "player1");
    expect(result).toEqual([]);
  });

  it("returns multiple mills when position completes two mills", () => {
    const board = emptyBoard();
    // Position 1 is in mills [0,1,2] and [1,4,7]
    board[0] = "player1";
    board[1] = "player1";
    board[2] = "player1";
    board[4] = "player1";
    board[7] = "player1";
    const result = getFormedMills(board, 1, "player1");
    expect(result).toHaveLength(2);
    expect(result).toContainEqual([0, 1, 2]);
    expect(result).toContainEqual([1, 4, 7]);
  });
});

describe("removePiece", () => {
  beforeEach(() => clearStore());

  it("removes a valid rival piece", () => {
    const game = startedGame();
    game.board[0] = "player1";
    game.board[1] = "player1";
    game.board[2] = "player1";
    game.board[9] = "player2";
    game.player1.piecesOnBoard = 3;
    game.player2!.piecesOnBoard = 1;
    game.player2!.piecesToPlace = 8;
    game.turnState = "remove";
    game.turn = "player1";

    const result = removePiece(game, 9, "player1");
    expect(result).toEqual({ ok: true });
    expect(game.board[9]).toBeNull();
  });

  it("decrements rival piecesOnBoard", () => {
    const game = startedGame();
    game.board[0] = "player2";
    game.board[3] = "player1";
    game.player2!.piecesOnBoard = 1;
    game.player2!.piecesToPlace = 8;
    game.player1.piecesOnBoard = 1;
    game.turnState = "remove";
    game.turn = "player1";

    removePiece(game, 0, "player1");
    expect(game.player2!.piecesOnBoard).toBe(0);
  });

  it("switches turn after removing", () => {
    const game = startedGame();
    game.board[0] = "player2";
    game.board[3] = "player1";
    game.player2!.piecesOnBoard = 5;
    game.player2!.piecesToPlace = 4;
    game.player1.piecesOnBoard = 1;
    game.turnState = "remove";
    game.turn = "player1";

    removePiece(game, 0, "player1");
    expect(game.turn).toBe("player2");
  });

  it("rejects removing own piece", () => {
    const game = startedGame();
    game.board[0] = "player1";
    game.player1.piecesOnBoard = 1;
    game.turnState = "remove";
    game.turn = "player1";

    const result = removePiece(game, 0, "player1");
    expect(result).toEqual({ ok: false, error: "Solo puedes eliminar fichas del rival" });
  });

  it("rejects removing empty position", () => {
    const game = startedGame();
    game.turnState = "remove";
    game.turn = "player1";

    const result = removePiece(game, 5, "player1");
    expect(result).toEqual({ ok: false, error: "Selecciona una ficha del rival" });
  });

  it("rejects when turnState is not remove", () => {
    const game = startedGame();
    game.board[0] = "player2";
    game.turn = "player1";

    const result = removePiece(game, 0, "player1");
    expect(result).toEqual({ ok: false, error: "No estas en estado de eliminacion" });
  });

  it("rejects removing a piece in an active mill", () => {
    const game = startedGame();
    // Player2 mill at [0,1,2]
    game.board[0] = "player2";
    game.board[1] = "player2";
    game.board[2] = "player2";
    game.board[9] = "player2";
    game.player2!.piecesOnBoard = 4;
    game.player1.piecesOnBoard = 3;
    game.turnState = "remove";
    game.turn = "player1";

    const result = removePiece(game, 0, "player1");
    expect(result).toEqual({ ok: false, error: "No puedes eliminar una ficha que esta en un molino" });
  });

  it("allows removing a mill piece if ALL rival pieces are in mills", () => {
    const game = startedGame();
    // Player2 has all pieces in mills: [0,1,2] and [3,4,5]
    game.board[0] = "player2";
    game.board[1] = "player2";
    game.board[2] = "player2";
    game.board[3] = "player2";
    game.board[4] = "player2";
    game.board[5] = "player2";
    game.player2!.piecesOnBoard = 6;
    game.player2!.piecesToPlace = 3;
    game.player1.piecesOnBoard = 3;
    game.turnState = "remove";
    game.turn = "player1";

    const result = removePiece(game, 0, "player1");
    expect(result).toEqual({ ok: true });
    expect(game.board[0]).toBeNull();
  });

  it("ends game when rival has fewer than 3 pieces and none to place", () => {
    const game = startedGame();
    game.board[0] = "player2";
    game.board[9] = "player2";
    game.board[21] = "player2";
    game.board[3] = "player1";
    game.player2!.piecesOnBoard = 3;
    game.player2!.piecesToPlace = 0;
    game.player1.piecesOnBoard = 1;
    game.turnState = "remove";
    game.turn = "player1";

    removePiece(game, 0, "player1");
    expect(game.status).toBe("finished");
    expect(game.winner).toBe("player1");
  });

  it("restores turnState to place during place phase", () => {
    const game = startedGame();
    game.board[0] = "player2";
    game.board[3] = "player1";
    game.player2!.piecesOnBoard = 5;
    game.player2!.piecesToPlace = 4;
    game.player1.piecesOnBoard = 1;
    game.phase = "place";
    game.turnState = "remove";
    game.turn = "player1";

    removePiece(game, 0, "player1");
    expect(game.turnState).toBe("place");
  });

  it("restores turnState to move during move phase", () => {
    const game = startedGame();
    game.board[0] = "player2";
    game.board[3] = "player1";
    game.player2!.piecesOnBoard = 5;
    game.player2!.piecesToPlace = 0;
    game.player1.piecesOnBoard = 1;
    game.player1.piecesToPlace = 0;
    game.phase = "move";
    game.turnState = "remove";
    game.turn = "player1";

    removePiece(game, 0, "player1");
    expect(game.turnState).toBe("move");
  });
});
