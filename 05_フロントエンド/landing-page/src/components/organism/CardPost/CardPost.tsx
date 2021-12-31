import styles from "./CardPost.module.css"

import { Card } from "@/components/atom/Card"
import { Author } from "@/components/molecule/Author"

type Post = {
  date: Date
  tags: string[]
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
  const { date, title, body, author } = props
  return (
    <Card>
      <div className={styles["wrapper"]}>
        <p>{date.toLocaleDateString()}</p>
        <div>
          <p className={styles["title"]}>{title}</p>
          <p className={styles["body"]}>{body}</p>
        </div>
        <div className={styles["footer"]}>
          <div>Read more</div>
          <div>
            <Author name={author.name} image={author.image} />
          </div>
        </div>
      </div>
    </Card>
  )
}
