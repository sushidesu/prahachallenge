# IAM

## 課題1

### IAM

> AWS のサービスやリソースへのきめ細かいアクセス許可の適用
> https://aws.amazon.com/jp/iam/

- Identity and Access Management の略。
- IAMというサービスの中に、IAMユーザやIAMグループなどの概念がある

(権限管理の種類)

ref: https://kenfdev.hateblo.jp/entry/2020/01/13/115032

- ACL
- RBAC
- ABAC

### IAMユーザ

- AWSを使用するユーザー/アプリケーションを表す
- IAMユーザーに対して個別にアクセス許可を割り当てて、AWSのサービスを使用させる
- IAMユーザーは、初めアクセス許可を持っていない状態で作成される
- 管理権限を持ったIAMユーザーによって、他のIAMユーザーの権限を管理することもできる

> (IAM) ユーザーは AWS で作成するエンティティであり、AWS とやり取りするためにこれを使用するユーザーまたはアプリケーションを表します。
> https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_users.html

### IAMグループ

- IAMユーザーの集合を表す
- IAMグループに属するIAMユーザーに権限が継承される
- IAMユーザー権限を一括で管理できて便利

> IAM ユーザーグループとは、IAM ユーザーの集合です。ユーザーグループを使用すると、複数のユーザーに対してアクセス許可を指定でき、それらのユーザーのアクセス許可を容易に管理することができます。
> https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_groups.html

### IAMポリシー

- 権限を記述したもののこと
- これをユーザーやグループに付与することで、それらに権限を与えることができる
- 種類がある
  - ユーザーベースのポリシー
    - IAMユーザ、IAMグループ、IAMロールに関連付けるポリシーのこと
  - リソースベースのポリシー
    - AWSサービスに関連付けるポリシーのこと
  - IAMロールの信頼ポリシー
    - IAMロールに関連付けるポリシーのこと
    - IAMロールの権限移譲操作に特化したポリシー

> ポリシーは基本的に、「誰が」「どのAWSサービスの」「どのリソースに対して」「どんな操作を」「許可する(許可しない)」、といったことをJSON形式で記述します。 
> https://dev.classmethod.jp/articles/aws-iam-policy/

### IAMロール

- 権限の集合に名前をつけたもののこと
- IAMアイデンティティの一種

> IAM ロールは、特定の許可があり、アカウントで作成できるもう 1 つの IAM アイデンティティです。
> https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_roles.html

### つまり

- AWSは基本ホワイトリスト方式
- IAMユーザーの集まりがIAMグループ
- IAMポリシーの集まりがIAMロール
- IAMポリシーを付与する = 権限を付与する
- AWSのサービス (lambda, EC2, ...) = AWSリソース

## 課題2

### IAMユーザ

### グループ

### サービスのIAM

## 課題3 (クイズ)

- IAM ロールとリソースベースのポリシーとの相違点
  - https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_roles_compare-resource-policies.html

### クイズ1

### クイズ2

### クイズ3
