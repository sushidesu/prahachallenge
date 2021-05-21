# CORSについて理解する

## 課題1 (質問)

### 1

CORSの仕組み

`preflight request` `simple request` `access-control-allow-origin`

CORSとは、クロスオリジン間の通信の制限(Same-Origin Policy)を緩和するための手続きである。

サーバーは、 `simple request` に対して、`access-control-allow-origin`レスポンスヘッダーによって、アクセス可能なオリジンを指示することができる。それ以外のリクエストに対しては、事前に送られる `preflight request` に対して `access-control-allow-XXX` レスポンスヘッダーによって、許可するアクセス可能なオリジン、許可するHTTPメソッド、含めることのできるヘッダーを指示することができる。

### 2

CORSが無い場合、コンテンツを全て単一のサーバーから配信しなくてはならないため、CDNを使用した最適化されたコンテンツの配信、SaaSや外部APIとの連携ができない。

[包括的にSame-Origin Policy（同一生成元ポリシー）を理解する＜2021年版＞ - Qiita](https://qiita.com/masaoki/items/dea5843c9baf59bee2dc#%E3%82%AF%E3%83%AD%E3%82%B9%E3%82%B5%E3%82%A4%E3%83%88%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88%E3%81%AE%E5%BF%85%E8%A6%81%E6%80%A7)

### 3

`Access-Control-Allow-Origin: *` が問題になるケース

`Access-Control-Allow-Origin` にワイルドカードを使用する場合、クッキー利用できない。

[Reason: Credential is not supported if the CORS header ‘Access-Control-Allow-Origin’ is ‘*’ - HTTP | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS/Errors/CORSNotSupportingCredentials)

### 4

シンプルなリクエストの条件

- メソッドが GET, HEAD POSTのいずれか
- かつ、手動で設定したヘッダーが以下のみ
  - Accept
  - Accept-Language
  - Content-Language
  - Content-Type
  - DPR
  - Downlink
  - Save-Data
  - Viewport-Width
  - Width
- かつ、Content-Type(もしある場合)が以下のどれか
  - application/x-www-form-urlencoded
  - multipart/form-data
  - text/plain

### 5

Access-Control-Allow-Originにリクエスト送信元のオリジンが含まれない場合、ブラウザは `ネットワークエラー` を発生させる。

`ネットワークエラー` は ステータス、ステータスメッセージ、ヘッダリスト、ボディ等がすべて空になっており、JavaScriptからはエラーになった理由を知ることができない。

---

[Fetch Standard （日本語訳）](https://triple-underscore.github.io/Fetch-ja.html#concept-network-error) の、4.3. HTTP fetch より、

> IF［ リクエスト のレスポンス tainting ＝ "cors" ］∧［ CORS 検査( リクエスト, レスポンス ) ＝ 失敗 ］ ：
>   RETURN ネットワークエラー

> ネットワークエラーは，常に次をすべて満たすようにされる：
>
> - ステータス ＝ 0
> - ステータスメッセージ ＝ 空バイト列
> - ヘッダリストは空である
> - ボディ ＝ null

また、 [オリジン間リソース共有 (CORS) - HTTP | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS) より、

> CORS は様々なエラーで失敗することがありますが、セキュリティ上の理由から、エラーについて JavaScript から知ることができないよう定められています。コードからはエラーが発生したということしか分かりません。何が悪かったのかを具体的に知ることができる唯一の方法は、ブラウザーのコンソールで詳細を見ることです。

### 6

XMLHttpRequestを使ってクッキーを含んだリクエストを送信する方法

クライアントは、XMLHttpRequest Object の withCredentials フラグを true にした上でリクエストを行い、サーバーは `simple request` または `preflight request` に対して `Access-Control-Allow-Credentials: true` ヘッダーを返すようにする。

Fetchの場合は、 `{ credentials: "include" }` オプションを渡す。

## 課題2 (クイズ)

### クイズ1

fetchAPIでクッキーを含んだリクエストを送信するにはどのようなオプションを渡す必要がありますか？

<details><summary>回答例</summary>

`{ credentials: "include" }` オプションを渡す。
</details>

### クイズ2

Access-Control-Max-Ageヘッダーは何に使われるヘッダーでしょうか？

<details><summary>回答例</summary>

プリフライトリクエストへのレスポンスをキャッシュしてよい秒数を指示できる。このヘッダーがなかった場合、デフォルトでは5秒間キャッシュする。

---

[Fetch Standard （日本語訳）](https://triple-underscore.github.io/Fetch-ja.html#http-access-control-Max-age) より、

> ［ `Access-Control-Allow-Methods` ／ `Access-Control-Allow-Headers` ］ヘッダから供される情報をキャッシュできる期間 【 UA 側がキャッシュ内に保持してもよい最長の期間】 を秒数（デフォルトは 5 ）で指示する。

確かに、リクエストを連打したときはOPTIONSリクエストが送信されていなかった。
</details>

### クイズ3

Access-Control-Allow-Originヘッダには一つのオリジンしか指定することができません。ワイルドカードを使わずに、複数のオリジンを許可したい場合、どのようにしたら良いでしょうか？

<details><summary>回答例</summary>

サーバー上で、リクエストのOriginヘッダーを確認し、許可する場合にOriginヘッダーと同じオリジンをAccess-Control-Allow-Originヘッダーに含めてレスポンスする。

同時に、VaryレスポンスヘッダーにOriginを含めて、サーバーのレスポンスがOriginリクエストヘッダーによって変化することを伝える。

---

[Access-Control-Allow-Origin - HTTP | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) より、

> Access-Control-Allow-Origin の値で複数のオリジンに許可を限定するには、サーバー側で Origin リクエストヘッダーの値をチェックし、許可するオリジンのリストと比較して、 Origin の値がリスト中にあれば、 Access-Control-Allow-Origin の値に Origin と同じ値を設定してください。

> Access-Control-Allow-Origin の値が ("*" ワイルドカードではなく) 具体的なオリジンであるレスポンスをサーバーが送信する場合、レスポンスには Vary レスポンスヘッダーに Origin という値を設定して、 Origin リクエストヘッダーの値によって値が変わることをブラウザーに対して示してください。
</details>

## 課題3 (実装)

### 実行コマンド

```sh
yarn start
または
npm run start
```

### 説明

コマンドを実行すると、

- localhost:8000 (リクエスト送信元のサーバー)
- localhost:9000 (リクエスト受信用のAPIサーバー)
- localhost:9000 を ngrok で外部公開したもの (URLがコンソールに表示されます)

が立ち上がります。

localhost:8000にアクセスし、リクエストの種類を選択した上で `リクエストを送信` ボタンをクリックすると、 ngrok上の APIサーバーにリクエストが送信されます。

また、結果（レスポンスボディ）が画面上に表示されます。

### `preflight` が行われるかどうかの確認

APIサーバーはPOSTまたはOPTIONSリクエストを受け取ると、コンソールに `POST request recieved` または `OPTIONS request recieved` を表示します。

その他、Devtools等で確認してください。

### 補足

選択できるリクエストの種類は以下の2つです。

- シンプルなリクエスト (method: POST, Content-Type: application/x-www-form-urlencoded)
- シンプルではないリクエスト (シンプルなリクエストに `X-Test: hello` ヘッダーを追加)

また、APIサーバーは以下を許可するように設定してあります。

```text
"Access-Control-Allow-Origin": "http://localhost:8000"
"Access-Control-Allow-Methods": "POST"
"Access-Control-Allow-Headers": "X-Test"
```

## 課題4

### 1, 2

実行結果 (一部省略)

```sh
❯ curl -X POST -d "hoge=fugaaa" -H "X-Test:hello" -v "https://2ec30fd6fb85.ngrok.io"
Note: Unnecessary use of -X or --request, POST is already inferred.
*   Trying 3.17.7.232...
...
> POST / HTTP/2
> Host: 2ec30fd6fb85.ngrok.io
> User-Agent: curl/7.64.1
> Accept: */*
> X-Test:hello
> Content-Length: 11
> Content-Type: application/x-www-form-urlencoded
> 
* Connection state changed (MAX_CONCURRENT_STREAMS == 250)!
* We are completely uploaded and fine
< HTTP/2 200 
< access-control-allow-headers: X-Test
< access-control-allow-methods: POST
< access-control-allow-origin: http://localhost:8000
< content-type: application/json; charset=utf-8
< date: Tue, 19 Jan 2021 12:50:09 GMT
< etag: W/"40-6hyN4V4uqsc6fjicJl0hwqRm7rw"
< x-powered-by: Express
< content-length: 64
< 
* Connection #0 to host 2ec30fd6fb85.ngrok.io left intact
{"message":"POST request recieved","recieved":{"hoge":"fugaaa"}}* Closing connection 0

```

`preflight request` は送られておらず、レスポンスも取得できている。

### 3

CORS / Same-Origin Policy は WEBサイトのための仕様なので、curlには適用されない？

## メモ

- [CORSについてざっくり理解する - Qiita](https://qiita.com/eshow/items/e47e7214dc12f130f456)
  - わかりやすい
- [fetchのmodeについて - Qiita](https://qiita.com/ryokkkke/items/79f1d338e141d4b7201b)
  - fetchのmodeのデフォルトはcors
- Originで確認するなら手動で変えちゃえばいい？
  - fetchの仕様に禁止ヘッダー名があった。
  - `Origin` , `Access-Control-Request-Headers` , `Access-Control-Request-Method` 等
