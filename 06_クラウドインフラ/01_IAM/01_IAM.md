# IAM

## 課題1

### IAM

> AWS のサービスやリソースへのきめ細かいアクセス許可の適用
> https://aws.amazon.com/jp/iam/

- Identity and Access Management の略。
- IAMというサービスの中に、IAMユーザやIAMグループなどの概念がある

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
- IAMポリシーを付与する ≒ 権限を付与する
- IAMユーザーの集まりがIAMグループ
- IAMロール自体は権限を行使せず、他のエンティティがロールを引き受け、行使する。
- AWSのサービス (lambda, EC2, ...) = AWSリソース

## 課題2

### IAMユーザ

- 質問: なぜルートユーザーではなく管理者権限のIAMユーザーを使用する？
  - 回答:
  - ルートユーザーは全てのリソースにフルアクセスでき、制限することもできないため、リスクが高いから。
- PowerUserによるダッシュボードアクセス
  - エラーメッセージ
  - > ~/poweruser is not authorized to perform: iam:GetAccountSummary on resource: *
  - > ~/poweruser is not authorized to perform: iam:ListAccessKeys on resource: user poweruser
  - などなど
  - ダッシュボードの中でも、細かく権限が分かれているみたい

### グループ

- 質問: ユーザとグループを使用する方法はどちらが適切？
  - 回答:
  - グループは便利だが、権限の変更はグループ内の全ユーザーに適用されるため、グループには最低限の権限のみ付与したい。組織内で共通している権限はグループ、それ以外は個別にIAMユーザーに付与したい。
  - AdministratorAccess権限は強力な権限なので、意図しない付与を防ぐためグループに付与することはせず、個別のユーザー付与するほうが適切だと考えます。

### サービスのIAM

- EC2を作成, S3の作成
- EC2にssh

`AdministratorAccess` のiamユーザーでaws cliを使ったら中身を表示できてしまった(それはそうかも)。想定されたやり方ではない？

```sh
[ec2-user@ip-xxx-xxx ~]$ aws s3 ls
Unable to locate credentials. You can configure credentials by running "aws configure".
[ec2-user@ip-xxx-xxx ~]$ aws configure
AWS Access Key ID [None]: XXXXXX
AWS Secret Access Key [None]: XXXXXX
Default region name [None]:
Default output format [None]:
[ec2-user@ip-xxx-xxx ~]$ aws s3 ls
2021-11-27 11:39:11 iam-sample
[ec2-user@ip-xxx-xxx ~]$ aws s3 ls s3://iam-sample
2021-11-27 11:49:20        928 color1.scss
```

権限の付与方法を調べた。

https://aws.amazon.com/jp/premiumsupport/knowledge-center/ec2-instance-access-s3-bucket/

以下のポリシーを付与したロールを作成すると良さそう？

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::iam-sample"
        }
    ]
}
```

- 質問：EC2インスタンスに付与するのはロール？ポリシー？
  - 回答:
  - ロール
  - EC2から他のリソースへのアクセスを許可したい場合を考える
    - リソースには、 `アイデンティティベースのポリシー` (誰がどこにどんなアクションを実行できるか) は付与できず、 `リソースベースのポリシー` (このリソースに対して誰がどんなアクションを実行できるか) のみを付与できる。
    - そのため、ポリシーを使用する場合は、使用される側のリソースに `リソースベースのポリシー` を付与し、EC2からのアクセスを許可することになる。
    - ロールを使用する場合は、ロールに `アイデンティティベース` のポリシーを付与し、EC2がそのロールを引き受けられるようにすることになる。
    - よって使用する側 (EC2) の権限が、使用される側の各リソースに分散してしまう (凝集度が下がる) ため、ロールを使用するほうが適切だと考えました。
  - 参考:
    - [AWSのポリシーを使いこなそう　ポリシー設計につまづかないためのポイントを整理 | そるでぶろぐ](https://devlog.arksystems.co.jp/2020/03/12/9338/)
    - [IAM ロールの PassRole と AssumeRole をもう二度と忘れないために絵を描いてみた | DevelopersIO](https://dev.classmethod.jp/articles/iam-role-passrole-assumerole/)
  - ただし、ロールを複数同時に引き受けることはできないため、複数の共有リソースを扱うときに便利らしい。
  - > ロールのアクセス許可を受け取るために自身のアクセス許可を放棄する必要はありません。(中略) これは、他のアカウントに属する共有リソースから、また共有リソースへと情報をコピーするといったタスクにおいて便利です。

## 課題3 (クイズ)

`PowerUserAccess` は、どのような操作が許可されて、どのような操作が許可されないポリシーでしょうか？

<details><summary>回答例</summary>

AWS IAM, AWS Organizations以外の全ての操作を許可するポリシー。ただしIAMの中でも、サービスにリンクされたロールを作成する操作は許可される。

> このポリシーの最初のステートメントでは、NotAction 要素を使用して、すべての AWS サービスのすべてのアクションと、すべてのリソース (AWS Identity and Access Management および AWS Organizations を除く) のすべてのアクションを許可します。2 つめのステートメントでは、サービスにリンクされたロールを作成する IAM アクセス許可を付与します。
>
> [AWSジョブ機能の 管理ポリシー - AWS Identity and Access Management](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/access_policies_job-functions.html#jf_developer-power-user)
</details>

## その他

- ポリシーがたくさんあった。細かく制御できるようになっているが、その分管理は大変になりそう。
- 普通の組織(?)ではどのように運用されているのだろう？ (開発者には基本PowerUserAccessを付与する形になる？)
