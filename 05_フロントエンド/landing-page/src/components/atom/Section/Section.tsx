import styles from "./Section.module.css"

type SectionProps = {
  header: React.ReactChild
  children: React.ReactChild
}

export const Section = (props: SectionProps): JSX.Element => {
  const { header, children } = props
  return (
    <div>
      <div className={styles["header"]}>{header}</div>
      <div className={styles["content"]}>{children}</div>
    </div>
  )
}
