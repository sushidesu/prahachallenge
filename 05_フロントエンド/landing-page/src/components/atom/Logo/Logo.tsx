import styles from "./Logo.module.css"

type LogoProps = {
  children?: string
}

export const Logo = (props: LogoProps): JSX.Element => {
  const { children } = props
  return (
    <div className={styles["wrapper"]}>{children}</div>
  )
}
