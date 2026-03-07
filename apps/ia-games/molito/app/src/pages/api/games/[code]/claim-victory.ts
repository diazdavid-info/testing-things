import type { APIRoute } from "astro";
import { getGameByCode } from "../../../../lib/game";
import type { PlayerKey } from "../../../../lib/game";
import { notify } from "../../../../lib/game-events";

const ABANDON_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

const json = (body: object, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ params, request }) => {
  const code = params.code!;
  const game = getGameByCode(code);

  if (!game) {
    return json({ error: "Partida no encontrada" }, 404);
  }

  if (game.status !== "playing") {
    return json({ error: "La partida no esta en curso" }, 409);
  }

  let body: { playerId?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Body invalido" }, 400);
  }

  const { playerId } = body;
  if (!playerId) {
    return json({ error: "Falta parametro: playerId" }, 400);
  }

  let playerKey: PlayerKey | null = null;
  if (game.player1.id === playerId) playerKey = "player1";
  else if (game.player2?.id === playerId) playerKey = "player2";

  if (!playerKey) {
    return json({ error: "No eres jugador de esta partida" }, 403);
  }

  const rivalKey: PlayerKey = playerKey === "player1" ? "player2" : "player1";
  const rivalLastSeen = game.lastSeen[rivalKey];

  if (rivalLastSeen !== null && Date.now() - rivalLastSeen < ABANDON_TIMEOUT_MS) {
    return json({ error: "Tu rival aun esta conectado" }, 400);
  }

  game.status = "finished";
  game.winner = playerKey;
  game.winReason = "abandon";

  notify(code);

  return json({
    status: game.status,
    winner: game.winner,
    winReason: game.winReason,
  }, 200);
};
