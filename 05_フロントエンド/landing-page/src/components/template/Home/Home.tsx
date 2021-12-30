import styles from "./Home.module.css"

import { Card } from "@/components/atom/Card"
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

  return (
    <div className={styles["wrapper"]}>
      <div className={styles["main"]}>
        {posts.map((post, i) => (
          <CardPost key={i} {...post} />
        ))}
      </div>
      <div className={styles["side"]}>
        <SideItem header={<p>Author</p>}>
          <Card>
            {authors.map((author, i) => (
              <AuthorDetails key={i} {...author} />
            ))}
          </Card>
        </SideItem>
        <SideItem header={<p>Categories</p>}>
          <Card>
            <ul>
              <li>AWS</li>
            </ul>
          </Card>
        </SideItem>
        <SideItem header={<p>Recent Post</p>}>
          <Card>Build Your New Idea with Laravel Freamwork.</Card>
        </SideItem>
      </div>
    </div>
  )
}
