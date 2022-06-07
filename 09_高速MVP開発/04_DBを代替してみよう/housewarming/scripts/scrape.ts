import { createAirtableClient } from "../src/airtableClient"
import { createCacheManager } from "../src/cacheManager"
import { createCacheFetcher } from "../src/fetchWithCache"
import { House } from "../src/house"
import { parserS } from "../src/parser"

export const scrape = async (url: string): Promise<House> => {
  const cacheManager = createCacheManager({
    pathToKeyFile: "./.cache/keys.json",
    cacheDir: "./.cache",
  })
  const fetchWithCache = createCacheFetcher(cacheManager)
  const airtableClient = createAirtableClient()

  const body = await fetchWithCache(url)
  const house = parserS(url, body)
  await airtableClient.insert([house])

  return house
}

const main = async () => {
  const url = process.argv[2]
  if (url === undefined) {
    console.log("url is required")
  } else {
    const result = await scrape(url)
    console.log(result)
  }
}
main()
