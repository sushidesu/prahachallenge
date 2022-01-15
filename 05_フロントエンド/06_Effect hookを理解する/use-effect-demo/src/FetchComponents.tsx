import { useEffect, useState } from "react"

export const FetchComponent = () => {
  // ここでuseEffectを使ってstar数を取得してみましょう!
  const repoData = useFetch(() => fetchGithubAPI("facebook/react"))

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
function useFetch<T>(fetcher: () => Promise<T>): Loadable<T> {
  const [data, setData] = useState<Loadable<T>>({ status: "loading" })

  useEffect(() => {
    let unmounted = false

    const doFetch = async () => {
      const result = await fetcher()
      if (!unmounted) {
        setData({
          status: 'completed',
          value: result
        })
      }
    }
    doFetch()

    return () => {
      unmounted = true
    }
  }, [])

  return data
}
