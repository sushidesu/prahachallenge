# CDNについて理解して使ってみよう

## 課題1

### CDNとは？

CDNとは、Contents Delivery Networkの略で、コンテンツを効率よく配信するためのネットワークのことを指す。

> コンテンツ配信ネットワーク（CDN）とは、インターネットコンテンツを高速配信するために連携する地理的に分散されたサーバーのグループを指します。
>
> [What is a CDN? | How do CDNs work? | Cloudflare](https://www.cloudflare.com/ja-jp/learning/cdn/what-is-a-cdn/)

Webホスティングと違い

- 直接コンテンツを持たないという点で、Webホスティングとは異なる
- ネットワークEdgeにコンテンツをキャッシュする
  - ネットワークEdge
    - 地理的にデバイスに近い場所にあるネットワークやサーバーのこと
    - 近いほうが通信量を抑えられる -> 速い

> CDNはコンテンツをホストせず、必要とされる適切なWebホスティングサービスの代わりにはなりませんが、ネットワーク Edgeでコンテンツをキャッシュするために役立ち、それがWebサイトのパフォーマンスを向上させています。
>
> [What is a CDN? | How do CDNs work? | Cloudflare](https://www.cloudflare.com/ja-jp/learning/cdn/what-is-a-cdn/)

利点

- ロード時間の短縮
  - ユーザーは近い場所にあるCDNサーバーと通信するので、速い
- キャッシュにより帯域幅を減らす
  - CDNサーバーがコンテンツをキャッシュするのでオリジンサーバーの通信の量が減る
- 分散による可用性・冗長性の向上
  - 分散したCDNサーバーによってコンテンツを配信するので、大量のトラフィックやハードウェア障害に強い
- セキュリティを向上させる
  - DDoSを軽減する仕組みがある

欠点

- リアルタイム性が損なわれる
  - キャッシュの更新の頻度によっては古い情報が表示されてしまう
- キャッシュ事故の発生
  - キャッシュ設定のミス、CDNサービスの設定のミスによりキャッシュしたくないコンテンツがキャッシュされてしまう可能性がある

参考

- [What is a CDN? | How do CDNs work? | Cloudflare](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/)
- [【図解】CDNとは？仕組みと技術の基礎知識 - カゴヤのサーバー研究室](https://www.kagoya.jp/howto/it-glossary/web/cdn/)
- [CDN切り替え作業における、Web版メルカリの個人情報流出の原因につきまして | メルカリエンジニアリング](https://engineering.mercari.com/blog/entry/2017-06-22-204500/)
- [「LINE」タイムラインにおけるシステム不具合に関するお知らせ | LINE Corporation | セキュリティ＆プライバシー](https://linecorp.com/ja/security/article/169)

### 1

なぜCDNを使うとパフォーマンス改善になるのか？

### 2

- オリジンサーバー
- エッジサーバー

### 3

- ブラウザキャッシュ
- CDN

〜〜〜のときはCDNを使ったほうが良い。

## 課題2

### 1

- 遠いリージョンにS3に画像保存
- CloudFrontとS3を接続

リクエスト/レスポンス素行度を比較

## その他

- キャッシュのパージのやり方
- それぞれの違い
  - AWS (CloudFront)
  - GCP (Cloud CDN)
  - Fastly
- それぞれの使い方
- CDNは基本画像ファイルに使う？
  - キャッシュによるミスが怖いので
