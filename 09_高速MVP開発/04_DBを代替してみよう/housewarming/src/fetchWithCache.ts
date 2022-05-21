import got from "got"
import { CacheManager } from "./cacheManager"

export type FetchWithCache = (url: string) => Promise<string>

export const createCacheFetcher =
  (cacheManager: CacheManager): FetchWithCache =>
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
