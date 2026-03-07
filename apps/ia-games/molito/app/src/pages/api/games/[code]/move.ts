import type { APIRoute } from "astro";
import { getGameByCode } from "../../../../lib/game";
import { movePiece } from "../../../../lib/game-actions";
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

  if (game.status !== "playing") {
    return json({ error: "La partida no esta en curso" }, 409);
  }

  if (game.phase !== "move" && game.phase !== "fly") {
    return json({ error: "No estas en fase de movimiento" }, 409);
  }

  let body: { from?: number; to?: number; playerId?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Body invalido" }, 400);
  }

  const { from, to, playerId } = body;

  if (from === undefined || to === undefined || !playerId) {
    return json({ error: "Faltan parametros: from, to y playerId" }, 400);
  }

  let playerKey: "player1" | "player2" | null = null;
  if (game.player1.id === playerId) playerKey = "player1";
  else if (game.player2?.id === playerId) playerKey = "player2";

  if (!playerKey) {
    return json({ error: "No eres jugador de esta partida" }, 403);
  }

  const result = movePiece(game, from, to, playerKey);

  if (!result.ok) {
    return json({ error: result.error }, 400);
  }

  notify(code);

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
      status: game.status,
      winner: game.winner,
      winReason: game.winReason,
      mill: result.mill,
    },
    200,
  );
};
