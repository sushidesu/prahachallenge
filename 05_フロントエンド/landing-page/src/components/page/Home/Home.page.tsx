import { LayoutDefault } from "@/components/ui/LayoutDefault"

import { Home } from "./Home"

import { Header } from "@/components/organism/Header"


export const HomePage = (): JSX.Element => {
  return (
    <LayoutDefault header={<Header />} footer={<div>© footer</div>}>
      <Home />
    </LayoutDefault>
  )
}
