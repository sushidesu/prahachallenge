import Fastify from "fastify"
import { createAirtableClient } from "./airtableClient"

const server = () => {
  const fastify = Fastify()

  fastify.get("/", (_, reply) => {
    reply.type("application/json").code(200)
    return { hello: "world" }
  })

  fastify.get("/houses", async (_, reply) => {
    reply.type("application/json").code(200)
    const client = createAirtableClient()
    const houses = await client.getAll()
    return {
      houses,
    }
  })

  fastify.listen({ port: 8888 }, (err, address) => {
    if (err) throw err
    console.log(`server is now listening on ${address}`)
  })
}

server()
