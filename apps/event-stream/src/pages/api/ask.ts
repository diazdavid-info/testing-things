import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
  const r = await request.formData()
  console.log(r)

  const stream = new ReadableStream({
    start(controller) {
      let counter = 0
      const maxMessages = 5

      // Enviar un evento inicial
      controller.enqueue(`data: Bienvenido al EventStream\n\n`)

      // Enviar eventos periódicos
      const interval = setInterval(() => {
        controller.enqueue(`data: Mensaje ${++counter} a las ${new Date().toISOString()}\n\n`)
        if (counter >= maxMessages) {
          controller.close()
          clearInterval(interval)
        }
      }, 1000)

      // Detener el stream cuando el cliente cierre la conexión
      // controller.enqueue(`event: close\ndata: bye\n\n`);

      // Limpiar al finalizar
      const cleanup = () => clearInterval(interval)
      controller.close = cleanup
    },
  })

  const response = new Response(stream)
  response.headers.set('Content-Type', 'text/event-stream')
  response.headers.set('Cache-Control', 'no-cache')
  response.headers.set('Connection', 'keep-alive')

  return response
}
