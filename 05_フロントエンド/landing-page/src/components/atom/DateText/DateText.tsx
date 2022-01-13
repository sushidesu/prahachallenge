import styles from "./DateText.module.css"

type DateTextProps = {
  date: Date
}

export const DateText = (props: DateTextProps): JSX.Element => {
  const { date } = props
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  // a valid date string
  const dateString = `${year}-${month}-${day}`
  return (
    <p className={styles["wrapper"]}>
      <time dateTime={dateString}>
        {date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </time>
    </p>
  )
}
