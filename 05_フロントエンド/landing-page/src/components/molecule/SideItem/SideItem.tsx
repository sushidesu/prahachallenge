import styles from "./SideItem.module.css"

type SideItemProps = {
  header: React.ReactChild
  children: React.ReactChild
}

export const SideItem = (props: SideItemProps): JSX.Element => {
  const { header, children } = props
  return (
    <div>
      <div className={styles["header"]}>{header}</div>
      <div className={styles["content"]}>{children}</div>
    </div>
  )
}
