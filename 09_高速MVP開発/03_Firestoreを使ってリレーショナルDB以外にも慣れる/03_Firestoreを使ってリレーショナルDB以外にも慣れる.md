# Firestoreを使ってリレーショナルDB以外にも慣れる

## 課題1 (モデリング)

### prahachallengeをモデリング

- 以下のエンティティとプロパティが存在しています
  - ユーザー
    - 名前
  - 課題
    - タイトル
  - 課題ステータス
    - 未完了
    - 完了

> DynamoDBのデータベース設計はRDBとは異なります。RDBは柔軟にクエリが可能であるため、データへのアクセスパターンを考慮せずに、最初に正規化されたテーブルを設計します。一方、DynamoDBはクエリが限定的であるために、初めにデータへのアクセスパターンを決めて、それに基づいてテーブル設計を行います。
>
> https://zenn.dev/higashimura/articles/74c6e6bf63a133#%E3%83%87%E3%83%BC%E3%82%BF%E3%83%99%E3%83%BC%E3%82%B9%E8%A8%AD%E8%A8%88

この手順で設計する

#### 1. モデリング

![diagram1](./images/diagram1.svg)

<details><summary>ER図コード</summary>

```plantuml
entity Task {
  + id: string
  --
  title: string
}

entity User {
  + id: string
  --
  name: string
}

entity TaskStatus {
  + id: string
  --
  name: string
}

entity ChangeTaskStatus {
  + id: string
  --
  taskId: string
  taskStatusId: string
  userId: string
}

Task ||--o{ ChangeTaskStatus
ChangeTaskStatus||--o{ User
ChangeTaskStatus ||-o{ TaskStatus
```

</details>

#### 2. Read Light / Write Heavy を考える

Airtableのように、タスク一覧+ユーザーごとのタスクステータスをReadしやすいようにする

現在の設計では課題一覧の取得は以下のような流れになる。問い合わせ回数が多く取得処理が複雑になっている。

1. ChangeTaskStatusからTask/Userごとに最新のtaskStatusIdを取得する
1. Taskを取得する
1. Userを取得する
1. TaskStatusを取得する
1. マージする
1. Taskのid順に並び替える

そこで、 `TaskStatusTable` テーブルを作成し、少ない問い合わせ回数で課題位一覧を取得できるようにする。

`TaskStatusTable` では、タスクごとにユーザーの情報・ステータスの情報を非正規化して保持している。

![diagram2](./images/diagram2.svg)

<details><summary>ER図コード</summary>

```plantuml
entity TaskStatusTable {
  + id: string
  --
  taskId: string
  userId: string
  userName: string
  taskStatusId: string
  taskStatusName: string
}

entity Task {
  + id: string
  --
  title: string
}

Task ||-|| TaskStatusTable

entity User {
  + id: string
  --
  name: string
}

entity TaskStatus {
  + id: string
  --
  name: string
}

entity ChangeTaskStatus {
  + id: string
  --
  taskId: string
  taskStatusId: string
  userId: string
}

Task ||--o{ ChangeTaskStatus
ChangeTaskStatus||--o{ User
ChangeTaskStatus ||-o{ TaskStatus
```

</details>

### 初期データ投入

[./initData.ts](./initData.ts) で投入した

#### 実行コマンド

```sh
$ deno task setup
```

#### 実行結果

ユーザーが3人以上登録されている

![users](./images/users.png)

1人のユーザーにつき3個の課題が「完了」か「未完了」の状態で紐づけられている (画像は `users/DKVoow7fAf0GOZKjD3Dw` のユーザー)

![task1](./images/task1.png) ![task2](./images/task2.png)
![task3](./images/task3.png)

## 課題2 (実装)

### あるユーザーの課題ステータスを一覧表示する

- `/users/<userId>` から該当ユーザーを取得
- `/users/<userId>/taskList` からタスク一覧を取得
- joinして返す

