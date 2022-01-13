import styles from "./List.module.css"

type ListProps = {
  children?: JSX.Element[]
  size?: "sm" | "md" | "lg"
}

export const List = (props: ListProps): JSX.Element => {
  const { children, size = "md" } = props
  return (
    <ul className={styles[size]}>
      {children?.map((child, i) => (
        <li key={i} className={styles["item"]}>
          {child}
        </li>
      ))}
    </ul>
  )
}
