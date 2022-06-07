import Fastify from "fastify"
import { AirtableClient, createAirtableClient } from "./airtableClient"
import { FetchWithCache } from "./fetchWithCache"
import { Parser } from "./parser"

export const createServer = (props: {
  fetchWithCache: FetchWithCache
  airtableClient: AirtableClient
  parser: Parser
}) => {
  const fastify = Fastify()

  fastify.get("/", (_, reply) => {
    reply.type("application/json").code(200)
    return { hello: "world" }
  })

  fastify.get("/house", async (_, reply) => {
    reply.type("application/json").code(200)
    const client = createAirtableClient()
    const houses = await client.getAll()
    return {
      houses,
    }
  })

  fastify.post("/house", async (request, reply) => {
    const { fetchWithCache, parser, airtableClient } = props

    // validate request
    const body = request.body as Record<string, unknown>
    const url = body["url"]
    if (typeof url !== "string") {
      reply.code(400).send({ message: "bad request" })
      return
    }
    if (!isValidURL(url)) {
      reply.code(400).send({ message: "invalid url" })
      return
    }

    // fetch url and insert to airtable
    const html = await fetchWithCache(url)
    const house = parser(url, html)
    const result = await airtableClient.insert([house])

    reply.code(200).send({ message: "success", created: result })
  })

  return fastify
}

const isValidURL = (maybeUrl: string): boolean => {
  try {
    new URL(maybeUrl)
    return true
  } catch {
    return false
  }
}
