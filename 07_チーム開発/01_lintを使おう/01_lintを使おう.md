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

- typescriptで検知できなさそうなやつを選んだ
- 意外と非recommendedに良いルールが多かった
- [array-callback-return](https://eslint.org/docs/rules/array-callback-return)
  - `Array.map` や `Array.filter` などの配列メソッドのコールバック内ではreturnしないのはおかしい
    - forEachを使うべき
  - 意図が読みやすくなるのでよさそう
- [no-await-in-loop](https://eslint.org/docs/rules/no-await-in-loop)
  - loop中にawaitするのはおかしい
  - 慣れていないと書いてしまいそう、パフォーマンスの劣化を未然に防げる
- [sort-imports](https://eslint.org/docs/rules/sort-imports)
  - importの並び替え
  - 便利！
  - [import-js/eslint-plugin-import](https://github.com/import-js/eslint-plugin-import) と組み合わせるとより便利
- [prefer-const](https://eslint.org/docs/rules/prefer-const)
  - 再代入されないものには `const` を使おう
  - 当たり前だけど、当たり前だからこそeslintでも担保するとよさそう
- [no-useless-return](https://eslint.org/docs/rules/no-useless-return)
  - 冗長なリターンをやめよう
  - 冗長な記述がなくなりコードが読みやすくなる
- [no-nested-ternary](https://eslint.org/docs/rules/no-nested-ternary)
  - ネストした三項演算子はやめよう
  - ついやりがちなので入れたい
- [no-negated-condition](https://eslint.org/docs/rules/no-negated-condition)
  - 否定条件を前に持ってくるのはやめよう
    - 例: `if (!condition) {} else {}`
    - elseがない場合は問題ない: `if (!condition) {}`
  - あまり意識したことはなかった。コードが読みやすくなりそう

### 3

airbnbのルールでlintをかける

## 課題2

### 1

pre-commit hookを導入

### 2

- ローカルのpre-commitの問題
- 止めることができる
