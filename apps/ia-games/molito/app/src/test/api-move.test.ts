// @vitest-environment node
import { describe, it, expect, beforeEach } from "vitest";
import { POST as moveAPI } from "../pages/api/games/[code]/move";
import { clearStore, createGame, joinGame, getGameByCode } from "../lib/game";

function moveCtx(code: string, body: object) {
  return {
    params: { code },
    request: new Request("http://localhost/api/games/" + code + "/move", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }),
  } as any;
}

function setupMoveState() {
  const game = createGame();
  const join = joinGame(game.code)!;
  game.phase = "move";
  game.turnState = "move";
  game.player1.piecesToPlace = 0;
  game.player1.piecesOnBoard = 3;
  game.player2!.piecesToPlace = 0;
  game.player2!.piecesOnBoard = 3;
  game.board[0] = "player1";
  game.board[3] = "player1";
  game.board[7] = "player1";
  game.board[9] = "player2";
  game.board[11] = "player2";
  game.board[16] = "player2";
  game.turn = "player1";
  return { code: game.code, player1Id: game.player1.id, player2Id: join.playerId };
}

describe("POST /api/games/{code}/move", () => {
  beforeEach(() => clearStore());

  it("moves a piece and returns 200", async () => {
    const { code, player1Id } = setupMoveState();
    // Move player1 from 0 to 1 (adjacent, empty)
    const res = await moveAPI(moveCtx(code, { from: 0, to: 1, playerId: player1Id }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.board[0]).toBeNull();
    expect(data.board[1]).toBe("player1");
    expect(data.turn).toBe("player2");
    expect(data.mill).toBe(false);
  });

  it("returns 400 for non-adjacent move", async () => {
    const { code, player1Id } = setupMoveState();
    const res = await moveAPI(moveCtx(code, { from: 0, to: 2, playerId: player1Id }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("adyacentes");
  });

  it("returns 409 when not in move phase", async () => {
    const game = createGame();
    joinGame(game.code);
    // Phase is "place" by default
    const res = await moveAPI(moveCtx(game.code, { from: 0, to: 1, playerId: game.player1.id }));
    expect(res.status).toBe(409);
  });

  it("returns 404 for non-existent game", async () => {
    const res = await moveAPI(moveCtx("ZZZZ", { from: 0, to: 1, playerId: "x" }));
    expect(res.status).toBe(404);
  });
});
