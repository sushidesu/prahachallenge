import { SomeComponent } from "./SomeComponents"
import { FetchComponent } from "./FetchComponents"
import { useBoolean } from "./useBoolean"

export const App = () => {
  const [flag, toggle] = useBoolean(false)

  return (
    <div>
      <SomeComponent flag={flag} />
      <hr />
      <FetchComponent />
      <button onClick={toggle}>Render!</button>
    </div>
  )
}
