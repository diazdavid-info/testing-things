import { describe, it, expect, beforeEach } from "vitest";
import { POST as createGameAPI } from "../pages/api/games/index";
import { POST as joinGameAPI } from "../pages/api/games/[code]/join";
import { GET as statusAPI } from "../pages/api/games/[code]/status";
import { clearStore, getGameByCode } from "../lib/game";

function ctx(params: Record<string, string> = {}) {
  return { params } as any;
}

describe("POST /api/games (real)", () => {
  beforeEach(() => clearStore());

  it("creates a game in the store", async () => {
    const res = await createGameAPI(ctx());
    expect(res.status).toBe(200);
    const data = await res.json();

    const game = getGameByCode(data.code);
    expect(game).not.toBeNull();
    expect(game!.status).toBe("waiting");
  });

  it("returns id, code and playerId", async () => {
    const res = await createGameAPI(ctx());
    const data = await res.json();

    expect(typeof data.id).toBe("string");
    expect(typeof data.code).toBe("string");
    expect(typeof data.playerId).toBe("string");
    expect(data.code).toHaveLength(4);
  });
});

describe("POST /api/games/{code}/join (real)", () => {
  beforeEach(() => clearStore());

  it("returns 200 and joins on valid waiting game", async () => {
    const createRes = await createGameAPI(ctx());
    const { code } = await createRes.json();

    const joinRes = await joinGameAPI(ctx({ code }));
    expect(joinRes.status).toBe(200);

    const data = await joinRes.json();
    expect(data.status).toBe("playing");
    expect(typeof data.playerId).toBe("string");
  });

  it("returns 404 for non-existent code", async () => {
    const res = await joinGameAPI(ctx({ code: "ZZZZ" }));
    expect(res.status).toBe(404);
  });

  it("returns 409 for already full game", async () => {
    const createRes = await createGameAPI(ctx());
    const { code } = await createRes.json();

    await joinGameAPI(ctx({ code }));
    const res = await joinGameAPI(ctx({ code }));
    expect(res.status).toBe(409);
  });
});

describe("GET /api/games/{code}/status", () => {
  beforeEach(() => clearStore());

  it("returns waiting status for new game", async () => {
    const createRes = await createGameAPI(ctx());
    const { code } = await createRes.json();

    const res = await statusAPI(ctx({ code }));
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.status).toBe("waiting");
    expect(data.playerCount).toBe(1);
  });

  it("returns playing status after join", async () => {
    const createRes = await createGameAPI(ctx());
    const { code } = await createRes.json();

    await joinGameAPI(ctx({ code }));

    const res = await statusAPI(ctx({ code }));
    const data = await res.json();
    expect(data.status).toBe("playing");
    expect(data.playerCount).toBe(2);
  });

  it("returns 404 for non-existent code", async () => {
    const res = await statusAPI(ctx({ code: "ZZZZ" }));
    expect(res.status).toBe(404);
  });
});
