# curlとpostmanに慣れる

## curl

### 問題1

回答
```sh
curl -X GET -H "X-Test:hello" "https://httpbin.org/headers"
or
curl -H "X-Test:hello" "https://httpbin.org/headers"
```

#### -X, (--request)

メソッドを指定するオプション。デフォルトは`GET`。

#### -H, (--header)

追加のヘッダーを指定するオプション。複数指定可能。  
内部ヘッダーと同じ名前のヘッダーがある場合は、こっちの指定が優先される。

`[Name]:`で内部ヘッダーの削除もできる。空白の値を送信したい場合は、`[Name];`のようにする。

---

<details><summary>補足</summary>

自分の環境(httpbin.orgに直接リクエスト)では以下のようなレスポンスが得られた。

```sh
{
  "headers": {
    "Accept": "*/*", 
    "Host": "httpbin.org", 
    "User-Agent": "curl/7.64.1", 
    "X-Amzn-Trace-Id": "Root=1-5fed8ee7-070240070b2601f84d41bde8", 
    "X-Test": "hello"
  }
}
```

#### `X-Amzn-Trace-Id`とは？

[X-Amzn-Trace-Id を使用して Application Load Balancer リクエストをトレースする](https://aws.amazon.com/jp/premiumsupport/knowledge-center/trace-elb-x-amzn-trace-id/)

> Elastic Load Balancing で Application Load Balancer によってリクエストが処理されると、トレース情報が X-Amzn-Trace-Id ヘッダーに追加されます。

間にロードバランサーが挟まっているから付与されている？  
試しに`-H "X-Amzn-Trace-Id:"`で削除しようとしても消えなかったのでそうっぽい。
</details>

### 問題2

回答
```sh
curl -X POST -H "Content-Type:application/json" -d '{"name": "hoge"}' "https://httpbin.org/post"
```

#### -d, (--data, --data-raw)

POSTリクエストのデータを送るためのオプション。デフォルトで`Content-Type: application/x-www-form-urlencoded`ヘッダーが追加される。

---

<details><summary>補足</summary>

`-F`, `--form` オプションは、ユーザーがformへ入力して、submitしたときのように`Content-Type: multipart/form-data`ヘッダーを使用してデータを送信するオプション。

`[name]=[value]`のような形でデータを渡す。

- `application/json`
  - JSONでデータを送信する。複雑な構造のデータを送信するのに適している。
- `application/x-www-form-urlencoded`
  - `field1=value1&field2=value2`の形式でデータを送信する。シンプル。
  - 文字がエンコードされるため、バイナリデータを送信するのに不向き。
- `multipart/form-data`
  - HTMLフォームのデータを送信する際に使用する。ファイルも送信できる。

---

- [POST - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST)
- [MIME types (IANA media types) - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)
- [php - x-www-form-urlencoded Vs json HTTP POST - Stack Overflow](https://stackoverflow.com/questions/11281117/x-www-form-urlencoded-vs-json-http-post)
</details>

### 問題3

回答
```sh
curl -X POST -H "Content-Type:application/json" -d '{"userA": {"name": "hoge", "age": 29}}' "https://httpbin.org/post"
```

レスポンス(一部略)
```sh
{
  "args": {}, 
  "data": "{\"userA\": {\"name\": \"hoge\", \"age\": 29}}", 
  "files": {}, 
  "form": {}, 
  "headers": {
    "Accept": "*/*", 
    "Content-Length": "38", 
    "Content-Type": "application/json", 
    "Host": "httpbin.org", 
    "User-Agent": "curl/7.64.1", 
    "X-Amzn-Trace-Id": "Root=1-5feda4e1-32180b4d71cc149d7ff723a8"
  }, 
  "json": {
    "userA": {
      "age": 29, 
      "name": "hoge"
    }
  }, 
  "url": "https://httpbin.org/post"
}
```

### 問題4

回答
```sh
curl -X POST -H "Content-Type:application/x-www-form-urlencoded"  -d '{"name": "hoge"}' "https://httpbin.org/post"
or
curl -X POST -d '{"name": "hoge"}' "https://httpbin.org/post"
```

レスポンス(一部略)
```sh
{
  "args": {}, 
  "data": "", 
  "files": {}, 
  "form": {
    "{\"name\": \"hoge\"}": ""
  }, 
  "headers": {
    "Accept": "*/*", 
    "Content-Length": "16", 
    "Content-Type": "application/x-www-form-urlencoded", 
    "Host": "httpbin.org", 
    "User-Agent": "curl/7.64.1", 
    "X-Amzn-Trace-Id": "Root=1-5ff14006-5ad9550c63325e1a1102619d"
  }, 
  "json": null, 
  "url": "https://httpbin.org/post"
}

```

## postman

回答: https://documenter.getpostman.com/view/14035167/TVt2c474

<details><summary>感想</summary>

- postman回答の公開は[PrAhaChallenge/curl-postman.md at main · kai815/PrAhaChallenge](https://github.com/kai815/PrAhaChallenge/blob/main/web-basis/curl-postman.md)を参考にしました
- インストールの時に`brew cask`初めて使ったけど便利だった。
- postman、ヘッダーの補完もしてくれる（便利）
- body用のエディターもある（JSON書きやすい）
</details>

## クイズ

### curl

#### クイズ1

`https://httpbin.org/anything`からステータスコード400が返ってくるようなcurlコマンドを記述してください。

<details><summary>回答例</summary>

```sh
curl -H "Host:" "https://httpbin.org/anything"
```

`"[ヘッダー名]:"`とすることでヘッダー自体を削除できる。  
必須のヘッダーであるHostヘッダーを削除することでステータスコード400を発生させた。

</details>

#### クイズ2

`https://httpbin.org/cookies`から
```sh
{
  "cookies": {
    "hoge": "fuga", 
    "mugi": "kome"
  }
}
```

が返ってくるようなcurlコマンドを記述してください。

<details><summary>回答例</summary>

```sh
curl -b "hoge=fuga;mugi=kome" "https://httpbin.org/cookies"
or
curl --cookie "hoge=fuga;mugi=kome" "https://httpbin.org/cookies"
or
curl -H "Cookie:hoge=fuga;mugi=kome" "https://httpbin.org/cookies"
```

`-b`, `--cookie`オプションでクッキーを送信できる。複数送信する場合は`;`で区切る。

</details>

#### クイズ3

`https://httpbin.org/cookies/set?hoge=123456789&fuga=202101013734649`にリクエストを送信して

```sh
{
  "cookies": {
    "fuga": "202101013734649", 
    "hoge": "123456789"
  }
}
```

のような出力を得るcurlコマンドを記述してください。

<details><summary>回答例</summary>

```sh
curl -c "" -L "https://httpbin.org/cookies/set?hoge=123456789&fuga=202101013734649"
or
curl -b "" -L "https://httpbin.org/cookies/set?hoge=123456789&fuga=202101013734649"
```

`https://httpbin.org/cookies/set?[name]=[value]`は`[name]=[value]`クッキーをセットした後に、`https://httpbin.org/cookies`にリダイレクトする。

なので、受け取ったクッキーを保存してリダイレクト先に送信したい。

---

`-L`, `--location`オプションを使用すると、リダイレクト先でもリクエストを送ってくれる。

`-c`, `--cookie-jar` オプションを使用するとCookieエンジンが有効になり、受け取ったクッキーがcurlに保存され、処理が終わった後に指定されたファイルにもクッキーが保存される。

Cookieエンジンが有効になると、リダイレクト先や複数のURLで保存したクッキーを送信してくれるようになる。`--cookie`オプション使用時にも有効になる。

</details>

### postman

#### クイズ1

Postmanでは変数を設定することができ、URLやQuery Params、Headers等様々な箇所で設定した変数を使用できます。

`https://httpbin.org`を変数に格納し、`https://httpbin.org/anything`にリクエストを送信してください。

<details><summary>回答例</summary>

Collection variablesに `base_url=https://httpbin.org`を追加して、  
`{{base_url}}/anything`にリクエストを送信する。
</details>

#### クイズ2

Postmanではリクエストの前後でJavaScriptコードを実行することができます。動的なリクエストを作成したり、リクエストの結果をテストするのに便利です。

`https://httpbin.org/status/200`からステータスコード200が返ってくることを確認するテストを記述してください。

<details><summary>回答例(テストコードのみ)</summary>

```js
pm.test("Status code is 200", () => {
    pm.response.to.have.status(200)
})
```
</details>

#### クイズ3

`https://httpbin.org/base64/{value}`から、

```sh
PrAha Challenge is Awesome!!!
```

が返ってくるようなリクエストを作成してください。

<details><summary>回答例</summary>

`Pre-request Script`に以下を記述。

```js
pm.collectionVariables.set("text", btoa("PrAha Challenge is Awesome!!!"))
```

その後、`https://httpbin.org/base64/{{text}}`にリクエストを送信する。

</details>
