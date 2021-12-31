import styles from "./Author.module.css"

import { Avatar } from "@/components/atom/Avatar"

type AuthorProps = {
  name: string
  image?: string | undefined
}

export const Author = (props: AuthorProps): JSX.Element => {
  const { name, image } = props
  return (
    <div className={styles["wrapper"]}>
      <Avatar name={name} image={image} />
      <p>{name}</p>
    </div>
  )
}
