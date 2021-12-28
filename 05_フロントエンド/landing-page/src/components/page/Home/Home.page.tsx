import { LayoutDefault } from "@/components/ui/LayoutDefault"
import { Header } from "@/components/organism/Header"

import { Home } from "./Home"

export const HomePage = (): JSX.Element => {
  return (
    <LayoutDefault header={<Header />} footer={<div>© footer</div>}>
      <Home />
    </LayoutDefault>
  )
}
