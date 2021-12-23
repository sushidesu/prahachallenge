import styles from "./Button.module.css"

type ButtonProps = {
  children?: string
}

export const Button = ({ children }: ButtonProps): JSX.Element => {
  return <button className={styles["wrapper"]}>{children}</button>
}
