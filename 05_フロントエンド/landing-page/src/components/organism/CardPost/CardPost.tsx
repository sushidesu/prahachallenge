import styles from "./CardPost.module.css"

import { Card } from "@/components/atom/Card"

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
  image: string
}

export type CardPostProps = Post

export const CardPost = (props: CardPostProps): JSX.Element => {
  const { date, title, body } = props
  return (
    <Card>
      <div className={styles["wrapper"]}>
        <p>{date.toLocaleDateString()}</p>
        <p>{title}</p>
        <p>{body}</p>
      </div>
    </Card>
  )
}
