import type { APIRoute } from "astro";
import { getGameByCode, joinGame } from "../../../../lib/game";

const json = (body: object, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ params }) => {
  const code = params.code!;
  const game = getGameByCode(code);

  if (!game) {
    return json({ error: "Codigo no encontrado" }, 404);
  }

  if (game.status === "finished") {
    return json({ error: "Esta partida ya ha terminado" }, 410);
  }

  if (game.status === "playing") {
    return json({ error: "Partida llena" }, 409);
  }

  const result = joinGame(code);
  if (!result) {
    return json({ error: "Error al unirse" }, 500);
  }

  return json(
    {
      id: result.game.id,
      code: result.game.code,
      playerId: result.playerId,
      status: result.game.status,
    },
    200,
  );
};
