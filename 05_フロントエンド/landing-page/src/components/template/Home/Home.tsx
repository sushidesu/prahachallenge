import styles from "./Home.module.css"

import { Box } from "@/components/atom/Box"
import { Card } from "@/components/atom/Card"
import { List } from "@/components/atom/List"
import { SectionTitle } from "@/components/atom/SectionTitle"
import {
  AuthorDetails,
  AuthorDetailsProps,
} from "@/components/molecule/AuthorDetails"
import { SideItem } from "@/components/molecule/SideItem"
import { CardPost, CardPostProps } from "@/components/organism/CardPost"

const _genPost = (title: string): CardPostProps => ({
  date: new Date(),
  tags: ["Larabel"],
  title,
  body: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!",
  link: "/#",
  author: {
    name: "Alex John",
    image: "/dummy",
  },
})

const _genAuthor = (name: string): AuthorDetailsProps => ({
  name,
  image: "/dummy",
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
    _genAuthor("Alex JohnCreated"),
    _genAuthor("Jane DoeCreated"),
    _genAuthor("Lisa WayCreated"),
    _genAuthor("Steve MattCreated"),
    _genAuthor("Khatab WedaaCreated"),
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

  return (
    <div className={styles["wrapper"]}>
      <div className={styles["main"]}>
        <Box spaceX="lg">
          <List size="md">
            {posts.map((post, i) => (
              <CardPost key={i} {...post} />
            ))}
          </List>
        </Box>
      </div>
      <div className={styles["side"]}>
        <Box spaceX="lg">
          <List size="lg">
            <SideItem header={<SectionTitle>Authors</SectionTitle>}>
              <Card>
                <List size="sm">
                  {authors.map((author, i) => (
                    <AuthorDetails key={i} {...author} />
                  ))}
                </List>
              </Card>
            </SideItem>
            <SideItem header={<SectionTitle>Categories</SectionTitle>}>
              <Card>
                <List size="sm">
                  {categories.map((category, i) => (
                    <p key={i}>{category.name}</p>
                  ))}
                </List>
              </Card>
            </SideItem>
            <SideItem header={<SectionTitle>Recent Post</SectionTitle>}>
              <Card>Build Your New Idea with Laravel Freamwork.</Card>
            </SideItem>
          </List>
        </Box>
      </div>
    </div>
  )
}
