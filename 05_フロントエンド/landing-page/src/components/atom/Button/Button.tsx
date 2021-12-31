import styles from "./Button.module.css"

type ButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "className"
>

export const Button = (props: ButtonProps): JSX.Element => {
  return <button {...props} className={styles["wrapper"]} />
}
