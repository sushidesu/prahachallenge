import Link from "next/link"

import styles from "./CardPost.module.css"

import { Card } from "@/components/atom/Card"
import { Author } from "@/components/molecule/Author"

type Post = {
  date: Date
  tag: {
    name: string
    link: string
  }
  title: string
  body: string
  link: string
  author: Author
}

type Author = {
  name: string
  image?: string | undefined
}

export type CardPostProps = Post

export const CardPost = (props: CardPostProps): JSX.Element => {
  const { date, title, body, author, link } = props
  return (
    <Card>
      <div className={styles["wrapper"]}>
        <p>{date.toLocaleDateString()}</p>
        <div>
          <p className={styles["title"]}>{title}</p>
          <p className={styles["body"]}>{body}</p>
        </div>
        <div className={styles["footer"]}>
          <Link href={link} passHref>
            <a className={styles["link"]}>Read more</a>
          </Link>
          <div>
            <Author name={author.name} image={author.image} />
          </div>
        </div>
      </div>
    </Card>
  )
}
