import { LayoutDefault } from "@/components/ui/LayoutDefault"

import { Home, HomeTemplateProps } from "./Home"

import { Footer } from "@/components/organism/Footer"
import { Header } from "@/components/organism/Header"

export const HomePage = (props: HomeTemplateProps): JSX.Element => {
  return (
    <LayoutDefault header={<Header />} footer={<Footer />}>
      <Home {...props} />
    </LayoutDefault>
  )
}
