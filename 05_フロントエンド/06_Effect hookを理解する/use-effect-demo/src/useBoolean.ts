import { useState, useCallback } from "react"

type ToggleBooleanFunction = () => void

export const useBoolean = (init?: boolean): [boolean, ToggleBooleanFunction] => {
  const [flag, setFlag] = useState(init ?? false)

  const toggle = useCallback(() => {
    setFlag(prev => !prev)
  }, [])

  return [flag, toggle]
}
