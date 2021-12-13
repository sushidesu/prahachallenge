# CDNについて理解して使ってみよう

## 課題1

### CDNとは？

CDNとは、Contents Delivery Networkの略で、コンテンツを効率よく配信するためのネットワークのことを指す。

> コンテンツ配信ネットワーク（CDN）とは、インターネットコンテンツを高速配信するために連携する地理的に分散されたサーバーのグループを指します。
>
> [What is a CDN? | How do CDNs work? | Cloudflare](https://www.cloudflare.com/ja-jp/learning/cdn/what-is-a-cdn/)

WEBホスティングとの違い

参考

- [What is a CDN? | How do CDNs work? | Cloudflare](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/)
- [【図解】CDNとは？仕組みと技術の基礎知識 - カゴヤのサーバー研究室](https://www.kagoya.jp/howto/it-glossary/web/cdn/)

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
