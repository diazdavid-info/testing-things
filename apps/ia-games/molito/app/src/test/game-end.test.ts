// @vitest-environment node
import { describe, it, expect, beforeEach } from "vitest";
import { createGame, joinGame, clearStore } from "../lib/game";
import { removePiece, movePiece } from "../lib/game-actions";
import type { Game } from "../lib/game";

function moveGame(): Game {
  const game = createGame();
  joinGame(game.code);
  game.phase = "move";
  game.turnState = "move";
  game.player1.piecesToPlace = 0;
  game.player1.piecesOnBoard = 4;
  game.player2!.piecesToPlace = 0;
  game.player2!.piecesOnBoard = 4;
  return game;
}

describe("winReason", () => {
  beforeEach(() => clearStore());

  it("sets winReason to elimination when rival has < 3 pieces after remove", () => {
    const game = createGame();
    joinGame(game.code);
    game.phase = "move";
    game.turnState = "remove";
    game.turn = "player1";
    game.player1.piecesToPlace = 0;
    game.player1.piecesOnBoard = 5;
    game.player2!.piecesToPlace = 0;
    game.player2!.piecesOnBoard = 3;

    game.board[0] = "player1";
    game.board[1] = "player1";
    game.board[2] = "player1";
    game.board[5] = "player1";
    game.board[7] = "player1";
    game.board[3] = "player2";
    game.board[9] = "player2";
    game.board[16] = "player2";

    const result = removePiece(game, 16, "player1");
    expect(result).toEqual({ ok: true });
    expect(game.status).toBe("finished");
    expect(game.winner).toBe("player1");
    expect(game.winReason).toBe("elimination");
  });

  it("sets winReason to block when rival is blocked after move", () => {
    const game = moveGame();
    // Player2 has one piece at 0, surrounded by player1 at 1 and will be at 9
    game.board[0] = "player2";
    game.board[1] = "player1";
    game.board[21] = "player1"; // will move to 9
    game.board[5] = "player1";
    game.board[7] = "player1";
    game.player1.piecesOnBoard = 4;
    game.player2!.piecesOnBoard = 1;
    game.turn = "player1";

    // Move 21→9 blocks player2 at 0 (both adj 1 and 9 now player1)
    const result = movePiece(game, 21, 9, "player1");
    expect(result).toEqual({ ok: true, mill: false });
    expect(game.status).toBe("finished");
    expect(game.winner).toBe("player1");
    expect(game.winReason).toBe("block");
  });

  it("winReason is null when game is not finished", () => {
    const game = createGame();
    joinGame(game.code);
    expect(game.winReason).toBeNull();
  });
});
