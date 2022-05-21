import { load } from "cheerio"
import got from "got"
import fs from "fs/promises"
import { existsSync } from "fs"
import { parse } from "date-fns"
import { House } from "../src/house"

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

export const scrape = async (url: string): Promise<House> => {
  const cacheManager = createCacheManager({
    pathToKeyFile: "./.cache/keys.json",
    cacheDir: "./.cache",
  })
  const fetchWithCache = createFetcher(cacheManager)

  const body = await fetchWithCache(url)
  const $ = load(body)

  const title = $("h1.section_h1-header-title").text()
  const type = $(`th:contains("建物種別")`).next().text()
  const floors = $(`th:contains("階建")`).next().text()
  const size = $(`th:contains("専有面積")`).next().text()
  const address = $(`th:contains("所在地")`).next().text()
  const direction = $(`th:contains("向き")`).next().text()
  const age = $(`th:contains("築年数")`).next().text()
  const structure = $(`th:contains("構造")`).next().text().replace(/\s/g, "")

  const publishedAt = $(`th:contains("情報更新日")`).next().text()
  const layout = $(`th:contains("間取り")`)
    .filter(function () {
      return $(this).text() === "間取り"
    })
    .next()
    .text()

  const rent = $(`span.property_view_note-emphasis`).text()
  const managementFee = $(`span:contains("管理費")`).text()
  const securityDeposit = $(`span:contains("敷金")`).text()
  const keyMoney = $(`span:contains("礼金")`).text()
  const brokeRageFee = $(`th:contains("仲介手数料")`)
    .next()
    .text()
    .replace(/\s/g, "")

  const [floor, maxFloor] = floors.split("/")

  const house: House = {
    name: title,
    type,
    structure,
    layout,
    floor: Number(floor?.slice(0, -1)),
    maxFloor: Number(maxFloor?.slice(0, -2)),
    address,
    age: Number(age.slice(1, -1)),
    direction,
    publishedAt: parse(publishedAt, "yyyy/MM/dd", new Date()),
    rent: Number(rent.slice(0, -2)) * 10000,
    managementFee: Number(managementFee.slice(8, -1)),
    securityDeposit: Number(securityDeposit.slice(4, -2)) * 10000,
    keyMoney: Number(keyMoney.slice(3, -2)) * 10000,
    brokeRageFee,

    size: Number(size.slice(0, -2)),
    url,
  }

  return house
}
