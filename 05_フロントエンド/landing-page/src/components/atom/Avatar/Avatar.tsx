import styles from "./Avatar.module.css"

type AvatarProps = {
  name: string
  image?: string | undefined
}

export const Avatar = (props: AvatarProps): JSX.Element => {
  const { name, image } = props
  if (image === undefined) {
    return <Dummy />
  } else {
    return <img className={styles["image"]} src={image} alt={name} />
  }
}

const Dummy = (): JSX.Element => {
  return <div className={styles["dummy"]} />
}
