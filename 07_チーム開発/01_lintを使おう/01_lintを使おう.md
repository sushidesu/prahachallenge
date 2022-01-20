# lintを使おう

## 課題1

### 1

なぜlintを使うのか

- 可読性のため
  - スタイルガイドラインを揃えられる
  - 揃えられるところは揃えたほうがコードが読みやすい
- バグの防止のため
  - バグが発生するパターンを検知して警告する
  - 機械的に潰せるバグは潰したい
- 快適なコーディングのため
  - ESLintがやってくれることをやる必要がなくなる
  - 他の実装に集中できる

[ESLintのドキュメント](https://eslint.org/docs/about/)より

- 問題のあるパターンや特定のスタイルガイドラインに準拠しているかを検知する静的解析の一種
  - > Code linting is a type of static analysis that is frequently used to find problematic patterns or code that doesn't adhere to certain style guidelines.
- JSは動的で緩い型付けなので、エラーが発生しやすい
  - > JavaScript, being a dynamic and loosely-typed language, is especially prone to developer error. 
- コードを実行せずに問題を発見できる
  - > Linting tools like ESLint allow developers to discover problems with their JavaScript code without executing it.
- 独自のリンティングルールを作成できるところが強み
  - > The primary reason ESLint was created was to allow developers to create their own linting rules.


### 2

重要なルール

1. うーむ

### 3

airbnbのルールでlintをかける

## 課題2

### 1

pre-commit hookを導入

### 2

- ローカルのpre-commitの問題
- 止めることができる
