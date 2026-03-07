// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from "vitest";
import { subscribe, notify } from "../lib/game-events";
import { createGame, joinGame, clearStore } from "../lib/game";

describe("game-events", () => {
  beforeEach(() => clearStore());

  it("subscriber receives notification on notify", () => {
    const game = createGame();
    joinGame(game.code);
    const callback = vi.fn();

    subscribe(game.code, callback);
    notify(game.code);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(game);
  });

  it("unsubscribe stops receiving notifications", () => {
    const game = createGame();
    joinGame(game.code);
    const callback = vi.fn();

    const unsub = subscribe(game.code, callback);
    unsub();
    notify(game.code);

    expect(callback).not.toHaveBeenCalled();
  });

  it("multiple subscribers all receive notification", () => {
    const game = createGame();
    joinGame(game.code);
    const cb1 = vi.fn();
    const cb2 = vi.fn();

    subscribe(game.code, cb1);
    subscribe(game.code, cb2);
    notify(game.code);

    expect(cb1).toHaveBeenCalledTimes(1);
    expect(cb2).toHaveBeenCalledTimes(1);
  });

  it("notify without subscribers does not throw", () => {
    expect(() => notify("NONEXISTENT")).not.toThrow();
  });

  it("notify for non-existent game does not call subscribers", () => {
    const callback = vi.fn();
    subscribe("GHOST", callback);
    notify("GHOST"); // Game doesn't exist in store
    expect(callback).not.toHaveBeenCalled();
  });
});
