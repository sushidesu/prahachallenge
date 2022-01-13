import styles from "./SectionTitle.module.css"

type SectionTitleProps = {
  children?: string
}

export const SectionTitle = ({ children }: SectionTitleProps): JSX.Element => {
  return <h2 className={styles["wrapper"]}>{children}</h2>
}
