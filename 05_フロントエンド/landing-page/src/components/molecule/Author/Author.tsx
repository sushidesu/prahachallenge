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
      <div className={styles["avatar"]}>
        <Avatar name={name} image={image} />
      </div>
      <p>{name}</p>
    </div>
  )
}
