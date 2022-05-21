import { load } from "cheerio"
import got from "got"
import fs from "fs/promises"
import { existsSync } from "fs"

const isExists = (path: string) => {
  return existsSync(path)
}

const genId = (): string => Math.random().toString(36).substring(2)

const createCacheManager = (props: {
  pathToKeyFile: string
  cacheDir: string
}) => ({
  get: async (url: string): Promise<string | undefined> => {
    // keyファイルがあるか
    if (await !isExists(props.pathToKeyFile)) {
      return undefined
    }

    // keyの読み込み
    const keyFile = await fs.readFile(props.pathToKeyFile, {
      encoding: "utf-8",
    })
    const key = JSON.parse(keyFile) as Record<string, string>

    // キャッシュファイルがあるか確認
    const cacheFileName = key[url]
    if (cacheFileName) {
      const cache = await fs.readFile(`${props.cacheDir}/${cacheFileName}`, {
        encoding: "utf-8",
      })
      return cache
    } else {
      return undefined
    }
  },
  set: async (url: string, content: string) => {
    const id = genId()
    const cacheFileName = `${id}.txt`
    const pathToCacheFile = `${props.cacheDir}/${cacheFileName}`

    // キャッシュファイルを作成
    await fs.writeFile(pathToCacheFile, content, {
      encoding: "utf-8",
    })

    // keyファイルがあるか
    if (await !isExists(props.pathToKeyFile)) {
      // なければ作る
      await fs.writeFile(props.pathToKeyFile, `{"hello":"world"}`, {
        encoding: "utf-8",
      })
    }

    // keyの読み込み
    const keyFile = await fs.readFile(props.pathToKeyFile, {
      encoding: "utf-8",
    })
    const key = JSON.parse(keyFile) as Record<string, string>

    // keyにurlとキャッシュファイル名の対応を記録
    const newKey = { ...key, [url]: cacheFileName }
    await fs.writeFile(props.pathToKeyFile, JSON.stringify(newKey), {
      encoding: "utf-8",
    })
  },
})

const createFetcher =
  (cacheManager: ReturnType<typeof createCacheManager>) =>
  async (url: string): Promise<string> => {
    const cache = await cacheManager.get(url)
    if (cache === undefined) {
      console.debug("cache not found")
      const result = await got.get(url)
      cacheManager.set(url, result.body)
      return result.body
    } else {
      console.debug("cache hit!!!")
      return cache
    }
  }

export const scrape = async (url: string) => {
  const cacheManager = createCacheManager({
    pathToKeyFile: "./.cache/keys.json",
    cacheDir: "./.cache",
  })
  const fetchWithCache = createFetcher(cacheManager)

  const body = await fetchWithCache(url)
  const $ = load(body)

  const title = $("h1.section_h1-header-title").text()
  const type = $()

  console.log(body)
}

const ex = "https://example.com"
scrape(ex)
