# リクエストをパースするWEBサーバを作ってみる

## 課題1 (実装)

### コマンドの実行結果

{text: hello world}が返ってくるはず

```sh
❯ curl localhost:8000 -H "Content-Type: application/json"
{"text":"hello world"}
```

{name: hoge}が返ってくるはず

```sh
❯ curl localhost:8000 -d '{"name": "hoge"}' -H "Content-Type: application/json"
{"name":"hoge"}
```


HTTPステータス400、エラーが発生するはず
```sh
❯ curl localhost:8000 -i -d '{"name": "hoge"}'
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 33
ETag: W/"21-qJ9Qf3p4WOLYLM1G/BuqfizXOdo"
Date: Tue, 05 Jan 2021 09:22:30 GMT
Connection: keep-alive
Keep-Alive: timeout=5

400 Error: Use `application/json`
```

### なぜ`request.body`の内部は「ストリーム」なのか？

[Stream | Node.js v15.5.1 Documentation](https://nodejs.org/api/stream.html#stream_stream)

> Node.jsが提供するストリームオブジェクトはたくさんあります。例えば、HTTPサーバへのリクエストとprocess.stdoutはどちらもストリームインスタンスです。(DeepL翻訳)

Node.jsにはStream APIというものがあり、サーバーへのリクエストにも使用されている。よって、課題文中の「ストリーム」とはNode.jsのStream APIのことだと考えられる。

[Understanding Streams in Node.js - NodeSource](https://nodesource.com/blog/understanding-streams-in-nodejs/) によると、

ストリームとは小さく分けたデータの塊を一つずつ読み込み、全てをメモリに保持することなく処理する方法。（YouTubeのストリーミング再生と同じ）

> ストリームは基本的に他のデータ処理方法と比較して、大きく分けて2つの利点があります。
> 1. メモリ効率：処理する前に大量のデータをメモリにロードする必要がありません。
> 1. 時間効率：ペイロード全体が送信されるまで処理を待たなければならないのではなく、データを入手してすぐに処理を開始するのにかかる時間が大幅に短縮されます。 (DeepL翻訳)

つまり、なぜストリームなのか？

1. 大量のデータをメモリ効率よく処理できるから
1. データ全ての読み込みを待たずに処理を開始できるため、処理時間の短縮になるから

## 課題2 (質問)

- `application/json`
  - JSONでデータを送信する。複雑な構造のデータを送信するのに適している。
- `application/x-www-form-urlencoded`
  - `field1=value1&field2=value2`の形式でデータを送信する。シンプル。
  - 文字がエンコードされるため、バイナリデータを送信するのに不向き。

`application/json`は、入れ子になっている等、複雑なデータを送信するのに適している。`application/x-www-form-urlencoded`は、ちょっとしたデータを送るときに使う？

[http - application/x-www-form-urlencoded or multipart/form-data? - Stack Overflow](https://stackoverflow.com/questions/4007969/application-x-www-form-urlencoded-or-multipart-form-data)
