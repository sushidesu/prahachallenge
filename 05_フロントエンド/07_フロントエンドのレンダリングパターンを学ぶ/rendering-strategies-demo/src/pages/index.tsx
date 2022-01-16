import type { NextPage } from 'next'
import Head from 'next/head'
import { getRepoData } from "../lib/github-api-client"
import { useFetchOnce } from "../lib/useFetchOnce"
import { Summary } from "../components/Summary"

const Home: NextPage = () => {
  const repoData = useFetchOnce(() => getRepoData("facebook/react"))

  return (
    <div>
      <Head>
        <title>Rendering Demo (CSR)</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <p>hello</p>
          {repoData.status === "loading"
            ? <p>loading...</p>
            : <Summary name={repoData.value.full_name} stars={repoData.value.stargazers_count} />
          }
        </div>
      </main>
    </div>
  )
}

export default Home
