import styles from "./Tag.module.css"

type TagProps = {
  children?: string
  size?: "sm" | "md"
}

export const Tag = ({ children, size = "md" }: TagProps): JSX.Element => {
  return <p className={`${styles["wrapper"]} ${styles[size]}`}>{children}</p>
}
