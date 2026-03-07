import type { APIRoute } from "astro";
import { createGame } from "../../../lib/game";

export const POST: APIRoute = async () => {
  const game = createGame();

  return new Response(
    JSON.stringify({
      id: game.id,
      code: game.code,
      playerId: game.player1.id,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
};
