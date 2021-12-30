import { Button } from "@/components/ui/Button"

import styles from "./Home.module.css"

export const Home = (): JSX.Element => {
  return (
    <div className={styles["wrapper"]}>
      <p>hello</p>
      <Button>OK</Button>
    </div>
  )
}
