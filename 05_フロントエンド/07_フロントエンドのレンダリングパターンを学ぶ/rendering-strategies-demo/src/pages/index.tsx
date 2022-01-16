import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Rendering Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <p>hello</p>
      </main>
    </div>
  )
}

export default Home
