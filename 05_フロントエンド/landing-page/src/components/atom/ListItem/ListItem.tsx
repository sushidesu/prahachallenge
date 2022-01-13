import styles from "./ListItem.module.css"

type ListItemProps = {
  children?: React.ReactNode
}

export const ListItem = (props: ListItemProps): JSX.Element => {
  const { children } = props
  return (
    <div className={styles["wrapper"]}>
      <p className={styles["text"]}>{children}</p>
    </div>
  )
}
