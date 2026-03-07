import { getGameByCode } from "./game";
import type { Game, PlayerKey } from "./game";

export function json(body: object, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function parseJsonBody<T = Record<string, unknown>>(
  request: Request,
): Promise<T | Response> {
  try {
    return await request.json();
  } catch {
    return json({ error: "Body invalido" }, 400);
  }
}

export function requireGame(code: string): Game | Response {
  const game = getGameByCode(code);
  if (!game) return json({ error: "Partida no encontrada" }, 404);
  return game;
}

export function resolvePlayer(game: Game, playerId: string): PlayerKey | null {
  if (game.player1.id === playerId) return "player1";
  if (game.player2?.id === playerId) return "player2";
  return null;
}

export function requirePlayer(game: Game, playerId: string): PlayerKey | Response {
  const key = resolvePlayer(game, playerId);
  if (!key) return json({ error: "No eres jugador de esta partida" }, 403);
  return key;
}

export function isResponse(value: unknown): value is Response {
  return value instanceof Response;
}
