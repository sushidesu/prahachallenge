import styles from "./CardPostSmall.module.css"

import { Card } from "@/components/atom/Card"
import { DateText } from "@/components/atom/DateText"
import { Tag } from "@/components/atom/Tag"
import { Author } from "@/components/molecule/Author"

export type CardPostSmallProps = {
  date: Date
  title: string
  tag: {
    name: string
    link: string
  }
  author: {
    name: string
    image?: string | undefined
  }
}

export const CardPostSmall = (props: CardPostSmallProps): JSX.Element => {
  const { date, title, tag, author } = props
  return (
    <Card>
      <div className={styles["wrapper"]}>
        <div className={styles["header"]}>
          <Tag size="sm">{tag.name}</Tag>
        </div>
        <div className={styles["content"]}>
          <p>{title}</p>
        </div>
        <div className={styles["footer"]}>
          <Author {...author} />
          <DateText date={date} />
        </div>
      </div>
    </Card>
  )
}
