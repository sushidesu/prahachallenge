import { useRef, useEffect } from "react"

type SomeComponentProps = {
  flag: boolean
}

export const SomeComponent = ({ flag }: SomeComponentProps) => {
  // 無限ループバージョン
  // stateの更新にはレンダリングが伴うため、何度もuseEffectが呼ばれてしまう
  // 初回レンダリング -> useEffect(ステートの更新) -> ステートが更新されたのでレンダリング -> useEffect(ステートの更新)
  // const [rendered, setRendered] = useState(0)
  // 
  // useEffect(() => {
  //  setRendered(prev => prev + 1)
  //})
  // 無限ループバージョンここまで

  const rendered = useRenderCount(flag)

  return (
    <div>
      <p>ここに、このコンポーネントがレンダリングされた回数を表示してみよう!</p>
      <p>{`${rendered} times`}</p>
    </div>
  )
}

const useRenderCount = (condition: boolean = true) => {
  // count.current の初期値を0にする
  const count = useRef<number>(0)

  useEffect(() => {
    // 各レンダリング後にcount.currentを加算
    // 加算の結果は次のレンダリングに使用される
    if (condition) {
      count.current += 1
    }
  })

  // 初回レンダリング : 初期値(0) -> レンダリング -> effect(0+1)
  // 2回目レンダリング: レンダリング (1) -> effect(1+1) 
  return count.current
}
