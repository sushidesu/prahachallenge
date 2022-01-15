# Effect hookを理解する

## 課題1

### 1

useEffectのcleanupは、コンポーネントが画面から消えた後も残り続ける副作用を処理するために必要。cleanupしない場合、副作用が残り続けてしまい、メモリリークが発生する。

> 副作用はしばしば、コンポーネントが画面から消える場合にクリーンアップする必要があるようなリソース（例えば購読やタイマー ID など）を作成します。これを実現するために、useEffect に渡す関数はクリーンアップ用関数を返すことができます。
>
> [フック API リファレンス – React](https://ja.reactjs.org/docs/hooks-reference.html#useeffect)

### 2

useEffectに渡したコールバック関数は、コンポーネントの **レンダリング後** に行われる。これにより、レンダリングされたDOMに対する操作や、レンダリングのライフサイクルに当てはまらない処理(データの購読、タイマーなどの副作用)を記述できる。

| 第2引数 | 例 | コールバックの実行タイミング |
| --- | --- | --- |
| 何かしらの値 | `useEffect(fn, [value])` | `value` が変化したレンダリングの後 |
| 何も指定しない | `useEffect(fn)` | 毎回のレンダリング時、各レンダリングの後 |
| 空の配列 | `useEffect(fn, [])` | 初回レンダリング時のみ |

## 課題2

- 自身がレンダリングされた回数を表示するコンポーネントを作成
- useRefを使用して値を更新してもレンダリングが発生しないようにする

[./use-effect-demo/src/SomeComponents.tsx](./use-effect-demo/src/SomeComponents.tsx)

## 課題3

- `FetchComponent` を作成
- `key` の変更を検知してデータ取得を行うかを判定する
  - `key` が変わらない限りは再リクエストは行われない

[./use-effect-demo/src/FetchComponent.tsx](./use-effect-demo/src/FetchComponents.tsx)

## 課題4 (クイズ)

### クイズ1

1秒ごとに加算される数字を表示する `Timer` コンポーネントを作成してください。

<details><summary>回答例</summary>

`setInterval` を使用して、1秒ごとにstateを更新する。

```tsx
const Timer = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + 1)
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return <p>{count}</p>
}
```
</details>
