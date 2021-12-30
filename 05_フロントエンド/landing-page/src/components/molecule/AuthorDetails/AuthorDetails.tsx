import styles from "./AuthorDetails.module.css"

export type AuthorDetailsProps = {
  name: string
  image: string
  numberOfPosts: number
}

export const AuthorDetails = (props: AuthorDetailsProps): JSX.Element => {
  const { name, numberOfPosts } = props
  return (
    <div className={styles["wrapper"]}>
      <p>{name}</p>
      <p>{`Created ${numberOfPosts} Posts`}</p>
    </div>
  )
}
