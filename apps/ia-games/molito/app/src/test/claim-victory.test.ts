// @vitest-environment node
import { describe, it, expect, beforeEach } from "vitest";
import { POST as claimAPI } from "../pages/api/games/[code]/claim-victory";
import { clearStore, createGame, joinGame, getGameByCode } from "../lib/game";

function claimCtx(code: string, body: object) {
  return {
    params: { code },
    request: new Request("http://localhost/api/games/" + code + "/claim-victory", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }),
  } as any;
}

describe("POST /api/games/{code}/claim-victory", () => {
  beforeEach(() => clearStore());

  it("grants victory when rival has been disconnected for 5+ minutes", async () => {
    const game = createGame();
    const join = joinGame(game.code)!;
    // Simulate player2 disconnected 6 minutes ago
    game.lastSeen.player2 = Date.now() - 6 * 60 * 1000;
    game.lastSeen.player1 = Date.now();

    const res = await claimAPI(claimCtx(game.code, { playerId: game.player1.id }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.winner).toBe("player1");
    expect(data.winReason).toBe("abandon");
    expect(game.status).toBe("finished");
  });

  it("rejects claim when rival is still connected", async () => {
    const game = createGame();
    const join = joinGame(game.code)!;
    game.lastSeen.player2 = Date.now(); // Just connected
    game.lastSeen.player1 = Date.now();

    const res = await claimAPI(claimCtx(game.code, { playerId: game.player1.id }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("conectado");
  });

  it("rejects claim when rival disconnected less than 5 minutes ago", async () => {
    const game = createGame();
    joinGame(game.code);
    game.lastSeen.player2 = Date.now() - 3 * 60 * 1000; // 3 minutes ago
    game.lastSeen.player1 = Date.now();

    const res = await claimAPI(claimCtx(game.code, { playerId: game.player1.id }));
    expect(res.status).toBe(400);
  });

  it("returns 404 for non-existent game", async () => {
    const res = await claimAPI(claimCtx("ZZZZ", { playerId: "x" }));
    expect(res.status).toBe(404);
  });

  it("returns 409 when game is not playing", async () => {
    const game = createGame();
    // Game is in "waiting" status
    const res = await claimAPI(claimCtx(game.code, { playerId: game.player1.id }));
    expect(res.status).toBe(409);
  });

  it("grants victory when rival lastSeen is null (never connected)", async () => {
    const game = createGame();
    joinGame(game.code);
    game.lastSeen.player1 = Date.now();
    // player2 lastSeen is null by default

    const res = await claimAPI(claimCtx(game.code, { playerId: game.player1.id }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.winReason).toBe("abandon");
  });
});
