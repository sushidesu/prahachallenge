import styles from "./Footer.module.css"

import { Logo } from "@/components/atom/Logo"

// type FooterProps = {}

export const Footer = (): JSX.Element => {
  return (
    <footer className={styles["wrapper"]}>
      <Logo>Brand</Logo>
      <p>{`All rights reserved 2022.`}</p>
    </footer>
  )
}
