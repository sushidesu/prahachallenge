import { Header } from "./Header"

export const HeaderContainer = (): JSX.Element => {
  const brandName = "Brand"
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
  return <Header brandName={brandName} links={links} />
}
