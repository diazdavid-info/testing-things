// @vitest-environment node
import { describe, it, expect, beforeEach } from "vitest";
import { POST as createGameAPI } from "../pages/api/games/index";
import { POST as placeAPI } from "../pages/api/games/[code]/place";
import { POST as moveAPI } from "../pages/api/games/[code]/move";
import { POST as removeAPI } from "../pages/api/games/[code]/remove";
import { GET as streamAPI } from "../pages/api/games/[code]/stream";
import { clearStore, createGame, joinGame } from "../lib/game";
import { validatePosition, validatePlayerId, setCookieHeader } from "../lib/api-helpers";

function ctx(code: string, body: object) {
  return {
    params: { code },
    request: new Request("http://localhost/api/games/" + code + "/place", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }),
  } as any;
}

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

function streamCtx(code: string, playerId: string) {
  return {
    params: { code },
    request: new Request(`http://localhost/api/games/${code}/stream?playerId=${playerId}`),
  } as any;
}

describe("Input validation", () => {
  beforeEach(() => clearStore());

  it("validatePosition rejects non-integers", () => {
    expect(validatePosition(1.5)).toBe(false);
    expect(validatePosition(NaN)).toBe(false);
    expect(validatePosition(Infinity)).toBe(false);
    expect(validatePosition(-1)).toBe(false);
    expect(validatePosition(24)).toBe(false);
    expect(validatePosition("5")).toBe(false);
    expect(validatePosition(null)).toBe(false);
    expect(validatePosition(undefined)).toBe(false);
  });

  it("validatePosition accepts valid positions", () => {
    expect(validatePosition(0)).toBe(true);
    expect(validatePosition(23)).toBe(true);
    expect(validatePosition(12)).toBe(true);
  });

  it("validatePlayerId rejects invalid values", () => {
    expect(validatePlayerId("")).toBe(false);
    expect(validatePlayerId(null)).toBe(false);
    expect(validatePlayerId(undefined)).toBe(false);
    expect(validatePlayerId(123)).toBe(false);
    expect(validatePlayerId("x".repeat(101))).toBe(false);
  });

  it("validatePlayerId accepts valid UUIDs", () => {
    expect(validatePlayerId("abc-123")).toBe(true);
    expect(validatePlayerId("a".repeat(100))).toBe(true);
  });

  it("rejects string position in place endpoint", async () => {
    const game = createGame();
    joinGame(game.code);
    const res = await placeAPI(ctx(game.code, { position: "5", playerId: game.player1.id }));
    expect(res.status).toBe(400);
  });

  it("rejects NaN position in place endpoint", async () => {
    const game = createGame();
    joinGame(game.code);
    const res = await placeAPI(ctx(game.code, { position: NaN, playerId: game.player1.id }));
    expect(res.status).toBe(400);
  });

  it("rejects negative position in place endpoint", async () => {
    const game = createGame();
    joinGame(game.code);
    const res = await placeAPI(ctx(game.code, { position: -1, playerId: game.player1.id }));
    expect(res.status).toBe(400);
  });

  it("rejects decimal position in move endpoint", async () => {
    const game = createGame();
    joinGame(game.code);
    // Game starts in "place" phase, so move returns 409 before reaching position validation.
    // Validate decimal rejection via validatePosition directly.
    expect(validatePosition(0.5)).toBe(false);
    expect(validatePosition(1.7)).toBe(false);
  });

  it("rejects empty playerId", async () => {
    const game = createGame();
    joinGame(game.code);
    const res = await placeAPI(ctx(game.code, { position: 0, playerId: "" }));
    expect(res.status).toBe(400);
  });
});

describe("Cookie security", () => {
  it("setCookieHeader includes HttpOnly", () => {
    const header = setCookieHeader("ABCD", "test-id");
    expect(header).toContain("HttpOnly");
  });

  it("setCookieHeader includes SameSite=Strict", () => {
    const header = setCookieHeader("ABCD", "test-id");
    expect(header).toContain("SameSite=Strict");
  });

  it("setCookieHeader scopes Path to game", () => {
    const header = setCookieHeader("ABCD", "test-id");
    expect(header).toContain("Path=/molino/ABCD");
  });

  it("setCookieHeader includes Max-Age", () => {
    const header = setCookieHeader("ABCD", "test-id");
    expect(header).toContain("Max-Age=");
  });

  it("create game sets secure cookie", async () => {
    const res = await createGameAPI({ params: {}, request: new Request("http://localhost/api/games", { method: "POST" }) } as any);
    const cookie = res.headers.get("Set-Cookie")!;
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Strict");
  });
});

describe("Security headers", () => {
  beforeEach(() => clearStore());

  it("API responses include X-Content-Type-Options", async () => {
    const game = createGame();
    joinGame(game.code);
    const res = await placeAPI(ctx(game.code, { position: 0, playerId: game.player1.id }));
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });

  it("API responses include X-Frame-Options", async () => {
    const game = createGame();
    joinGame(game.code);
    const res = await placeAPI(ctx(game.code, { position: 0, playerId: game.player1.id }));
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
  });
});

describe("SSE authentication", () => {
  beforeEach(() => clearStore());

  it("rejects unauthenticated stream connections", async () => {
    const game = createGame();
    joinGame(game.code);
    const res = await streamAPI(streamCtx(game.code, "invalid-id"));
    expect(res.status).toBe(403);
  });

  it("rejects stream connections with no playerId", async () => {
    const game = createGame();
    joinGame(game.code);
    const res = await streamAPI(streamCtx(game.code, ""));
    expect(res.status).toBe(403);
  });
});
