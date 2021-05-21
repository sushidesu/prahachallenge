# サードパーティクッキーについて理解する

## 課題1 (質問)

### 1

ユーザーから見て、現在訪問しているサイトとの間で送受信されるクッキーがファーストパーティークッキーで、それ以外のサイトと送受信されるクッキーがサードパーティークッキー。

1st party / 3rd party はドメイン名のみで区別し、ポートやプロトコルによっては区別しない。

### 2

- `shop.example.com` （通販サイト）で商品を見る
  - -> ページに埋め込まれたiframeから 広告配信用サーバーに `ad.example.com?page=ultraWideMonitor`のような形でリクエストが飛ぶ
  - -> 広告配信用サーバーでユーザーID発行し、そのIDをクッキーに保存させる (`Set-Coookie: ID=hogehoge`)
- その後、 `sns.example.co.jp` （SNSサイト）にアクセスする（同じく `ad.example.com` の広告が埋め込まれている）
  - -> 埋め込まれたiframeから `ad.example.com` にリクエストを送る際に、`Cookie: ID=hogehoge` が送信される
  - -> サーバーはクッキーを元に、ユーザーの情報を検索し、ウルトラワイドディスプレイの広告を返す
  - -> ウルトラワイドディスプレイの広告が iframe 上に表示される

