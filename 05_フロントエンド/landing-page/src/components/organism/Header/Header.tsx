import styles from "./Header.module.css"

import { Logo } from "@/components/atom/Logo"
import { TextHoverable } from "@/components/atom/TextHoverable"
import { LinksHorizontal } from "@/components/molecule/LinksHorizontal"

export const Header = (): JSX.Element => {
  // TODO: brand, linksを受け取る
  const brand = "Brand"
  const links = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "About us",
      href: "/about",
    },
  ]
  return (
    <div className={styles["wrapper"]}>
      <div className={styles["brand"]}>
        <Logo>{brand}</Logo>
      </div>
      <div className={styles["links"]}>
        <LinksHorizontal>
          {links.map((link) => (
            <TextHoverable key={link.href}>{link.label}</TextHoverable>
          ))}
        </LinksHorizontal>
      </div>
    </div>
  )
}
