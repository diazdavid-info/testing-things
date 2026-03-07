import type { APIRoute } from "astro";
import { getGameByCode } from "../../../../lib/game";
import { placePiece } from "../../../../lib/game-actions";

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

  let body: { position?: number; playerId?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Body invalido" }, 400);
  }

  const { position, playerId } = body;

  if (position === undefined || !playerId) {
    return json({ error: "Faltan parametros: position y playerId" }, 400);
  }

  // Determine which player is making the move
  let playerKey: "player1" | "player2" | null = null;
  if (game.player1.id === playerId) playerKey = "player1";
  else if (game.player2?.id === playerId) playerKey = "player2";

  if (!playerKey) {
    return json({ error: "No eres jugador de esta partida" }, 403);
  }

  const result = placePiece(game, position, playerKey);

  if (!result.ok) {
    return json({ error: result.error }, 400);
  }

  return json(
    {
      board: game.board,
      turn: game.turn,
      phase: game.phase,
      turnState: game.turnState,
      player1: { piecesToPlace: game.player1.piecesToPlace, piecesOnBoard: game.player1.piecesOnBoard },
      player2: game.player2
        ? { piecesToPlace: game.player2.piecesToPlace, piecesOnBoard: game.player2.piecesOnBoard }
        : null,
      mill: result.mill,
    },
    200,
  );
};
