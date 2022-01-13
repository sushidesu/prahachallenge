import styles from "./Pagenation.module.css"

import { Button } from "@/components/atom/Button"

type PagenationProps = {
  links: string[]
  range?: number
}

export const Pagenation = (props: PagenationProps): JSX.Element => {
  const { links, range = 3 } = props
  return (
    <div className={styles["wrapper"]}>
      <Button>previous</Button>
      {links
        .filter((_, i) => i < range)
        .map((_, i) => (
          <Button key={i}>{i + 1}</Button>
        ))}
      <Button>Next</Button>
    </div>
  )
}
