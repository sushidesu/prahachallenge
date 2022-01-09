# State hooksを理解してTODOアプリを実装しよう

## 課題1

### 1

hooksメリット

- hooksによって凝集度が高まる
  - > ReactHooksのuseEffect関数により(時間的凝集が)擬似的な機能的凝集となる。
  - from: [オブジェクト指向のその前に-凝集度と結合度/Coheision-Coupling - Speaker Deck](https://speakerdeck.com/sonatard/coheision-coupling?slide=25)
- 凝集度が高いことで、再利用性や保守性が高まる

### 2

便利なhooks

- chakra-uiのhooks
  - [useClipboard - Chakra UI](https://chakra-ui.com/docs/hooks/use-clipboard)
    - クリップボードにコピーを簡単に実現できるhooks
  - [useOutsideClick - Chakra UI](https://chakra-ui.com/docs/hooks/use-outside-click)
    - 要素の外側をクリックしたことを判定してくれるhooks
    - モーダルを実装するときに使うと便利
  - chakra-uiには他にも汎用的なhooksがあって便利
- [thebuilder/react-intersection-observer: React implementation of the Intersection Observer API to tell you when an element enters or leaves the viewport.](https://github.com/thebuilder/react-intersection-observer)
  - 要素が画面内にあるか判定してくれるhooks
  - 画面内に入ったらふわっと出現させるのようなよくあるアニメーションを実現するときに使ったら便利だった
- [@sushidesu/use-filter-select - npm](https://www.npmjs.com/package/@sushidesu/use-filter-select)
  - 他のselectの選択結果を元にselectのoptionsをフィルターするを簡単に書くためのhooks
  - もっと汎用的にしたいがTypeScript力が足りない

## 課題2

Todoアプリのリファクタリング

- リファクタリング後のコード
  - [simple-to-do-list/src/App.tsx](./simple-to-do-list/src/App.tsx)
  - [simple-to-do-list/src/useTodo.ts](./simple-to-do-list/src/useTodo.ts)
- リファクタリング前と後の比較: https://github.com/sushidesu/prahachallenge/compare/a5d83d0cadc2342887a49a01056783698d2aed4f...bbadd6abe559837327b5796e24ccceee032324b6
- やったこと
  - `TodoBox` のロジックを `useTodo` に移動
    - `useTodo` は４つの値を返す
      - `Task[]`: todoのリスト
      - `AddTaskFunction`: todoを追加するときに使う関数
      - `RemoveTaskFunction`: todoを削除するときに使う関数
      - `ToggleCompleteFunction`: todoの完了を切り替えるときに使う関数
  - `TodoItem` は受け取ったものを表示するだけのシンプルなものに変更
    - 削除ボタン/完了ボタン用のハンドラを、ボタンに直接受け渡すように変更した
  - `TodoList` は削除
  - その他 `const` を使用する、クラスコンポーネントから関数コンポーネントへの変更、型をつけるなど細かい修正
- 感想
  - 元コードのReactのバージョンが古すぎて(v0.13.0)、hooksすら使えなかった
  - 新しいバージョンに移したかったが、新しいバージョンにはないdeprecatedなAPIが使われていたた (`React.createClass`, `React.findDOMNode` など)
  - 一般的なclassコンポーネントの実装に移し替えた後、リファクタリングを行った
  - ↑classコンポーネントに移し替えるのが一番大変だった！！

## 課題3

### 1

presentational, containerの分け方メリット

### 2

分割する

## クイズ

- これは動く？ 配列のstate
- formのstateはどう持つのがよい？
