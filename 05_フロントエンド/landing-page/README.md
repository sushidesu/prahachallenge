# Assessment Jailbreak

## Motivation

We'll make a bunch of real estate websites!

I gave it this name in the hope that many wonderful monsters would jump out of the cage.

## Usage

This project uses [Yarn](https://yarnpkg.com/). Try this command to find out what you can do.

```sh
yarn run
```

## Useful Scripts

| name | description |
| --- | --- |
| dev | `next dev` |
| build | `next start` |
| start | `next start` |
| lint | src以下のコードを対象にESLintを実行します。import順の自動並び替え、使用していないimportの自動削除なども行います。 |
| lint:style | cssをlintします。プロパティの並び順を自動で並び替えます。 |
| format | prettierします。1行が長すぎる場合自動改行されます。 |
| test | `*.test.*` ファイルを対象にテストを実行します。 |
| gen | コンポーネントのテンプレートを自動生成します。詳細は後述します。 |
| prepare | huskyをインストールするためのものです。良きタイミングで自動実行されるので手動実行することはありません。 |

## コンポーネントディレクトリの構成について

[SPA Componentの推しディレクトリ構成について語る](https://zenn.dev/yoshiko/articles/99f8047555f700) を参考にしています。詳細は記事を確認してください。

`yarn gen` で生成できるコンポーネントは2種類あります (`page`, `component`)。`page` は記事中の `page` に対応します。`component` は記事中の `model`, `ui` に対応しています。
