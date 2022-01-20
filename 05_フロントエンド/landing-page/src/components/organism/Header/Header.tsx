import styles from "./Header.module.css"

import { Box } from "@/components/atom/Box"
import { Container } from "@/components/atom/Container"
import { HamburgerButton } from "@/components/atom/HamburgerButton"
import { Logo } from "@/components/atom/Logo"
import { TextHoverable } from "@/components/atom/TextHoverable"
import { LinksHorizontal } from "@/components/molecule/LinksHorizontal"

type HeaderProps = {
  brandName: string
  links: { label: string; href: string }[]
}

export const Header = (props: HeaderProps): JSX.Element => {
  const { brandName, links } = props
  return (
    <div className={styles["wrapper"]}>
      <Container>
        <Box spaceX="lg">
          <div className={styles["inner"]}>
            <div className={styles["brand"]}>
              <Logo>{brandName}</Logo>
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
