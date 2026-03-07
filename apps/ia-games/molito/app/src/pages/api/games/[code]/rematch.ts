import type { APIRoute } from "astro";
import { getGameByCode, createRematchGame } from "../../../../lib/game";
import type { PlayerKey } from "../../../../lib/game";
import { notify } from "../../../../lib/game-events";

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

  if (game.status !== "finished") {
    return json({ error: "La partida no ha terminado" }, 409);
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

  // Already has a rematch game
  if (game.rematchGameCode) {
    return json({ rematchCode: game.rematchGameCode, waiting: false }, 200);
  }

  game.rematchRequested[playerKey] = true;

  // Check if both players requested rematch
  if (game.rematchRequested.player1 && game.rematchRequested.player2) {
    const rematchGame = createRematchGame(game);
    game.rematchGameCode = rematchGame.code;
    notify(code);
    return json({ rematchCode: rematchGame.code, waiting: false }, 200);
  }

  // Only one player requested — notify the other
  notify(code);
  return json({ waiting: true }, 200);
};
