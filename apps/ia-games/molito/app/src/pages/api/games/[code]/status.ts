import type { APIRoute } from "astro";
import { getGameByCode } from "../../../../lib/game";

const json = (body: object, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const GET: APIRoute = async ({ params }) => {
  const code = params.code!;
  const game = getGameByCode(code);

  if (!game) {
    return json({ error: "Partida no encontrada" }, 404);
  }

  return json(
    {
      status: game.status,
      playerCount: game.player2 ? 2 : 1,
    },
    200,
  );
};
