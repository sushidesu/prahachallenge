import { useState, useEffect } from "react"

type Loadable<T> = {
  status: "loading"
} | {
  status: "completed"
  value: T
}

export const useFetchOnce = <T>(fetcher: () => Promise<T>): Loadable<T> => {
  const [data, setData] = useState<Loadable<T>>({ status: "loading" })

  useEffect(() => {
    let unmounted = false

    const doFetch = async () => {
      const result = await fetcher()
      if (!unmounted) {
        setData({
          status: "completed",
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
