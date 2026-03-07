// @vitest-environment node
import { describe, it, expect, beforeEach } from "vitest";
import { POST as rematchAPI } from "../pages/api/games/[code]/rematch";
import { clearStore, createGame, joinGame, getGameByCode, createRematchGame } from "../lib/game";

function rematchCtx(code: string, body: object) {
  return {
    params: { code },
    request: new Request("http://localhost/api/games/" + code + "/rematch", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }),
  } as any;
}

function finishedGame() {
  const game = createGame();
  const join = joinGame(game.code)!;
  game.status = "finished";
  game.winner = "player1";
  game.winReason = "elimination";
  return { game, player1Id: game.player1.id, player2Id: join.playerId };
}

describe("POST /api/games/{code}/rematch", () => {
  beforeEach(() => clearStore());

  it("first player requesting returns waiting: true", async () => {
    const { game, player1Id } = finishedGame();
    const res = await rematchAPI(rematchCtx(game.code, { playerId: player1Id }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.waiting).toBe(true);
    expect(game.rematchRequested.player1).toBe(true);
    expect(game.rematchRequested.player2).toBe(false);
  });

  it("both players requesting creates rematch game", async () => {
    const { game, player1Id, player2Id } = finishedGame();
    await rematchAPI(rematchCtx(game.code, { playerId: player1Id }));
    const res = await rematchAPI(rematchCtx(game.code, { playerId: player2Id }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.waiting).toBe(false);
    expect(data.rematchCode).toBeTruthy();

    // Verify rematch game
    const rematchGame = getGameByCode(data.rematchCode);
    expect(rematchGame).not.toBeNull();
    expect(rematchGame!.status).toBe("playing");
    expect(rematchGame!.board.every((c: any) => c === null)).toBe(true);
    expect(rematchGame!.player1.piecesToPlace).toBe(9);
    expect(rematchGame!.player2!.piecesToPlace).toBe(9);
    // Loser (player2) starts
    expect(rematchGame!.turn).toBe("player2");
  });

  it("rematch game reuses player IDs", async () => {
    const { game, player1Id, player2Id } = finishedGame();
    await rematchAPI(rematchCtx(game.code, { playerId: player1Id }));
    const res = await rematchAPI(rematchCtx(game.code, { playerId: player2Id }));
    const data = await res.json();
    const rematchGame = getGameByCode(data.rematchCode)!;
    expect(rematchGame.player1.id).toBe(player1Id);
    expect(rematchGame.player2!.id).toBe(player2Id);
  });

  it("returns 409 when game is not finished", async () => {
    const game = createGame();
    joinGame(game.code);
    const res = await rematchAPI(rematchCtx(game.code, { playerId: game.player1.id }));
    expect(res.status).toBe(409);
  });

  it("returns 403 for unknown player", async () => {
    const { game } = finishedGame();
    const res = await rematchAPI(rematchCtx(game.code, { playerId: "unknown" }));
    expect(res.status).toBe(403);
  });

  it("returns rematchCode if already created", async () => {
    const { game, player1Id, player2Id } = finishedGame();
    await rematchAPI(rematchCtx(game.code, { playerId: player1Id }));
    await rematchAPI(rematchCtx(game.code, { playerId: player2Id }));
    // Third request should return existing rematchCode
    const res = await rematchAPI(rematchCtx(game.code, { playerId: player1Id }));
    const data = await res.json();
    expect(data.rematchCode).toBe(game.rematchGameCode);
    expect(data.waiting).toBe(false);
  });
});

describe("createRematchGame", () => {
  beforeEach(() => clearStore());

  it("creates game with loser starting", () => {
    const game = createGame();
    joinGame(game.code);
    game.status = "finished";
    game.winner = "player1";

    const rematch = createRematchGame(game);
    expect(rematch.turn).toBe("player2"); // loser starts
    expect(rematch.status).toBe("playing");
    expect(rematch.phase).toBe("place");
    expect(rematch.player1.piecesToPlace).toBe(9);
    expect(rematch.player2!.piecesToPlace).toBe(9);
  });
});
