import { useEffect, useRef, useState } from "react"

export const FetchComponent = () => {
  const [name, setName] = useState("facebook/react")

  const setNameToJest = () => {
    setName("facebook/jest")
  }
  const setNameToReact = () => {
    setName("facebook/react")
  }

  // ここでuseEffectを使ってstar数を取得してみましょう!
  // `name` によって取得するデータを変える
  const repoData = useFetch(name, () => fetchGithubAPI(name))

  return (
    <div>
      <p>ここにReactのGitHubレポジトリに付いたスターの数を表示してみよう</p>
      {
        repoData.status === "loading"
          ? <p>ロード中...</p>
          : (
            <div>
              <p>{repoData.value.full_name}</p>
              <p>{repoData.value.stargazers_count} stars</p>
            </div>
          )
      }
      <button onClick={setNameToReact}>factbook/react</button>
      <button onClick={setNameToJest}>factbook/jest</button>
    </div>
  )
}

/* ----------------------------------------- */

type GithubAPIResponse = {
  id: string
  full_name: string
  stargazers_count: number
}

/**
 * 簡易的なGithubAPIクライアント
 * cache無効化したまま無限リクエストを飛ばしてしまい制限がかかってしまったので仮のデータを返す
 */
const fetchGithubAPI = async (name: string): Promise<GithubAPIResponse> => {
  //  const result = await fetch("https://api.github.com/repos/" + name, {
  //    // 検証のためcacheを無効化
  //    cache: "no-store"
  //  })
  //  return result.json() as Promise<GithubAPIResponse>
  if (name === "facebook/react") {
    return lazy({
      id: "react",
      full_name: "facebook/react",
      stargazers_count: 150000
    })
  } else {
    return lazy({
      id: "jest",
      full_name: "facebook/jest",
      stargazers_count: 300
    })
  }
}

function lazy<T>(data: T) {
  return new Promise<T>(resolve => {
    setTimeout(() => {
      resolve(data)
    }, 3000)
  })
}

/* ----------------------------------------- */

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

    if (data.status === "loading") {
      // データの取得とkeyの更新を行う
      cache.current = key
      console.log("fetch")
      doFetch()
    } else if (cache.current !== key) {
      // keyが変わったら再度データ取得させる
      console.log("changed")
      setData({ status: "loading" })
    }

    return () => {
      // アンマウントされたことを通知
      unmounted = true
    }
  }, [data, key, fetcher])

  return data
}
