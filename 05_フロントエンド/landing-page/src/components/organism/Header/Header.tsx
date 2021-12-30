import styles from "./Header.module.css"

import { Logo } from "@/components/atom/Logo"
import { TextHoverable } from "@/components/atom/TextHoverable"

export const Header = (): JSX.Element => {
  // TODO: brand, linksを受け取る
  const brand = "Brand"
  const links = [
    {
      label: "Home",
      href: "/"
    },
    {
      label: "Blog",
      href: "/blog"
    },
    {
      label: "About us",
      href: "/about"
    }
  ]
  return (
    <div className={styles["wrapper"]}>
      <div>
        <Logo>{brand}</Logo>
      </div>
      <div>
        <ul>{links.map(link => (
          <li key={link.href}>
            <TextHoverable>{link.label}</TextHoverable>
          </li>
        ))}</ul>
      </div>
    </div>
  )
}
