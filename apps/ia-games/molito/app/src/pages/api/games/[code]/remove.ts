import type { APIRoute } from "astro";
import { removePiece } from "../../../../lib/game-actions";
import { notify } from "../../../../lib/game-events";
import { json, parseJsonBody, requireGame, requirePlayer, isResponse } from "../../../../lib/api-helpers";

export const POST: APIRoute = async ({ params, request }) => {
  const game = requireGame(params.code!);
  if (isResponse(game)) return game;

  if (game.status !== "playing") {
    return json({ error: "La partida no esta en curso" }, 409);
  }

  if (game.turnState !== "remove") {
    return json({ error: "No estas en estado de eliminacion" }, 409);
  }

  const body = await parseJsonBody<{ position?: number; playerId?: string }>(request);
  if (isResponse(body)) return body;

  const { position, playerId } = body;
  if (position === undefined || !playerId) {
    return json({ error: "Faltan parametros: position y playerId" }, 400);
  }

  const playerKey = requirePlayer(game, playerId);
  if (isResponse(playerKey)) return playerKey;

  const result = removePiece(game, position, playerKey);
  if (!result.ok) {
    return json({ error: result.error }, 400);
  }

  notify(params.code!);

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
    },
    200,
  );
};
