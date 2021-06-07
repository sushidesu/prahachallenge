# DBモデリング4

## slack api の仕様など

参考: [Enabling interactivity with Slash Commands | Slack](https://api.slack.com/interactivity/slash-commands)

- `/[command-name] hogheoge` のメッセージで特定のURLにHTTP POSTリクエストを送信させることができる
- メッセージに含まれる リンク, User, Channel は エスケープされる (User, Channel は `their correlated IDs` に変換される)

送信されるリクエストは以下のような形式

```text
token=gIkuvaNzQIHg97ATvDxqgjtO
&team_id=T0001
&team_domain=example
&enterprise_id=E0001
&enterprise_name=Globular%20Construct%20Inc
&channel_id=C2147483705
&channel_name=test
&user_id=U2147483697
&user_name=Steve
&command=/weather
&text=94070
&response_url=https://hooks.slack.com/commands/1234/5678
&trigger_id=13345224609.738474920.8088930838d88f008e0
&api_app_id=A123456
```

## 課題1

```plantuml
entity Reminder {
  + id
  ---
  cycleId: [fk]
  setBy: [fk]
  setAt: timestamp
  text: body
  interval: number
  remindAt: timestamp
}
note left: rimindAtを随時更新する

entity User {
  + slackUserId
}

entity RemindUser {
  + (reminderId, remindedUserId)
  ---
  reminderId: [fk]
  remindedUserId: [fk]
}
note right
リマインドされるユーザー
end note

Reminder -- User
Reminder -- RemindUser 
RemindUser -- User
```

## 疑問

- 複数のワークスペースにインストールされるが、ワークスペースによる区別は何か行ったのか？
- 同時に送信できるメッセージの数に制限は無いのか？ ある場合、どのように制限を回避したか？
- 削除されたユーザー等への対応はどうしたか？ (メッセージ送る側、送られる側)
