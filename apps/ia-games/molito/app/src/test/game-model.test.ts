import { describe, it, expect, beforeEach } from "vitest";
import {
  createGame,
  getGameByCode,
  getGameById,
  joinGame,
  clearStore,
} from "../lib/game";

describe("Game model", () => {
  beforeEach(() => {
    clearStore();
  });

  describe("createGame", () => {
    it("returns a game with status waiting", () => {
      const game = createGame();
      expect(game.status).toBe("waiting");
    });

    it("creates an empty board with 24 nulls", () => {
      const game = createGame();
      expect(game.board).toHaveLength(24);
      expect(game.board.every((cell) => cell === null)).toBe(true);
    });

    it("assigns player1 with 9 piecesToPlace and 0 piecesOnBoard", () => {
      const game = createGame();
      expect(game.player1.piecesToPlace).toBe(9);
      expect(game.player1.piecesOnBoard).toBe(0);
    });

    it("has no player2 initially", () => {
      const game = createGame();
      expect(game.player2).toBeNull();
    });

    it("generates a 4-character code", () => {
      const game = createGame();
      expect(game.code).toHaveLength(4);
      expect(game.code).toMatch(/^[A-Z0-9]+$/);
    });

    it("generates unique codes across 100 games", () => {
      const codes = new Set<string>();
      for (let i = 0; i < 100; i++) {
        const game = createGame();
        codes.add(game.code);
      }
      expect(codes.size).toBe(100);
    });
  });

  describe("getGameByCode", () => {
    it("returns the correct game", () => {
      const game = createGame();
      const found = getGameByCode(game.code);
      expect(found).not.toBeNull();
      expect(found!.id).toBe(game.id);
    });

    it("returns null for non-existent code", () => {
      expect(getGameByCode("ZZZZ")).toBeNull();
    });
  });

  describe("getGameById", () => {
    it("returns the correct game", () => {
      const game = createGame();
      const found = getGameById(game.id);
      expect(found).not.toBeNull();
      expect(found!.code).toBe(game.code);
    });

    it("returns null for non-existent id", () => {
      expect(getGameById("nonexistent")).toBeNull();
    });
  });

  describe("joinGame", () => {
    it("assigns player2 and changes status to playing", () => {
      const game = createGame();
      const result = joinGame(game.code);
      expect(result).not.toBeNull();
      expect(result!.game.status).toBe("playing");
      expect(result!.game.player2).not.toBeNull();
      expect(result!.playerId).toBe(result!.game.player2!.id);
    });

    it("returns null for non-existent code", () => {
      expect(joinGame("ZZZZ")).toBeNull();
    });

    it("returns null if game is already playing", () => {
      const game = createGame();
      joinGame(game.code);
      expect(joinGame(game.code)).toBeNull();
    });

    it("only one join succeeds when called multiple times", () => {
      const game = createGame();
      const results = [
        joinGame(game.code),
        joinGame(game.code),
        joinGame(game.code),
      ];
      const successes = results.filter((r) => r !== null);
      expect(successes).toHaveLength(1);
    });
  });
});
