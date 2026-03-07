import type { Game } from "./game";
import { getGameByCode } from "./game";

type GameStateCallback = (game: Game) => void;

const subscribers = new Map<string, Set<GameStateCallback>>();

export function subscribe(code: string, callback: GameStateCallback): () => void {
  if (!subscribers.has(code)) {
    subscribers.set(code, new Set());
  }
  subscribers.get(code)!.add(callback);

  return () => {
    const subs = subscribers.get(code);
    if (subs) {
      subs.delete(callback);
      if (subs.size === 0) subscribers.delete(code);
    }
  };
}

export function notify(code: string): void {
  const subs = subscribers.get(code);
  if (!subs || subs.size === 0) return;

  const game = getGameByCode(code);
  if (!game) return;

  for (const cb of subs) {
    cb(game);
  }
}
