import fs from "fs/promises"
import { existsSync } from "fs"

export type CacheManager = {
  get: (url: string) => Promise<string | undefined>
  set: (url: string, content: string) => Promise<void>
}

const isExists = (path: string) => {
  return existsSync(path)
}

const genId = (): string => Math.random().toString(36).substring(2)

export const createCacheManager = (props: {
  pathToKeyFile: string
  cacheDir: string
}): CacheManager => ({
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