[./src/getTaskListFromUser.ts](./src/getTaskListFromUser.ts)

```sh
~/dev/prahachallenge/09_高速MVP開発/03_Firestoreを使ってリレーショナルDB以外にも慣れる task/firestore_2*
❯ deno run --allow-read --allow-net src/getTaskListFromUser.ts 
Check file:///home/sushidesu/dev/prahachallenge/09_%E9%AB%98%E9%80%9FMVP%E9%96%8B%E7%99%BA/03_Firestore%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%83%AA%E3%83%AC%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%8A%E3%83%ABDB%E4%BB%A5%E5%A4%96%E3%81%AB%E3%82%82%E6%85%A3%E3%82%8C%E3%82%8B/src/getTaskListFromUser.ts
{
  id: "xJOiYGrv6wgVeUhyIAFs",
  name: "Linus Torvalds",
  questions: [
    {
      taskId: "JP5ici0xcbOxLIv3dMSR",
      taskTitle: "DNSを学ぼう",
      taskDescription: "digコマンドを使って普段使っているwebサイトのdnsレコードを調べてみよう！",
      statusId: "finished",
      statusName: "完了"
    },
    {
      taskId: "Am4gpgdVl0uwO4TuJiqJ",
      taskTitle: "Cloudflare D1を使ってみよう",
      taskDescription: "特大課題のデータベースをD1に移行してみよう！",
      statusId: "unfinished",
      statusName: "未完了"
    },
    {
      taskId: "gNPv4lmt7Gcjeg1frs9g",
      taskTitle: "TypeScriptで色んな型を作ってみよう",
      taskDescription: "Pick<T>を自作してみよう！",
      statusId: "unfinished",
      statusName: "未完了"
    }
  ]
}
```

### 特定のユーザーに紐付いた課題を「未完了」から「完了」にする

- `/changeTaskStatus` にレコードを追加
- `/users/<userId>/taskList` から該当するタスクを取得して、ステータスを更新する

[./src/updateTaskStatus.ts](./src/updateTaskStatus.ts)

### 特定の課題を更新する

- `/tasks/<taskId>` を更新する
- `/users/<すべてのユーザー>/taskList` から該当するタスクを取得して、情報を更新する

[./src/updateTask.ts](./src/updateTask.ts)

### 特定の課題を削除する

- `/tasks/<taskId>` を削除する
- `/users/<すべてのユーザー>/taskList` から該当するタスクを取得して、削除する

[./src//deleteTask.ts](./src//deleteTask.ts)

## 課題3 (質問)

### NoSQLではどのように正規化するか？

- Read Light / Write Heavy を意識して正規化する
  - クエリが限定的なため、読み取りを中心に設計する (必要に応じて非正規化してデータを保持する)
  - 取得のユースケースに合わせて正規化を行う
  - 非正規化したデータは、バッチ処理などによって結果整合性を確保する

### NoSQL/RDBMS のメリットデメリット

- NoSQL
  - スキーマレス
    - △ 整合性を確保しづらい
  - 分散処理
    - ◯ 書き込み/読み取りが簡単にスケールできる
  - ◯ リアルタイムなデータのやり取り
  - × クエリ機能が弱い
  - **どんなときに使うのか**
    - リアルタイム性が必要なデータ (チャットなど)
    - 大量のリクエストが予想され、かつ強い整合性が不要なデータ
      - 読み込み画面に合わせたデータを非正規化して置いておくと良さそう
      - SQLにおけるマテリアライズドビューのような使い方
- RDBMS
  - スキーマフル
    - ◯ 強い整合性
  - 集中処理
    - △ 大量のリクエストがきたときにボトルネックになりやすい
  - ◯ 柔軟なクエリ
  - **どんなときに使うのか**
    - 強い整合性が必要なとき
    - アプリケーションのコアとなるデータを格納する時
      - 特に、ドメインロジックが複雑な場合
