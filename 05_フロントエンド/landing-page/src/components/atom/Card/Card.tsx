import styles from "./Card.module.css"

type CardProps = {
  children?: React.ReactChild
}

export const Card = ({ children }: CardProps): JSX.Element => {
  return <div className={styles["wrapper"]}>{children}</div>
}
