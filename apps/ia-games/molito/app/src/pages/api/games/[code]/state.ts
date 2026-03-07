import type { APIRoute } from "astro";
import { json, requireGame, isResponse } from "../../../../lib/api-helpers";

export const GET: APIRoute = async ({ params, cookies }) => {
  const code = params.code!;
  const game = requireGame(code);
  if (isResponse(game)) return game;

  const playerId = cookies.get(`playerId_${code}`)?.value;
  const isPlayer1 = playerId === game.player1.id;
  const isPlayer2 = playerId === game.player2?.id;

  if (!isPlayer1 && !isPlayer2) {
    return json({ error: "No eres jugador de esta partida" }, 403);
  }

  return json(
    {
      board: game.board,
      turn: game.turn,
      phase: game.phase,
      turnState: game.turnState,
      status: game.status,
      player1: {
        piecesToPlace: game.player1.piecesToPlace,
        piecesOnBoard: game.player1.piecesOnBoard,
      },
      player2: game.player2
        ? {
            piecesToPlace: game.player2.piecesToPlace,
            piecesOnBoard: game.player2.piecesOnBoard,
          }
        : null,
    },
    200,
  );
};
