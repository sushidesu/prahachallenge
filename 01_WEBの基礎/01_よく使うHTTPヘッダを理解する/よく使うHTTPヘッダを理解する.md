# よく使うHTTPヘッダを理解する

## 課題１（質問）

各ヘッダの意味と役割を説明する。

### Host

リクエストが送信される先のサーバーのホスト名（ドメイン名）とポート番号を指定する。必須のヘッダー。

* [Host - HTTP | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Host)

### Content-Type

リクエスト／レスポンスの際に送られたデータがどのような種類のものであるかを伝える。

データの種類には、 `text/css` , `image/jpeg` , `application/json` などがある。

* [Content-Type - HTTP | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Content-Type)
* [MIME タイプ (IANA メディアタイプ) - HTTP | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Basics_of_HTTP/MIME_types)

---

通常、ブラウザーはファイル拡張子ではなく MIME タイプを見るため、サーバーは正しい MIME タイプを Content-Type ヘッダーで送信することが重要。CSSが読み込まれなかったり、ダウンロードファイルが誤って扱われたりすることがある。

ただし、MIME タイプが無い、あるいは間違っている場合にブラウザはリソースを確認して正しい MIME タイプを推測する。（MIMEスニッフィングという）MIMEスニッフィングはブラウザによって異なる方法で行われ、例えばSafariはURLの拡張子を確認する。

``` text
とは言っても最近のサーバーなら拡張子に対して適切なContent-Typeヘッダーを追加してくれてそう?
```

### User-Agent

サーバーや `ネットワークピア` が、リクエストしているユーザーのアプリケーション、OS、ベンダーや、ユーザーエージェントのバージョンを識別するためのもの。

``` text
ネットワークピアとは？
プロキシのこと？クライアント - サーバー間にある中継機器のこと？
```

* [User-Agent - HTTP | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/User-Agent)

### Accept

クライアントが理解できるコンテンツタイプを MIME タイプでサーバーに伝える。

* [Accept - HTTP | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Accept)

### Referer

クライアントがどのURLから訪問しに来たのかを表す。

Refererを送信しない・制御する方法は以下のようなものがある。

* HTTPS -> HTTP に遷移する場合
* 参照していたリソースがローカルの "file" または "data" の URI の場合
* クライアントのブラウザがRefererヘッダを送信しないよう設定している場合
* `rel="noreferrer"`
* referrerpolicy 属性
* `<meta>` の referrer 属性
* Referrer-Policy ヘッダー

### Accept-Encoding

リクエストヘッダ。クライアントがどの圧縮アルゴリズムを理解できるかを示す。 `gzip` 、 `deflate` 等。

サーバー側が圧縮形式に対応している場合は、サーバーがコンテンツを圧縮し、 `Content-Encoding` ヘッダーによってどの圧縮アルゴリズムを使用しているかを伝える。

* [Accept-Encoding - HTTP | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Accept-Encoding)
* [Content-Encoding - HTTP | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Content-Encoding)

### Authorization

クライアントがサーバーから認証を受けるための情報を保持する。主な認証方法として、 `Basic認証` 、 `OAuthを使用した認証` がある。

* 認証(Authentication)：誰であるかを確認
* 認可(Authorization)：リソースへのアクセス権限を与える

に分類されるが、認証を持って認可したり、逆に認可があることで認証したりするので一緒になる場合が多い。

``` text
認証に使われるのにAuthorization(認可)なのはなぜ？
```

* [Authorization - HTTP | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Authorization)
* [HTTP 認証 - HTTP | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Authentication)

### Location

レスポンスヘッダー。リダイレクト先の URL を示す。3xx (リダイレクト) または 201 (created) ステータスレスポンスとともに返す必要がある。

* [Location - HTTP | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Location)

---

### refererについて

target="_blank"と一緒に rel=noreferrerを設定するべき理由

#### 1. window.opener APIを悪用されてしまう恐れがあるから

window.opener APIを使うと遷移後のページから遷移元のページを操作できる。

例えば、 `target="_blank"` で開いたページに

``` js
window.opener.location = "https://danger.example.com"
```

が仕込まれていると、新しいタブの裏で別のページに移動してしまう。

`rel="noreferrer"` が設定されている場合、 `window.opener = null` となるため、上記の現象は起こらなくなる。

#### 2. 遷移先にURLを知られてしまうから

`target="_blank"` 特有の問題ではないが、例えば遷移元のページが公開したく無いURLだった場合、遷移先のページにRefererヘッダによってURLが送信されてしまう。

`rel="noreferrer"` が設定されているリンクから遷移したページには、Referヘッダは付与されないため、秘密のURLが漏れる心配は無い。

