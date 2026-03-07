import type { APIRoute } from "astro";
import { createRematchGame } from "../../../../lib/game";
import { notify } from "../../../../lib/game-events";
import { json, parseJsonBody, requireGame, requirePlayer, isResponse, validatePlayerId } from "../../../../lib/api-helpers";

export const POST: APIRoute = async ({ params, request }) => {
  const game = requireGame(params.code!);
  if (isResponse(game)) return game;

  if (game.status !== "finished") {
    return json({ error: "La partida no ha terminado" }, 409);
  }

  const body = await parseJsonBody<{ playerId?: string }>(request);
  if (isResponse(body)) return body;

  const { playerId } = body;
  if (!validatePlayerId(playerId)) {
    return json({ error: "Parametros invalidos" }, 400);
  }

  const playerKey = requirePlayer(game, playerId);
  if (isResponse(playerKey)) return playerKey;

  // Already has a rematch game
  if (game.rematchGameCode) {
    return json({ rematchCode: game.rematchGameCode, waiting: false }, 200);
  }

  game.rematchRequested[playerKey] = true;

  // Check if both players requested rematch
  if (game.rematchRequested.player1 && game.rematchRequested.player2) {
    const rematchGame = createRematchGame(game);
    game.rematchGameCode = rematchGame.code;
    notify(params.code!);
    return json({ rematchCode: rematchGame.code, waiting: false }, 200);
  }

  // Only one player requested — notify the other
  notify(params.code!);
  return json({ waiting: true }, 200);
};
