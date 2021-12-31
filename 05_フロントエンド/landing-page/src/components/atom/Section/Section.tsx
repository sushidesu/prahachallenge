import styles from "./Section.module.css"

type SectionProps = {
  header?: React.ReactNode
  children: React.ReactChild
  footer?: React.ReactNode
  size?: "sm" | "md" | "lg"
}

export const Section = (props: SectionProps): JSX.Element => {
  const { header, children, footer, size = "md" } = props
  return (
    <section className={`${styles["wrapper"]} ${styles[size]}`}>
      {header ? <div>{header}</div> : null}
      <div>{children}</div>
      {footer ? <div>{footer}</div> : null}
    </section>
  )
}
