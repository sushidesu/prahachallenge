import styles from "./Home.module.css"

import { Box } from "@/components/atom/Box"
import { Card } from "@/components/atom/Card"
import { List } from "@/components/atom/List"
import { Section } from "@/components/atom/Section"
import { SectionTitle } from "@/components/atom/SectionTitle"
import { Select, OptionItem } from "@/components/atom/Select"
import {
  AuthorDetails,
  AuthorDetailsProps,
} from "@/components/molecule/AuthorDetails"
import { CardPost, CardPostProps } from "@/components/organism/CardPost"
import {
  CardPostSmall,
  CardPostSmallProps,
} from "@/components/organism/CardPostSmall"
import { Pagenation } from "@/components/organism/Pagenation"

const _img = (image?: string): string | undefined =>
  image ? `/image/${image}` : undefined

const _genPost = (title: string, image?: string): CardPostProps => ({
  date: new Date(),
  tag: {
    name: "Larabel",
    link: "",
  },
  title,
  body: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!",
  link: "/#",
  author: {
    name: "Alex John",
    image: _img(image),
  },
})

const _genAuthor = (name: string, image?: string): AuthorDetailsProps => ({
  name,
  image: _img(image),
  numberOfPosts: 20,
})

const _genCategory = (name: string): _Category => ({
  name,
  link: "/#",
})

type _Category = {
  name: string
  link: string
}

export const Home = (): JSX.Element => {
  const posts: CardPostProps[] = [
    _genPost("Build Your New Idea with Laravel Freamwork."),
    _genPost("Accessibility tools for designers and developers"),
    _genPost("PHP: Array to Map"),
    _genPost("Django Dashboard - Learn by Coding"),
    _genPost("TDD First"),
  ]

  const authors: AuthorDetailsProps[] = [
    _genAuthor("Alex John"),
    _genAuthor("Jane Doe", "neko.png"),
    _genAuthor("Lisa Way"),
    _genAuthor("Steve Matt", "sushidesu.jpg"),
    _genAuthor("Khatab Wedaa"),
  ]

  const categories: _Category[] = [
    _genCategory("PHP"),
    _genCategory("AWS"),
    _genCategory("Laravel"),
    _genCategory("Vue"),
    _genCategory("Design"),
    _genCategory("Django"),
    _genCategory("PHP"),
  ]

  const resentPost: CardPostSmallProps = _genPost(
    "Build Your New Idea with Laravel Freamwork."
  )

  const options: OptionItem[] = [
    {
      label: "Latest",
      value: "latest",
    },
    {
      label: "Last Week",
      value: "last-week",
    },
  ]

  return (
    <div className={styles["wrapper"]}>
      <div className={styles["main"]}>
        <Box spaceX="lg">
          <Section
            size="lg"
            header={
              <div className={styles["main-header"]}>
                <SectionTitle>Post</SectionTitle>
                <Select options={options} />
              </div>
            }
            footer={<Pagenation links={["/#", "/#", "/#"]} />}
          >
            <List size="md">
              {posts.map((post, i) => (
                <CardPost key={i} {...post} />
              ))}
            </List>
          </Section>
        </Box>
      </div>
      <div className={styles["side"]}>
        <Box spaceX="lg">
          <List size="lg">
            <Section header={<SectionTitle>Authors</SectionTitle>}>
              <Card>
                <List size="sm">
                  {authors.map((author, i) => (
                    <AuthorDetails key={i} {...author} />
                  ))}
                </List>
              </Card>
            </Section>
            <Section header={<SectionTitle>Categories</SectionTitle>}>
              <Card>
                <List size="sm">
                  {categories.map((category, i) => (
                    <p key={i}>{category.name}</p>
                  ))}
                </List>
              </Card>
            </Section>
            <Section header={<SectionTitle>Recent Post</SectionTitle>}>
              <CardPostSmall {...resentPost} />
            </Section>
          </List>
        </Box>
      </div>
    </div>
  )
}
