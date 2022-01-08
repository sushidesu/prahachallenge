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
  - 他のselectの選択結果を元に他のselectのoptionsをフィルターするを簡単に書くためのhooks
  - もっと汎用的にしたいがTypeScript力が足りない

## 課題2

リファクタリング

## 課題3

### 1

presentational, containerの分け方メリット

### 2

分割する

## クイズ

- これは動く？ 配列のstate
- formのstateはどう持つのがよい？
