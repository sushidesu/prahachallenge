import styles from "./Home.module.css"

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

export const Home = (): JSX.Element => {
  const posts: CardPostProps[] = [
    _genPost("Build Your New Idea with Laravel Freamwork."),
    _genPost("Accessibility tools for designers and developers"),
    _genPost("PHP: Array to Map"),
    _genPost("Django Dashboard - Learn by Coding"),
    _genPost("TDD First"),
  ]

  return (
    <div className={styles["wrapper"]}>
      <div className={styles["main"]}>
        {posts.map((post, i) => (
          <CardPost key={i} {...post} />
        ))}
      </div>
      <div className={styles["side"]}>side</div>
    </div>
  )
}
