import { GetStaticProps, InferGetStaticPropsType } from "next"
import Head from "next/head"
import { Summary } from "../components/Summary"
import { getRepoData } from "../lib/github-api-client"

type Props = {
  name: string
  stars: number
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const result = await getRepoData("facebook/react")
  return {
    props: {
      name: result.full_name,
      stars: result.stargazers_count
    }
  }
}

const SSGPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { name, stars } = props
  return (
    <div>
      <Head>
        <title>Rendering Demo (SSG)</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <p>SSG</p>
        <Summary name={name} stars={stars} />
    </div>
  )
}

export default SSGPage
