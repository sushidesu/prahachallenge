import styles from "./LayoutDefault.module.css"

type LayoutDefaultProps = {
  header: React.ReactNode
  footer?: React.ReactNode
  children?: React.ReactNode
}

export const LayoutDefault = (props: LayoutDefaultProps): JSX.Element => {
  const { header, footer, children } = props

  return (
    <div className={styles["wrapper"]}>
      <header className={styles["header"]}>{header}</header>
      <main className={styles["main"]}>{children}</main>
      {footer ? <footer className={styles["footer"]}>{footer}</footer> : null}
    </div>
  )
}
