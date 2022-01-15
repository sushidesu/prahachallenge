type SomeComponentProps = {
  flag: boolean
}

export const SomeComponent = ({ flag }: SomeComponentProps) => {
  return (
    <p>ここに、このコンポーネントがレンダリングされた回数を表示してみよう!</p>
  )
}
