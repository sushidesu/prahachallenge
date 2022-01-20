import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"
import { Summary } from "../components/Summary"
import { getRepoData } from "../lib/github-api-client"

type Props = {
  name: string
  stars: number
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const result = await getRepoData("facebook/react")
  return {
    props: {
      name: result.full_name,
      stars: result.stargazers_count
    }
  }
}

const SSRPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { name, stars } = props
  return (
    <div>
      <Head>
        <title>Rendering Demo (SSR)</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <p>SSR</p>
        <Summary name={name} stars={stars} />
    </div>
  )
}

export default SSRPage
