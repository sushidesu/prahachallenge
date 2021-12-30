import styles from "./LinksHorizontal.module.css"

type LinksHorizontalProps = {
  children?: JSX.Element[]
}

export const LinksHorizontal = ({
  children,
}: LinksHorizontalProps): JSX.Element => {
  return (
    <ul className={styles["wrapper"]}>
      {children?.map((child, i) => (
        <li key={i} className={styles["item"]}>
          {child}
        </li>
      ))}
    </ul>
  )
}
