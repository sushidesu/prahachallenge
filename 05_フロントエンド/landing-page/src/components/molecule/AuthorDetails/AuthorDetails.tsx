import styles from "./AuthorDetails.module.css"

import { Avatar } from "@/components/atom/Avatar"

export type AuthorDetailsProps = {
  name: string
  image?: string | undefined
  numberOfPosts: number
}

export const AuthorDetails = (props: AuthorDetailsProps): JSX.Element => {
  const { image, name, numberOfPosts } = props
  return (
    <div className={styles["wrapper"]}>
      <Avatar name={name} image={image} />
      <p>
        <span className={styles["name"]}>{name}</span>
        <span
          className={styles["posts"]}
        >{`Created ${numberOfPosts} Posts`}</span>
      </p>
    </div>
  )
}
