import { useEffect, useRef, useState } from "react"

export const FetchComponent = () => {
  // ここでuseEffectを使ってstar数を取得してみましょう!
  const repoData = useFetch("facebook/react", () => fetchGithubAPI("facebook/react"))

  return (
    <div>
      <p>ここにReactのGitHubレポジトリに付いたスターの数を表示してみよう</p>
      {
        repoData.status === "loading"
          ? <p>ロード中...</p>
          : <p>{repoData.value.stargazers_count} stars</p>
      }
    </div>
  )
}

type GithubAPIResponse = {
  id: string
  full_name: string
  stargazers_count: number
}

/**
 * 簡易的なGithubAPIクライアント
 */
const fetchGithubAPI = async (name: string) => {
  const result = await fetch("https://api.github.com/repos/" + name)
  return result.json() as Promise<GithubAPIResponse>
}

type Loadable<T> = {
  status: "loading"
} | {
  status: "completed"
  value: T
}

/**
 * 非同期なデータを取得するhooks
 */
function useFetch<T>(key: string, fetcher: () => Promise<T>): Loadable<T> {
  const cache = useRef<string | undefined>()
  const [data, setData] = useState<Loadable<T>>({ status: "loading" })

  useEffect(() => {
    let unmounted = false

    // useEffectの返り値がPromiseにならないように内部にasync関数を作成
    const doFetch = async () => {
      const result = await fetcher()
      // コンポーネントがマウントされている場合のみ、stateを更新する
      // (古いコンポーネントのstateを操作しないように)
      if (!unmounted) {
        setData({
          status: 'completed',
          value: result
        })
      }
    }

    if (cache.current === key) {
      // すでにデータは取得済み
    } else {
      // 違うkeyのため再度データ取得を行う
      cache.current = key
      doFetch()
    }

    return () => {
      // アンマウントされたことを通知
      unmounted = true
    }
  }, [key, fetcher])

  return data
}
