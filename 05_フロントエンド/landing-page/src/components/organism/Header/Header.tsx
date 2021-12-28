import styles from "./Header.module.css"

import { Logo } from "@/components/atom/Logo"

export const Header = (): JSX.Element => {
  return (
    <div className={styles["wrapper"]}>
      <Logo>Brand</Logo>
    </div>
  )
}
