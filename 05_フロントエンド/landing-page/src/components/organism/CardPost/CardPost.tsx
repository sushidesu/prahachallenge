import styles from "./CardPost.module.css"

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
  const { title } = props
  return <div className={styles["wrapper"]}>{title}</div>
}
