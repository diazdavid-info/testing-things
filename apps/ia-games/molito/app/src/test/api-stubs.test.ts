import { describe, it, expect } from "vitest";
import { POST as createGame } from "../pages/api/games/index";
import { POST as joinGame } from "../pages/api/games/[code]/join";

function createMockContext(params: Record<string, string> = {}) {
  return {
    params,
    request: new Request("http://localhost"),
    redirect: () => new Response(),
    url: new URL("http://localhost"),
    site: new URL("http://localhost"),
    generator: "test",
    props: {},
    slots: {} as any,
    cookies: {} as any,
    locals: {},
    preferredLocale: undefined,
    preferredLocaleList: undefined,
    currentLocale: undefined,
    rewrite: () => new Response() as any,
    originPathname: "/",
    isPrerendered: false,
    getActionResult: () => undefined,
    callAction: async () => ({}) as any,
    routePattern: "",
    clientAddress: "",
    ResponseWithEncoding: Response as any,
  } as any;
}

describe("POST /api/games", () => {
  it("returns 200 with id, code and playerId", async () => {
    const res = await createGame(createMockContext());
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("code");
    expect(data).toHaveProperty("playerId");
    expect(typeof data.id).toBe("string");
    expect(typeof data.code).toBe("string");
    expect(typeof data.playerId).toBe("string");
    expect(data.code.length).toBe(4);
  });
});

describe("POST /api/games/{code}/join", () => {
  it("returns 200 on valid code", async () => {
    const res = await joinGame(createMockContext({ code: "ABCD" }));
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveProperty("playerId");
    expect(data).toHaveProperty("status", "playing");
  });

  it("returns 409 for code FULL", async () => {
    const res = await joinGame(createMockContext({ code: "FULL" }));
    expect(res.status).toBe(409);
  });

  it("returns 410 for code DONE", async () => {
    const res = await joinGame(createMockContext({ code: "DONE" }));
    expect(res.status).toBe(410);
  });

  it("returns 404 for code XXXX", async () => {
    const res = await joinGame(createMockContext({ code: "XXXX" }));
    expect(res.status).toBe(404);
  });
});
