import styles from "./Header.module.css"

import { Box } from "@/components/atom/Box"
import { Container } from "@/components/atom/Container"
import { HamburgerButton } from "@/components/atom/HamburgerButton"
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
      <Container>
        <Box spaceX="lg">
          <div className={styles["inner"]}>
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
            <div className={styles["hamburger"]}>
              <HamburgerButton />
            </div>
          </div>
        </Box>
      </Container>
    </div>
  )
}
