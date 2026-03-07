// @vitest-environment node
import { describe, it, expect, beforeEach } from "vitest";
import { createGame, joinGame, clearStore } from "../lib/game";
import { placePiece } from "../lib/game-actions";
import type { Game } from "../lib/game";

function startedGame(): Game {
  const game = createGame();
  joinGame(game.code);
  return game;
}

describe("placePiece", () => {
  beforeEach(() => clearStore());

  it("places a piece on an empty position", () => {
    const game = startedGame();
    const result = placePiece(game, 0, "player1");
    expect(result).toEqual({ ok: true, mill: false });
    expect(game.board[0]).toBe("player1");
  });

  it("decrements piecesToPlace and increments piecesOnBoard", () => {
    const game = startedGame();
    placePiece(game, 0, "player1");
    expect(game.player1.piecesToPlace).toBe(8);
    expect(game.player1.piecesOnBoard).toBe(1);
  });

  it("switches turn after placing", () => {
    const game = startedGame();
    expect(game.turn).toBe("player1");
    placePiece(game, 0, "player1");
    expect(game.turn).toBe("player2");
  });

  it("rejects placement on occupied position", () => {
    const game = startedGame();
    placePiece(game, 0, "player1");
    const result = placePiece(game, 0, "player2");
    expect(result).toEqual({ ok: false, error: "Esa posicion ya esta ocupada" });
  });

  it("rejects placement out of turn", () => {
    const game = startedGame();
    const result = placePiece(game, 0, "player2");
    expect(result).toEqual({ ok: false, error: "Espera tu turno" });
  });

  it("rejects negative position", () => {
    const game = startedGame();
    const result = placePiece(game, -1, "player1");
    expect(result).toEqual({ ok: false, error: "Posicion invalida" });
  });

  it("rejects position > 23", () => {
    const game = startedGame();
    const result = placePiece(game, 24, "player1");
    expect(result).toEqual({ ok: false, error: "Posicion invalida" });
  });

  it("rejects non-integer position", () => {
    const game = startedGame();
    const result = placePiece(game, 1.5, "player1");
    expect(result).toEqual({ ok: false, error: "Posicion invalida" });
  });

  it("rejects when game is not playing", () => {
    const game = createGame();
    const result = placePiece(game, 0, "player1");
    expect(result).toEqual({ ok: false, error: "La partida no esta en curso" });
  });

  it("rejects when game is not in place phase", () => {
    const game = startedGame();
    game.phase = "move";
    const result = placePiece(game, 0, "player1");
    expect(result).toEqual({ ok: false, error: "No estas en fase de colocacion" });
  });

  it("detects mill and sets turnState to remove", () => {
    const game = startedGame();
    // Place a mill on positions 0, 1, 2 (top row outer square)
    game.board[0] = "player1";
    game.board[1] = "player1";
    game.player1.piecesToPlace = 7;
    game.player1.piecesOnBoard = 2;

    const result = placePiece(game, 2, "player1");
    expect(result).toEqual({ ok: true, mill: true });
    expect(game.turnState).toBe("remove");
    // Turn does NOT switch when mill is formed
    expect(game.turn).toBe("player1");
  });

  it("transitions to move phase when all pieces placed", () => {
    const game = startedGame();

    // Simulate 8 pieces already placed by each player
    const p1Positions = [0, 2, 5, 8, 12, 14, 20, 23];
    const p2Positions = [3, 6, 9, 11, 15, 18, 21, 17];

    for (const pos of p1Positions) game.board[pos] = "player1";
    for (const pos of p2Positions) game.board[pos] = "player2";

    game.player1.piecesToPlace = 1;
    game.player1.piecesOnBoard = 8;
    game.player2.piecesToPlace = 1;
    game.player2!.piecesOnBoard = 8;

    // Player 1 places last piece (no mill formed on position 10)
    game.turn = "player1";
    placePiece(game, 10, "player1");

    // Player 2 places last piece (no mill on position 13)
    placePiece(game, 13, "player2");

    expect(game.phase).toBe("move");
    expect(game.turnState).toBe("move");
    expect(game.player1.piecesToPlace).toBe(0);
    expect(game.player2!.piecesToPlace).toBe(0);
  });

  it("does not transition to move phase if a mill is formed on last placement", () => {
    const game = startedGame();

    // Set up: both players have 1 piece left to place
    // Player 2 has pieces at 6 and 11, will form mill [6, 11, 15]
    const p1Positions = [0, 1, 3, 5, 8, 9, 14, 23];
    const p2Positions = [4, 6, 10, 11, 12, 13, 17, 18];
    for (const pos of p1Positions) game.board[pos] = "player1";
    for (const pos of p2Positions) game.board[pos] = "player2";

    game.player1.piecesToPlace = 1;
    game.player1.piecesOnBoard = 8;
    game.player2!.piecesToPlace = 1;
    game.player2!.piecesOnBoard = 8;

    // Player 1 places on position 20 (no mill)
    game.turn = "player1";
    placePiece(game, 20, "player1");

    // Player 2 places on 15, forming mill [6, 11, 15]
    const result = placePiece(game, 15, "player2");
    expect(result).toEqual({ ok: true, mill: true });
    expect(game.turnState).toBe("remove");
    // Phase stays as 'place' — mill must be resolved first (Story 05)
    expect(game.turn).toBe("player2");
  });
});
