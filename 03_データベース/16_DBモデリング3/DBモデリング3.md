# DBモデリング3

## 課題1

ドキュメント管理システムのDB設計

- [ ] ドキュメント
  - [ ] いつ、誰が、どんなテキストを保存したのかを管理
  - [ ] ドキュメントは**必ず**何らかのディレクトリに属する
- [ ] ディレクトリ
  - [ ] 一つ以上のドキュメントを含む階層構造
  - [ ] ディレクトリは**無制限に**サブディレクトリを持つことができる
  - [ ] ディレクトリ構造は柔軟に変更可能
    - [ ] ディレクトリが移動してサブディレクトリになることもある
- [ ] ユーザ
  - [ ] ドキュメントを作成
  - [ ] ドキュメントを参照
  - [ ] ドキュメントを更新
  - [ ] ドキュメントを削除
  - [ ] ディレクトリをCRUD

- ディレクトリやドキュメントの削除どうする？
  - 論理削除
  - ヒストリーテーブルへ移動
  - 物理削除
- ディレクトリ削除時に、所属しているドキュメントはどうする？

```plantuml
entity Directory {
  + id
  ---
  name: string
  active: boolean
}
note left
空のディレクトリも作成可能とした
end note

entity DirectoryTree {
  + (acc, dec)
  ---
  acc [fk]
  dec [fk]
}
note right
閉包テーブルを使用することで
サブディレクトリを無制限に作成可能
end note

Directory - DirectoryTree

entity Document {
  + id
  ---
  content: string
  parentDirectoryId [fk]
  postedBy [fk]
  postedAt: date
  active: boolean
}
note right
直接ディレクトリのidを持たせることで、
ドキュメントは必ずディレクトリに属することを表現
end note

Directory -- Document

entity User {
  + id
  ---
  name
}

Document -- User
```
