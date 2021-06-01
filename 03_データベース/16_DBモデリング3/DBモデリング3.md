# DBモデリング3

## 課題1

ドキュメント管理システムのDB設計

```plantuml
entity User {
  + id
  ---
  name
}

entity Directory {
  + id
  ---
  name: string
  statusId [fk]
}
note top
空のディレクトリも作成可能とした
end note

entity DirectoryTree {
  + (ascendantId, descendantId)
  ---
  ascendantId [fk]
  descendantId [fk]
}
note right
閉包テーブルを使用することで
サブディレクトリを無制限に作成可能
end note

Directory ||-o{ DirectoryTree

entity DirectoryStatus {
  + id
  ---
  status: string
}
note left: status は active, inactive

DirectoryStatus ||-o{ Directory


entity Document {
  + id
  ---
  statusId [fk]
}

entity DocumentStatus {
  + id
  ---
  status: string
}
note right: status は active, inactive

DocumentStatus ||--o{ Document

entity UserPostDocumentToDirectory {
  + id
  ---
  title: string
  content: string
  directoryId [fk]
  postedBy [fk]
  postedAt: date
}
note left
ドキュメントの投稿イベント
end note

Directory ||---o{ UserPostDocumentToDirectory
UserPostDocumentToDirectory }o-|| Document
UserPostDocumentToDirectory }o---|| User

entity UserUpdateDocument {
  + id
  ---
  previousUpdateId [fk]
  title: string
  content: string
  documentId [fk]
  updatedBy [fk]
  updatedAt: date
}
note right
ドキュメントの更新イベント
previousUpdateIdがnullなら最新
end note

Document ||-o{ UserUpdateDocument
UserUpdateDocument }o---|| User
```

### 考えたこと

- [esa.io](https://docs.esa.io/)を主にイメージ
- [イミュータブルデータモデル - kawasima](https://scrapbox.io/kawasima/%E3%82%A4%E3%83%9F%E3%83%A5%E3%83%BC%E3%82%BF%E3%83%96%E3%83%AB%E3%83%87%E3%83%BC%E3%82%BF%E3%83%A2%E3%83%87%E3%83%AB) を参考に、なるべくUPDATEを発生させない設計にした
- ドキュメントの投稿と更新をイベントに切り出すことで、投稿者と更新者が別の場合や、更新者が複数存在する場合でも表現可能にした
  - ![screenshot1](assets/esa_screenshot_01.png)
- `ドキュメントは必ずディレクトリに属する` を表現するために `Document` に直接ディレクトリのidを持たせることも考えたが、updateとの兼ね合いでやめた
- `Document` には内容を持たせずに、イベントテーブルに内容を持たせるようにした
  - 前回のメンターセッションを参考: [155.注文明細に顧客IDを持たせる設計にした場合、ユーザー登録なしで注文できる仕様をどのように表現すればいいのか](https://hackmd.io/_koVUvhERguir1v7AVddQg#156%E5%95%86%E5%93%81%E3%83%9E%E3%82%B9%E3%82%BF%E3%82%84%E9%A1%A7%E5%AE%A2%E3%83%9E%E3%82%B9%E3%82%BF%E3%81%8C%E5%A4%89%E6%9B%B4%E3%81%95%E3%82%8C%E3%81%A6%E3%81%97%E3%81%BE%E3%81%86%E3%81%93%E3%81%A8%E3%82%92%E3%81%A9%E3%81%AE%E3%82%88%E3%81%86%E3%81%AB%E8%A8%98%E9%8C%B2%E3%81%99%E3%82%8B%E3%81%AE%E3%81%8B)
- 削除を表現するために `Document` , `Directory` それぞれに `status` 属性を付与
