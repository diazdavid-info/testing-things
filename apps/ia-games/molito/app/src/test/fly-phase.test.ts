// @vitest-environment node
import { describe, it, expect, beforeEach } from "vitest";
import { createGame, joinGame, clearStore } from "../lib/game";
import { movePiece, removePiece } from "../lib/game-actions";
import { isPlayerBlocked, canPlayerFly } from "../lib/board";
import type { Game, BoardCell } from "../lib/game";

function emptyBoard(): BoardCell[] {
  return Array.from({ length: 24 }, () => null);
}

function flyGame(): Game {
  const game = createGame();
  joinGame(game.code);
  game.phase = "move";
  game.turnState = "move";
  game.player1.piecesToPlace = 0;
  game.player1.piecesOnBoard = 3;
  game.player2!.piecesToPlace = 0;
  game.player2!.piecesOnBoard = 5;
  return game;
}

describe("canPlayerFly", () => {
  it("returns true for 3 pieces on board, 0 to place", () => {
    expect(canPlayerFly(3, 0)).toBe(true);
  });

  it("returns false for 4 pieces on board", () => {
    expect(canPlayerFly(4, 0)).toBe(false);
  });

  it("returns false if pieces to place > 0", () => {
    expect(canPlayerFly(3, 1)).toBe(false);
  });
});

describe("isPlayerBlocked with fly", () => {
  it("returns false for player with 3 pieces (can fly)", () => {
    const board = emptyBoard();
    board[0] = "player1";
    board[1] = "player2"; // blocks right
    board[9] = "player2"; // blocks down
    // Only 1 piece but conceptually testing 3-piece rule
    // Actually need 3 pieces:
    board[2] = "player1";
    board[14] = "player2"; // blocks 2
    board[21] = "player1";
    board[22] = "player2"; // blocks 21 down
    // player1 has 3 pieces, all blocked adjacently, but can fly
    expect(isPlayerBlocked(board, "player1")).toBe(false);
  });

  it("returns true for player with 4+ pieces all blocked", () => {
    const board = emptyBoard();
    board[0] = "player1";
    board[1] = "player2";
    board[9] = "player2";
    board[2] = "player1";
    board[14] = "player2";
    board[21] = "player1";
    board[22] = "player2";
    board[6] = "player1"; // 4th piece
    board[7] = "player2"; // blocks 6 right
    board[11] = "player2"; // blocks 6 down
    expect(isPlayerBlocked(board, "player1")).toBe(true);
  });
});

describe("movePiece fly", () => {
  beforeEach(() => clearStore());

  it("allows non-adjacent move for player with 3 pieces", () => {
    const game = flyGame();
    game.board[0] = "player1";
    game.board[5] = "player1";
    game.board[7] = "player1";
    game.board[1] = "player2";
    game.board[3] = "player2";
    game.board[9] = "player2";
    game.board[16] = "player2";
    game.board[20] = "player2";
    game.turn = "player1";

    // Move from 0 to 23 (not adjacent) — should work because player1 has 3 pieces
    const result = movePiece(game, 0, 23, "player1");
    expect(result).toEqual({ ok: true, mill: false });
    expect(game.board[0]).toBeNull();
    expect(game.board[23]).toBe("player1");
  });

  it("rejects non-adjacent move for player with 4+ pieces", () => {
    const game = flyGame();
    game.player2!.piecesOnBoard = 4;
    game.board[1] = "player2";
    game.board[3] = "player2";
    game.board[9] = "player2";
    game.board[16] = "player2";
    game.board[0] = "player1";
    game.board[5] = "player1";
    game.board[7] = "player1";
    game.turn = "player2";

    // Player2 has 4 pieces, cannot fly
    const result = movePiece(game, 1, 22, "player2");
    expect(result).toEqual({ ok: false, error: "Solo puedes mover a posiciones adyacentes" });
  });

  it("detects mill formed during fly", () => {
    const game = flyGame();
    game.board[0] = "player1";
    game.board[2] = "player1";
    game.board[7] = "player1"; // will fly to 1 to form mill [0,1,2]
    game.board[3] = "player2";
    game.board[9] = "player2";
    game.board[16] = "player2";
    game.board[20] = "player2";
    game.board[21] = "player2";
    game.turn = "player1";

    const result = movePiece(game, 7, 1, "player1");
    expect(result).toEqual({ ok: true, mill: true });
    expect(game.turnState).toBe("remove");
  });
});

describe("removePiece transitions to fly phase", () => {
  beforeEach(() => clearStore());

  it("sets phase to fly when rival drops to 3 pieces after removal", () => {
    const game = createGame();
    joinGame(game.code);
    game.phase = "move";
    game.turnState = "remove";
    game.turn = "player1";
    game.player1.piecesToPlace = 0;
    game.player1.piecesOnBoard = 5;
    game.player2!.piecesToPlace = 0;
    game.player2!.piecesOnBoard = 4;

    game.board[0] = "player1";
    game.board[1] = "player1";
    game.board[2] = "player1";
    game.board[5] = "player1";
    game.board[7] = "player1";
    game.board[3] = "player2";
    game.board[9] = "player2";
    game.board[16] = "player2";
    game.board[20] = "player2";

    const result = removePiece(game, 20, "player1");
    expect(result).toEqual({ ok: true });
    expect(game.player2!.piecesOnBoard).toBe(3);
    expect(game.phase).toBe("fly");
  });

  it("does not set fly phase when rival has 4+ pieces", () => {
    const game = createGame();
    joinGame(game.code);
    game.phase = "move";
    game.turnState = "remove";
    game.turn = "player1";
    game.player1.piecesToPlace = 0;
    game.player1.piecesOnBoard = 5;
    game.player2!.piecesToPlace = 0;
    game.player2!.piecesOnBoard = 5;

    game.board[0] = "player1";
    game.board[1] = "player1";
    game.board[2] = "player1";
    game.board[5] = "player1";
    game.board[7] = "player1";
    game.board[3] = "player2";
    game.board[9] = "player2";
    game.board[16] = "player2";
    game.board[20] = "player2";
    game.board[21] = "player2";

    const result = removePiece(game, 21, "player1");
    expect(result).toEqual({ ok: true });
    expect(game.player2!.piecesOnBoard).toBe(4);
    expect(game.phase).toBe("move");
  });
});