* [<a\>: The Anchor element - HTML: HyperText Markup Language | MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a)
* [HTML 本当は怖い target="_blank" 。rel="noopener" ってなに？ - かもメモ](https://chaika.hatenablog.com/entry/2018/12/06/110000)

---

見たことがある対処法として `noreferrer` のほかに `noopener` 、 `nofollow` の片方、もしくは両方をつけるというのがある。

実際はどれが必要なのか気になったので調べる。

#### そもそも、 `rel` 属性とは

`rel` 属性はリンク先と現在のドキュメントとの関係を表す。

* [HTML attribute: rel - HTML: HyperText Markup Language | MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel)

#### `noreferrer`

* Refererヘッダを送信しない
* noopenerも指定されているかのように振る舞う

[Link types: noreferrer - HTML: HyperText Markup Language | MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/noreferrer)

#### `noopener`

新しいページからの元ののドキュメントへのアクセスを許可せずにリンクを開く。( `window.opener = null` にする)

* [Link types: noopener - HTML: HyperText Markup Language | MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/noopener)
* [Link types - HTML: HyperText Markup Language | MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types)

#### `nofollow`

検索エンジンにリンク先と無関係であることを伝える。Googleはリンク先のページをサイトからクロールしない。信頼できないコンテンツ・ユーザー投稿に含まれるリンクなどに指定する。

*検索エンジンに対する指示のため、なにかを防止する効果は無い。*

#### 結局どの属性をつければ良いか

`rel="noreferrer"` または `rel="noreferrer nofollow"`

* noreferrer
  + Refererヘッダーが送信されない
  + `window.openner=null`になる(noopenerと同等)
  + noopenerよりブラウザの対応範囲が広い
* nofollow
  + 検索エンジンにリンク先と無関係であることを伝える
  + SEO評価を渡さない？

* [noopener と noreferrer の整理、結局どっちを使えば良いのか](https://blog.ojisan.io/noreferrer-noopener)
  + ずばり同じ内容のブログがあった（ある程度書いてから気づいた）

---

### 追加すべきHTTPヘッダ

- 同じオリジンのときはrefererの情報をすべて送信
- 別オリジンのときはオリジン情報のみをrefererとして送信する

``` text
Referrer-Policy: origin-when-cross-origin
```

オリジン： URLのうちの、プロトコル(https://)、ドメイン名(hoge.example.com)、ポート番号(:8080)

オリジンが一致する場合、オリジン・パス・クエリ文字列(つまりURL全て)を送信し、一致しない場合オリジンのみを送信する設定。

## 課題２（クイズ）

### HTTPヘッダーに関するクイズを3問、作成してください

> 例：「User-agentを使って、ユーザがモバイル端末を使用していることを判定しようとした場合、どのような誤検知や問題が想定されるでしょうか？」

回答：

User-Agentは簡単に変更でき、偽装している端末があった場合正しく検出できません。また、単なる文字列のため予期しない端末が誤検知される可能性もあります。

モバイル端末・非モバイル端末にはさまざまな種類があり、バージョンによって機能も常に変化していくため、User-Agentの判定を使用して小さい画面であることやタッチ操作であることを検出しようとした場合、全ての端末に当てはまらない可能性があります。例えば大きな画面のモバイル端末では、表示が崩れる問題が想定されます。

* [ユーザーエージェント文字列を用いたブラウザーの判定 - HTTP | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Browser_detection_using_the_user_agent)

---

#### クイズ1

Referrer-Policyヘッダーを設定しなかった場合、デフォルトではどのような場合にreferrer情報が送信されますか？

<details><summary>回答</summary><div>

Referrer-Policyの既定値は `no-referrer-when-downgrade` 。これはプロトコルのセキュリティ水準が同一か改善される場合はreferrerを送信し、低下する場合は送信しないという設定。

* HTTP -> HTTP, HTTPS -> HTTPS 送信
* HTTP -> HTTPS 送信
* HTTPS -> HTTP 送信しない

ブラウザーはより厳格な値である `strict-origin-when-cross-origin` を規定値にしたいらしい。
</div></details>

#### クイズ2

img要素にはrel="noreferrer"が使用できません。img要素でreferrer情報を送信したくない場合、どうすればよいでしょうか？

<details><summary>回答</summary><div>

同じページに `<meta name="referrer" content="noreferrer">` を設置する or `referrerpolicy="noreferrer"` を使用する
</div></details>

#### クイズ3

「 `<meta name="referrer" content="unsafe-url">` 」が設定されているページで、「 `<a href="~~~" rel="noreferrer">...</a>` 」から遷移した場合、Refererは送信されますか？されませんか？

<details><summary>回答</summary><div>

`rel="noreferrer"` が優先されるため、送信されない。

優先順位があり、高い順に以下のようになっている。

> 1. `rel=noreferrer`
> 1. referrerpolicy 属性
> 1. `<meta>` の referrer 属性
> 1. HTTP の Referrer-Policy ヘッダ

* [Referrer-Policy によるリファラ制御 | blog.jxck.io](https://blog.jxck.io/entries/2018-10-08/referrer-policy.html)
* [HTML Standard](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#referrer-policy-attribute)

</div></details>

## 参考／その他

* [改めてHTTPを学ぶ - Qiita](https://qiita.com/ayacai115/items/cc33c1f1cfe57c3f1d10)
  + Hyper TextのHyperは複数の文章を相互に参照できるという仕組みから文章(Text)を超える(Hyper)が語源。
* [HTTP ヘッダー - HTTP | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers)
  + HTTPヘッダーとは、クライアントやサーバーがHTTPリクエストやレスポンスで追加の情報を渡すためのもの。
  + `X-`接頭辞は独自のヘッダーを表す接頭辞として使用されていたが、非標準のフィールドが標準になったときに不便なため、2012年に非推奨になった。
* [HTML Standard](https://html.spec.whatwg.org/multipage/browsers.html)
  + ブラウジングコンテキストという概念があった
