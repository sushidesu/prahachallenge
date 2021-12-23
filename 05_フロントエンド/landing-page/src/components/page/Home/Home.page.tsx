import { LayoutDefault } from "@/components/ui/LayoutDefault"

import { Home } from "./Home"

export const HomePage = (): JSX.Element => {
  return (
    <LayoutDefault header={<div>Header!</div>} footer={<div>© footer</div>}>
      <Home />
    </LayoutDefault>
  )
}
