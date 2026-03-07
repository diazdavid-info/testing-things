import type { APIRoute } from "astro";

function generateCode(length = 4): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export const POST: APIRoute = async () => {
  const code = generateCode();
  const id = crypto.randomUUID();
  const playerId = crypto.randomUUID();

  return new Response(JSON.stringify({ id, code, playerId }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