[牧歌的 Cookie の終焉 | blog.jxck.io](https://blog.jxck.io/entries/2020-02-25/end-of-idyllic-cookie.html#analytics) がとても参考になりました。

### 3

サードパーティークッキーを生成するためには、サードパーティーなサイトにリクエストを送り、レスポンスとともに `Set-Cookie` ヘッダーを送信する必要がある。  
また、Chromeではバージョン84以降、 `Same-Site` 属性のないクッキーを `SameSite=Lax` として扱うため、`SameSite=None` および `Secure` 属性を付与しなければならない。


- `img`や`iframe`を埋め込む方法
  - `src`に指定したURLとクッキーをやりとりできる
- `<script src="~~">` を埋め込む方法
- `<script>~</script>` を埋め込む方法？
  - どうやってクッキーをやりとりするのかがわからない。XHRやfetchを使用する？
- リダイレクトによるSSO
  - 異なるサイトでログイン情報を共有したい時に、認証用の `auth.example.com` を用意して、各サイトからリダイレクトさせる
    - `a.com` にアクセスすると、認証用の `auth.example.com` にリダイレクト
    - `auth.example.com` でログインパスワードを入力し、クッキーを発行
    - その後、別のサイト (`b.com`) からアクセスした時、`auth.example.com` にリダイレクト & クッキーを送信して認証
    - 認証に成功したので、`auth.example.com` から `b.com` にトークン付きでリダイレクト
  - [牧歌的 Cookie の終焉 | blog.jxck.io](https://blog.jxck.io/entries/2020-02-25/end-of-idyllic-cookie.html#sso) で紹介されていた。
  - 1st partyなサイト上でクッキーが直接やりとりされるわけではないが、ユーザーがアクセスしたいサイト (`a.com`や`b.com`)からみて、`auth.example.com`は 3rd partyなので、やりとりされるCookieは 3rd party cookie となるらしい
- 他にもXHRやfetchでCORSを許可してクッキーを送信する方法がありそう？

### 4

[牧歌的 Cookie の終焉 | blog.jxck.io](https://blog.jxck.io/entries/2020-02-25/end-of-idyllic-cookie.html#tracking-prevention) より、

> いずれにせよ、 3rdPC から脱していくことは、ほぼすべてのブラウザで合意が取れており、こうした方法を使うと、結局 3rdPC 自体が、それがどういう使われ方をしているかに関わらずブロックされる。

- RFC 6265bis
  -  `Same-Site`のデフォルト値を`Lax`として定義している（Chrome以外のブラウザも対応していく？）
  - [Cookies: HTTP State Management Mechanism （日本語訳）](https://triple-underscore.github.io/http-cookie-ext-ja.html#attribute-samesite)
- Chrome
  - バージョン86以降、 `Same-Site` 属性のないクッキーを `SameSite=Lax` として扱う（`img`や`iframe`でクッキーを送受信できなくなる）
- Safari
  - ITP (Intelligent Tracking Prevention)
    - 機械学習を用いて、トラッキングに使用されていそうなクッキーを削除する機能
    - トラッキングに使用されていると判定されても、過去24時間以内に訪問したサイトのクッキーであれば、30日間クッキーが保持される（一時的に制限が緩和される）
  - [Intelligent Tracking Prevention | WebKit](https://webkit.org/blog/7675/intelligent-tracking-prevention/)
  - [ITPの概要と対策について | 株式会社マルジュ](https://www.maru.jp/itp/#:~:text=ITP%EF%BC%88Intelligent%20Tracking%20Prevention%EF%BC%89%E3%81%A8,%E3%83%88%E3%83%A9%E3%83%83%E3%82%AD%E3%83%B3%E3%82%B0%E3%81%AE%E6%8A%91%E6%AD%A2%E6%A9%9F%E8%83%BD%E3%81%A7%E3%81%99%E3%80%82&text=%E3%81%BE%E3%81%9F%E3%80%81Cookie%E3%81%A8%E3%81%AF%E3%80%81Web,%E4%BB%95%E7%B5%84%E3%81%BF%E3%81%AE%E4%B8%80%E3%81%A4%E3%81%A7%E3%81%99%E3%80%82)
  - [牧歌的 Cookie の終焉 | blog.jxck.io](https://blog.jxck.io/entries/2020-02-25/end-of-idyllic-cookie.html#tracking-prevention)
- FireFox
  - ブラックリスト方式で、許可しないサイトからのクッキーをブロックする。
  - [デスクトップ版 Firefox の強化型トラッキング防止 | Firefox ヘルプ](https://support.mozilla.org/ja/kb/enhanced-tracking-protection-firefox-desktop)
- Edge
  - FireFoxと同様に、ブラックリスト方式？
  - [Introducing tracking prevention, now available in Microsoft Edge preview builds - Microsoft Edge Blog](https://blogs.windows.com/msedgedev/2019/06/27/tracking-prevention-microsoft-edge-preview/)

### 5

ドメイン名で判断するため、ファーストパーティークッキー。

[SameSite cookies explained](https://web.dev/samesite-cookies-explained/#what-are-first-party-and-third-party-cookies) より、

> 現在のサイトのドメインに一致するクッキー、つまりブラウザのアドレスバーに表示されているクッキーをファーストパーティクッキーと呼びます。同様に、現在のサイト以外のドメインからのクッキーをサードパーティクッキーと呼びます。

[HTTP cookie - Wikipedia](https://en.wikipedia.org/wiki/HTTP_cookie#Third-party_cookie#Third-party_cookie) より、

> 通常、クッキーのドメイン属性は、ウェブブラウザのアドレスバーに表示されているドメインと一致します。これをファースト・パーティ・クッキーと呼びます。ただし、サードパーティクッキーは、アドレスバーに表示されているドメインとは異なるドメインに属します。(DeepL翻訳)

---

ちなみに、Same-Siteもドメイン名で判断する。

> オリジンではなくドメインで判断するので、注意する。例えばhttp://a.com/からhttps://a.com/mypageにリクエストが発生する場合は、プロトコルが違うのでオリジンは異なるが、ドメインはどちらもa.comなので、これはsame-siteになる。

[SameSite 属性を使った Cookie のセキュアな運用を考える - 30歳からのプログラミング](https://numb86-tech.hatenablog.com/entry/2020/01/26/112607)

## 課題2 (実装)

```sh
yarn start
または
npm run start
```

を実行すると、
- 3rd Party のサーバー (localhost:9000)
- 3rd Party を https 公開したURL (コンソールにでます)
- 1st Party のサーバー (localhost:8000)

が立ち上がります。

1st Party のサーバー (localhost:8000) に接続すると、DevTools等から、
1. HttpOnly属性が付与された
2. localhostのクッキーとXXXXX.ngrok.ioの*各種クッキーが確認できるはずです。

### 各種クッキー (`??` は `1st` または `3rd`)

| クッキーID                | 説明                                 |
| ------------------------- | ------------------------------------ |
| ??Party                   | 特に属性を指定しないクッキー         |
| ??PartySameSiteStrict     | `SameSite=Strict` のクッキー            |
| ??PartySameSiteLax        | `SameSite=Lax` のクッキー               |
| ??PartySameSiteNone       | `SameSite=None` のクッキー              |
| ??PartySameSiteSecureNone | `SameSite=None` かつ `Secure` のクッキー |

## その他

### ngrokを2つ立ち上げるとサードパーティクッキーにはならない？

[_questionsチャンネル](https://prahachallengeseason1.slack.com/archives/C01HY1BA5LG/p1610414707036200) に、

> サードパーティクッキーの設定に関する課題を補足します！こちらは
> localhostで動くサーバー
> ngrokで動くサーバー
> この2台が動いているような状態を想定しています！（ngrokを2台動かすと、ドメイン自体は同じで、サブドメインのみ違うので、サードパーティクッキーにはならない）

とあったが、サブドメインのみ違ったとしても、(完全修飾)ドメイン名が違うためサードパーティークッキーとして扱われるのではないか？

### サードパーティークッキーとは？

サードパーティークッキーかどうかの判定方法としては、以下が考えられる。

1. `SameSite=None` がない場合にクッキーがブロックされたら、それはサードパーティークッキー
1. (または) a -> b にリクエストする際に、SameSite=Strictのクッキーがbに送信されるなら、それは 1st Party Cookie
1. その他、1st Party のクッキーとの違いを見る

が、これはサードパーティークッキーかどうかではなく、cross-siteなリクエストかどうかを判定している。なので、サードパーティークッキーの定義によっては、この判定方法は正しくない可能性がある。

サードパーティークッキーについての厳密な定義が見つからないが、RFC6265bis（を翻訳したサイト）には以下のような記述があり、

> とりわけ厄介なものは、“サードパーティ（ third-party ）” クッキーと呼ばれるものである。 UA は、 HTML 文書をレンダーする際に，他のサーバ（広告ネットワークなど）からのリソースをリクエストすることが多い。 これらのサードパーティサーバは、ユーザがサーバを直に訪問したことが一度もなくても，ユーザのトラッキングにクッキーを利用できる。 

**他のサーバ** とやりとりされるクッキーがサードパーティークッキーだと推測できる。

ドメイン名が途中まで一致しており、サブドメインのみが違ったとしても、それぞれは別のドメイン名であり、違うサーバと紐づいているはず。であるならば、サブドメインのみ違うサーバーとやりとりされるクッキーもまたサードパーティークッキーなのではないか？

### 検証

```sh
yarn start
または
npm run start
```

を実行すると、

- 第二サーバー (localhost:9000)
- 第二サーバー を https 公開したURL (コンソールにでます)
- 第一サーバー (localhost:8000)

が立ち上がるので、別のターミナルを立ち上げ、

```sh
ngrok http 8000
```

で第一サーバー (localhost:8000) も ngrok 上で公開し、URLにアクセスする。

#### Set-Cookieがブロックされるかどうか

- ○： ブロックされない（クッキーが保存される）
- ×： ブロックされる（クッキーは保存されない）

| localhost と ngrok | 第一サーバー | 第二サーバー | 
| --------------- | ------------ | ------------ | 
| SameSite=Lax    | ○           | ×            | 
| SameSite=Strict | ○           | ×            | 
| SameSite=None   | ×           | ○           | 

| ngrok × 2 | 第一サーバー | 第二サーバー | 
| --------------- | ------------ | ------------ | 
| SameSite=Lax    | ○           | ×            | 
| SameSite=Strict | ○           | ×            | 
| SameSite=None   | ○           | ○           | 


#### Cookieヘッダーによりクッキーが送信されるか

- 各種クッキーがブラウザに保存されている状態で、リンククリックによりクッキーが送信されるかどうかを確認
- 第一サーバーのaタグから第二サーバーに遷移して検証

| localhost と ngrok | 送信されたか | 
| --------------- | ------------ | 
| SameSite=Lax    | ○           | 
| SameSite=Strict | ×            | 
| SameSite=None   | ○           | 

| ngrok × 2 | 送信されたか | 
| --------------- | ------------ | 
| SameSite=Lax    | ○           | 
| SameSite=Strict | ×            | 
| SameSite=None   | ○           | 

### 結論

ngrokを2台立ち上げた時も、1台だけ立ち上げた時とほとんど同様の挙動になった（はず）。（localhostではSecure属性のついたクッキーがブロックされる）

まだドラフト段階で今後変わる可能性がありそう？なのであまり厳密に調査する必要はないのかもしれない。

---

### メモ（同一サイト／クロスサイトなリクエスト）

[Cookies: HTTP State Management Mechanism （日本語訳）](https://triple-underscore.github.io/http-cookie-ext-ja.html)より、

> 所与の ( オリジン A ,オリジン B ) は、次のいずれかを満たすならば， 同一サイト （ same-site ）であると見なされる：
>
> - ［ A, B ともにグローバルに一意な識別子である ］∧［ A ＝ B ］
> - ［ A, B ともに ( スキーム, ホスト, ポート ) が成す組である【成分組オリジンである】 ］∧［ A のスキーム ＝ B のスキーム ］∧［ A, B は、次のいずれかを満たす ］：
>   - ［ A のホスト ＝ B のホスト ］∧［ A のホストの登録可能なドメイン ＝ null ］
>   - ［ A のホストの登録可能なドメイン ＝ B のホストの登録可能なドメイン ≠ null ］
>
>【 HTML による同じサイト（ same site ）の定義と一致する。 】
>
> 注記： オリジンのポート成分は、考慮されない。

ここでの `ホスト` は、完全修飾ドメイン名のことを指すと思われる。

- ホストの登録可能なドメイン = nullな状況とは？
- `登録可能なドメイン` と `スキーム` が等しいならsame-siteになる？
  - `https://aaa.example.com` と `https://bbb.example.com`
- ドメイン名だけではなく、スキームでも区別される？

### メモ（`登録可能なドメイン`）

> ドメインの 登録可能なドメイン は、ドメインの公共接尾辞に，その直前にあるラベルを足したものである。
> 
> 例えば， https://www.site.example に対しては、その［ 公共接尾辞は example, 登録可能なドメインは site.example ］になる。 UA は、可能なときは，当日最新の公共接尾辞リストを利用するべきである — Mozilla プロジェクト により [PSL] にて保守されているそれなど。

> ドメインの 公共接尾辞 （ public suffix ）とは、ドメインを成す部位のうち — 例： com ／ co.uk ／ pvt.k12.wy.us など — 公共レジストリにより制御されるものを指す。
