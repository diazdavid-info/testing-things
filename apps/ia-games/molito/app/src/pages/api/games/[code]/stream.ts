import type { APIRoute } from "astro";
import { getGameByCode } from "../../../../lib/game";
import { subscribe } from "../../../../lib/game-events";
import type { Game } from "../../../../lib/game";

function gameToState(game: Game) {
  return {
    board: game.board,
    turn: game.turn,
    phase: game.phase,
    turnState: game.turnState,
    status: game.status,
    winner: game.winner,
    winReason: game.winReason,
    player1: { piecesToPlace: game.player1.piecesToPlace, piecesOnBoard: game.player1.piecesOnBoard },
    player2: game.player2
      ? { piecesToPlace: game.player2.piecesToPlace, piecesOnBoard: game.player2.piecesOnBoard }
      : null,
  };
}

export const GET: APIRoute = async ({ params }) => {
  const code = params.code!;
  const game = getGameByCode(code);

  if (!game) {
    return new Response("Game not found", { status: 404 });
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      function send(data: string) {
        try {
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        } catch {
          // Stream closed
        }
      }

      // Send initial state
      send(JSON.stringify(gameToState(game)));

      // Subscribe to updates
      const unsubscribe = subscribe(code, (updatedGame) => {
        send(JSON.stringify(gameToState(updatedGame)));
      });

      // Heartbeat every 30s
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": heartbeat\n\n"));
        } catch {
          clearInterval(heartbeat);
        }
      }, 30_000);

      // Cleanup when client disconnects
      const checkClosed = setInterval(() => {
        try {
          controller.enqueue(new Uint8Array(0));
        } catch {
          clearInterval(checkClosed);
          clearInterval(heartbeat);
          unsubscribe();
        }
      }, 5_000);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
};
