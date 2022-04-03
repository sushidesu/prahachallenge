# 外部APIを活用してみよう

作成したアプリケーション: [/twitter-extract-users](./twitter-extract-users/)

### 使い方

```sh
# ビルド
yarn build

# 1週間以内に特定の単語をツイートしたユーザーを抽出
yarn start text <検索文字列>

# 対象ユーザーをフォローしているユーザーを抽出
yarn start following --id <ユーザーID>

# ユーザーネーム(スクリーンネーム)でも検索可能
yarn start following --username <ユーザーネーム>
```

### 実行結果

```sh
❯ yarn start text "プラハチャレンジ"                  
yarn run v1.22.18
$ node --experimental-fetch dist/main.js text プラハチャレンジ
users who tweeted プラハチャレンジ:
(node:147559) ExperimentalWarning: Fetch is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
みんみん (@minmin_memo)
dowanna @PrAha Inc. CEO兼エンジニア (@dowanna6)
(node:147559) ExperimentalWarning: buffer.Blob is an experimental feature. This feature could change at any time
Done in 0.60s.
```

```sh
❯ yarn start following -u "_sushidesu"
yarn run v1.22.18
$ node --experimental-fetch dist/main.js following -u _sushidesu
(node:147892) ExperimentalWarning: Fetch is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:147892) ExperimentalWarning: buffer.Blob is an experimental feature. This feature could change at any time
users who following @_sushidesu:
Kyosuke (@wooootack)
ゲントク (@gn_t_k)
yurika@サウナー (@hbaaTmXufwGiOh3)
...(略)
```

### 補足情報

- オニオンアーキテクチャっぽく書いた
  - [`domain`](./twitter-extract-users/src/domain/)
    - Twitterユーザーの型定義
    - TwitterClientの型定義
  - [`usecase`](./twitter-extract-users/src/usecase/)
    - 文字列検索でユーザーを抽出するユースケース
    - フォロワーを抽出するユースケース (userId指定)
    - フォロワーを抽出するユースケース (usename指定)
  - [`client`](./twitter-extract-users/src/client/)
    - TwitterClient (TwitterAPIのラッパー)
  - [`main.ts`](./twitter-extract-users/src/main.ts)
    - エントリポイント
    - コマンドライン引数をパースして、ユースケースを呼び出す
    - 結果を整形して出力する
- コマンドライン引数やAPIからの返り値などのパースには [zod](https://github.com/colinhacks/zod) を使った
  - 宣言的に書けるので書きやすい
- Node.js組み込みのfetchを試してみた
  - [The Fetch API is finally coming to Node.js - LogRocket Blog](https://blog.logrocket.com/fetch-api-node-js/)
  - 実験的機能なので実行時に `--experimental-fetch` フラグが必要
  - Node.jsのバージョンは17.5以上である必要がある
