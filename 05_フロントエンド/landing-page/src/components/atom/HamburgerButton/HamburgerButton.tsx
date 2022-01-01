import React from "react"

import styles from "./HamburgerButton.module.css"

type HamburgerButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "children"
>

export const HamburgerButton = (props: HamburgerButtonProps): JSX.Element => {
  return <button {...props} className={styles["wrapper"]} />
}
