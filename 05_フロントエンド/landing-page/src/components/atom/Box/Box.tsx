import styles from "./Box.module.css"

type BoxProps = {
  children?: React.ReactNode
  spaceX?: "sm" | "md" | "lg"
}

export const Box = (props: BoxProps): JSX.Element => {
  const { children, spaceX = "md" } = props
  return (
    <div className={`${styles["wrapper"]} ${styles[spaceX]}`}>{children}</div>
  )
}
