import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ params }) => {
  const { code } = params;

  // Stub: simulate different responses based on code for testing
  if (code === "FULL") {
    return new Response(JSON.stringify({ error: "Partida llena" }), {
      status: 409,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (code === "DONE") {
    return new Response(
      JSON.stringify({ error: "Esta partida ya ha terminado" }),
      {
        status: 410,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  if (code === "XXXX") {
    return new Response(JSON.stringify({ error: "Codigo no encontrado" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Default: successful join
  const playerId = crypto.randomUUID();
  return new Response(
    JSON.stringify({
      id: crypto.randomUUID(),
      code,
      playerId,
      status: "playing",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
};
