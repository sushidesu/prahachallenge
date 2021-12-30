import styles from "./TextHoverable.module.css"

type TextHoverableProps = {
  children?: string
}

export const TextHoverable = (props: TextHoverableProps): JSX.Element => {
  const { children } = props
  return (
    <p className={styles["text"]}>{ children }</p>
  )
}
