import { useState, useEffect } from "react"

type SomeComponentProps = {
  flag: boolean
}

export const SomeComponent = ({ flag }: SomeComponentProps) => {
  // 無限ループバージョン
  // stateの更新にはレンダリングが伴うため、何度もuseEffectが呼ばれてしまう
  // 初回レンダリング -> useEffect(ステートの更新) -> ステートが更新されたのでレンダリング -> useEffect(ステートの更新)
  const [rendered, setRendered] = useState(0)

  useEffect(() => {
    setRendered(prev => prev + 1)
  })
  // 無限ループバージョンここまで

  return (
    <div>
      <p>ここに、このコンポーネントがレンダリングされた回数を表示してみよう!</p>
      <p>{`${rendered} times`}</p>
    </div>
  )
}
