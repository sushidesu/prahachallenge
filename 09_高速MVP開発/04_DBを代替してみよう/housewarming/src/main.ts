import { createServer } from "./server"
import { createAirtableClient } from "./airtableClient"
import { createCacheManager } from "./cacheManager"
import { createCacheFetcher } from "./fetchWithCache"
import { parserS } from "./parser"

const main = () => {
  const cacheManager = createCacheManager({
    pathToKeyFile: "./.cache/keys.json",
    cacheDir: "./.cache",
  })
  const fetchWithCache = createCacheFetcher(cacheManager)
  const airtableClient = createAirtableClient()

  const server = createServer({
    fetchWithCache,
    parser: parserS,
    airtableClient,
  })

  server.listen({ port: 8888 }, (err, address) => {
    if (err) throw err
    console.log(`server is now listening on ${address}`)
  })
}

main()
