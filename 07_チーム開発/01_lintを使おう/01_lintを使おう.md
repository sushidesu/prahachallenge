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

- typescriptで検知できなさそうなものを選んだ
- 意外と非recommendedに良いルールが多かった！
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

[dddの課題](https://github.com/sushidesu/prahachallenge-ddd)のプロジェクトにairbnbのルールでlintをかけてみたところ、たくさんの問題が見つかった :cry:

```sh
...
/Users/.../praha-challenge/prahachallenge-ddd/src/usecase/team/move-pair-to-another-team-usecase.ts
  1:1  error  Prefer default export                              import/prefer-default-export
  5:7  error  Expected 'this' to be used by class method 'exec'  class-methods-use-this

✖ 534 problems (532 errors, 2 warnings)
  46 errors and 0 warnings potentially fixable with the `--fix` option.
```

エラーの内訳は以下

- 264 `import/extension`
  - importのときは拡張子をつけよう！ (`import/extensions`)
- 111 `camelcase`
  - キャメルケースを使おう！
  - テスト用データの定義に `p_01`, `p_02` などを使用していたため、警告が多い
- 39 `import/prefer-default-export`
  - なるべくdefault exportを使おう！
  - 個人的にはnamed export好きなので、このルールは採用しないかも
- 29 `lines-between-class-members`
  - クラスメンバの間には空行を開けよう
  - これはPrettierではできない？見やすくなりそうなので採用したいかも
- 24 + 14 `no-useless-constructor`, `no-empty-function`
  - 空のコンストラクタは不要だよ！
  - typescriptの機能([引数プロパティ宣言](https://future-architect.github.io/typescript-guide/class.html#id4))を使っているため、実際には空ではない
- 17 `class-methods-use-this`
  - クラスのメソッドは `this` を使っていないとおかしい！
  - 使わないならスタティックメソッドにすべき！
  - 仕様整理のために空のユースケースを多数作っていたため、引っかかった
- 36 その他
  - `no-console`
  - `object-shorthand`
    - `{ name: name }` は `{ name }` でいいよ！
    - 統一されるので良さそう
  - `import/no-useless-path-segments`
  - `arrow-body-style`
  - `no-else-return`
  - など

## 課題2

### 1

[pre-commit-demo](./pre-commit-demo/package.json)にpre-commit hookを導入した。

```sh
~/dev/praha-challenge/prahachallenge/07_チーム開発/01_lintを使おう/pre-commit-demo task/team_lint*
❯ git c
yarn run v1.22.17
$ /Users/pppark/dev/praha-challenge/prahachallenge/node_modules/.bin/lint-staged
✔ Preparing...
⚠ Running tasks...
  ↓ No staged files match 05_フロントエンド/landing-page/**/*.{js,ts,jsx,tsx} [SKIPPED]
  ↓ No staged files match 05_フロントエンド/landing-page/**/*.{js,ts,jsx,tsx,json,css} [SKIPPED]
  ↓ No staged files match 05_フロントエンド/landing-page/**/*.css [SKIPPED]
  ↓ No staged files match 05_フロントエンド/04_よくあるボタンコンポーネントを作成する/**/*.{ts,tsx} [SKIPPED]
  ❯ Running tasks for 07_チーム開発/01_lintを使おう/pre-commit-demo/**/*.ts
    ✖ yarn --cwd 07_チーム開発/01_lintを使おう/pre-commit-demo eslint [FAILED]
↓ Skipped because of errors from tasks. [SKIPPED]
✔ Reverting to original state because of errors...
✔ Cleaning up...

✖ yarn --cwd 07_チーム開発/01_lintを使おう/pre-commit-demo eslint:
error Command failed with exit code 1.
$ /Users/pppark/dev/praha-challenge/prahachallenge/07_チーム開発/01_lintを使おう/pre-commit-demo/node_modules/.bin/eslint /Users/pppark/dev/praha-challenge/prahachallenge/07_チーム開発/01_lintを使おう/pre-commit-demo/src/sample.ts

/Users/pppark/dev/praha-challenge/prahachallenge/07_チーム開発/01_lintを使おう/pre-commit-demo/src/sample.ts
  4:3  error  The update clause in this loop moves the variable in the wrong direction  for-direction

✖ 1 problem (1 error, 0 warnings)

```

### 2

- ローカルのpre-commitの問題
- 止めることができる
