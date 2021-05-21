# XMLHttpRequestについて理解する

## 課題1 (質問)

### 1

XMLHttpRequestとは何か？通常のHTTPリクエストとの違いをわかりやすく説明

XHRとは、画面の更新を伴わないHTTPリクエストを送ることができるオブジェクトである。ページが読み込まれた後で、バックグラウンドでサーバーからデータを受信したり、送信したりすることができる。

> AJAX is a developer's dream, because you can:
> 
> Update a web page without reloading the page
> Request data from a server - after the page has loaded
> Receive data from a server - after the page has loaded
> Send data to a server - in the background

### 2

`example.com` から `api.example.com` への XMLHttpRequestを使ったリクエストにクッキーが付与されないのはなぜか

- `XHR.withCredentials` プロパティを `true` に設定して、クッキーが送信されるようにする
- (受け取るサーバー側で、 `Access-Control-Allow-Credentials: true` ヘッダーを返す)
- (受け取るサーバー側が、 `Access-Control-Allow-Origin: *` になっていないかを確認する)

```js
const xhr = new XMLHttpRequest();           // 再代入されないことを明示するために const で宣言する
xhr.open('GET', 'http://api.example.com/'); // 第3引数は デフォルトで true のため必要なし
xhr.withCredentials = true                  // クッキーを送信するためのオプション
xhr.send();                                 // send() の引数は GET メソッドの場合無視されるため必要なし
```

### 3

`No 'Access-Control-Allow-Origin' header is present on the requested resource` でリクエストが送られない、どうしたら良いか？

異なるオリジン間の通信は `Same-Origin Policy` によって制限されていて、通信するためにはクライアント・サーバーの両方に設定が必要。

今回は、 `Access-Control-Allow-Origin ヘッダーが無いよ` と言われているので、APIサーバー (`api.example.com`) からのレスポンスに `Access-Control-Allow-Origin: example.com` ヘッダーを追加することでCORSを有効にできる。
