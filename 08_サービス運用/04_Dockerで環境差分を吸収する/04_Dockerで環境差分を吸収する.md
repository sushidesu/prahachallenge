# Dockerで環境差分を吸収する

## 課題1 (質問)

### Dockerとは

Dockerとは、OSレベルの仮想化を使用してコンテナーと呼ばれるパッケージでソフトウェアを配信するPaaSの総称。

> Docker is a set of platform as a service (PaaS) products that use OS-level virtualization to deliver software in packages called containers.
>
> [Docker (software) - Wikipedia](https://en.wikipedia.org/wiki/Docker_(software))

アプリケーションとインフラを分離でき、インフラをアプリケーションと同じ方法で管理できるため、開発の速度が向上する。

> Docker is an open platform for developing, shipping, and running applications. Docker enables you to separate your applications from your infrastructure so you can deliver software quickly. With Docker, you can manage your infrastructure in the same ways you manage your applications. By taking advantage of Docker’s methodologies for shipping, testing, and deploying code quickly, you can significantly reduce the delay between writing code and running it in production.
>
> [Docker overview | Docker Documentation](https://docs.docker.com/get-started/overview/)

#### イメージ

Dockerコンテナを作成するための手順が記載された読み取り専用のテンプレートのこと。自分で一から作成することもできるし、他人が作成したイメージを使用することもできる。既存のイメージをもとにカスタマイズして構築されることが多い。

> An image is a read-only template with instructions for creating a Docker container. 
>
> [Docker overview | Docker Documentation](https://docs.docker.com/get-started/overview/)

Dockerfileに記述された各命令は `レイヤー` としてビルドされる、Dockerfileに変更があった場合、変更されたレイヤーのみがビルドされる。(そのため、軽量で速い)

#### コンテナ

イメージを実行可能な形でインスタンス化したもの。CLIやAPIを介して作成/実行/停止/削除などができる。コンテナを一つ以上のネットワークに接続したり、ストレージを接続したりできる。コンテナの現在の状態をもとに、新たなイメージを作成することもできる。

> A container is a runnable instance of an image.
>
> [Docker overview | Docker Documentation](https://docs.docker.com/get-started/overview/)

コンテナは、イメージとコンテナーを作成/起動時に渡すオプションによって定義される。コンテナが削除されると、永続ストレージに保存されていない変更は破棄される。

> A container is defined by its image as well as any configuration options you provide to it when you create or start it. When a container is removed, any changes to its state that are not stored in persistent storage disappear.
>
> [Docker overview | Docker Documentation](https://docs.docker.com/get-started/overview/)

#### ベースイメージ

親イメージを持たないイメージのこと。Dockerfileで `FROM scratch` と記載することでベースイメージとして作成できる。

> a base image has no parent image specified in its dockerfile. it is created using a dockerfile with the from scratch directive.
>
> [Glossary | Docker Documentation](https://docs.docker.com/glossary/#base-image)

イメージを完全に制御できるが、高度なことをする場合が対象。

> In simple terms, a base image is an empty first layer, which allows you to build your Docker images from scratch. Base images give you full control over the contents of images, but are generally intended for more advanced Docker users.
>
> [A Beginner’s Guide to Understanding and Building Docker Images](https://jfrog.com/knowledge-base/a-beginners-guide-to-understanding-and-building-docker-images/)


#### ペアレントイメージ

イメージを作成するときに、元にするイメージのこと。FROM命名で指定する。

> イメージの 親イメージ とは、イメージの Dockerfile 中にある FROM 命令で指定したイメージです。以降に続く全てのコマンドは、この親イメージをベースにしています。Dockerfile で FROM scratch 命令を使うと、親イメージを持たず、 ベース・イメージ を作成します。
>
> [用語集 — Docker-docs-ja 19.03 ドキュメント](http://docs.docker.jp/v19.03/glossary.html#parent-image)

#### Dockerレジストリ

Dockerイメージを保存・配布できるサービス。

> The Registry is a stateless, highly scalable server side application that stores and lets you distribute Docker images.
>
> [Docker Registry | Docker Documentation](https://docs.docker.com/registry/)

[Docker Hub](https://hub.docker.com/) または `docker search` コマンドでアクセスできる。

#### ビルドコンテキスト

`docker build` する時の、カレントディレクトリ(とそこに含まれるファイル)のこと。現在のディレクトリ(子孫を含む)に含まれるすべてのファイルは、ビルドコンテキストとしてDockerデーモンに送信される。

> When you issue a docker build command, the current working directory is called the build context. By default, the Dockerfile is assumed to be located here, but you can specify a different location with the file flag (-f).
>
> [Best practices for writing Dockerfiles | Docker Documentation](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#understand-build-context)

イメージのビルドに不要なファイルを誤って含めると、ビルドコンテキストが大きくなり、イメージサイズが大きくなってしまうので注意が必要。

> Inadvertently including files that are not necessary for building an image results in a larger build context and larger image size. 
>
> [Best practices for writing Dockerfiles | Docker Documentation](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#understand-build-context)

#### マルチステージビルド

Dockerイメージのビルドを、複数ビルドに分割して実行する機能のこと。アプリケーションのビルド時には必要だが、実行環境では必要のないパッケージがある場合などに、ビルド用、実行環境用でそれぞれイメージを用意して必要なファイルだけをコピーできる。主に実行環境のイメージサイズを小さくするために行われる。

> multi stage buildの名前の通り、docker buildを複数のビルドに分割して実行できる。こうすると何がうれしいのかというと、アプリケーションの開発用ビルドの依存とランタイムの依存を分離できる。
>
> [Docker multi stage buildで変わるDockerfileの常識 - Qiita](https://qiita.com/minamijoyo/items/711704e85b45ff5d6405)

Dockerfile内で `FROM` を複数に分けて記述することができ、各部分はステージと呼ばれる。 `COPY --from=[ステージ] コピー元 コピー先` 他のステージのコンテンツをコピーできる。(`AS` でステージに名前をつけることもできる)

```dockerfile
FROM golang:alpine AS build-env
ADD . /work
WORKDIR /work
RUN go build -o hello main.go

FROM busybox
COPY --from=build-env /work/hello /usr/local/bin/hello
ENTRYPOINT ["/usr/local/bin/hello"]

# 引用: https://qiita.com/minamijoyo/items/711704e85b45ff5d6405
```

また、外部のDockerイメージをコピーのターゲットに指定することもできる。

```dockerfile
COPY --from=nginx:latest /etc/nginx/nginx.conf /nginx.conf
```

もともとbuilder-patternというものがあり、その欠点を克服するためにmulti-stage-buildパターンが生まれた。

> Multi-stage builds give the benefits of the builder pattern without the hassle of maintaining three separate files:
>
> [Builder pattern vs. Multi-stage builds in Docker](https://blog.alexellis.io/mutli-stage-docker-builds/)


### Dockerfile

Dockerイメージの内容を記述するファイル。使用できるコマンドには主に以下がある。

- `FROM`: 親イメージ/ベースイメージを設定する
- `RUN`: 新たなレイヤー上でコマンドを実行し、結果をコミットする
- `CMD`: 実行中のコンテナにデフォルトのコマンドを提供する
- `LABEL`: イメージにメタデータを付与する
- `ENV`: 環境変数を設定する
- `ADD`: ファイルやディレクトリ、リモートファイルをイメージ内にコピーする
- `COPY`: ファイルやディレクトリをコンテナ内に追加する

#### 環境構築をコード化するメリット

- レビューが可能
- 再現性が高い
- 再利用できる

### docker-compose

複数コンテナで構成されるアプリケーションを定義したり、実行するためのツール。

> Compose is a tool for defining and running multi-container Docker applications.
>
> [Overview of Docker Compose | Docker Documentation](https://docs.docker.com/compose/)

#### .dockerignore

.dockerignoreファイルでビルドコンテキストに含めないファイルを指定することができる。これは、Dockerイメージサイズの削減や、意図しない秘密の情報の流出防止に役立つ。

> It can help reduce Docker image size, speedup docker build and avoid unintended secret exposure
>
> [Do not ignore .dockerignore (it's expensive and potentially dangerous) | Codefresh](https://codefresh.io/docker-tutorial/not-ignore-dockerignore-2/)

その他に、 `COPY` コマンドでディレクトリ全体をコピーするとき、特に `.dockerignore` を指定しないと、gitなど頻繁に更新される (かつアプリケーションに影響のない) ファイルもコピー対象に含まれてしまう。この場合、キャッシュを使用できないためビルドに時間がかかるので `.dockerignore` で正しく制御する必要がある。

> If your working directory contains files that are frequently updated (logs, test results, git history, temporary cache files and similar), you are going to regenerate this layer for every docker build run. If you don’t manage the build context correctly, your builds will be very slow as cache cannot be used correctly.
>
> [Do not ignore .dockerignore (it's expensive and potentially dangerous) | Codefresh](https://codefresh.io/docker-tutorial/not-ignore-dockerignore-2/)

##### 何をignoreすべきか

- 実行環境に不要なファイル
  - ドキュメント
  - `.git` ディレクトリ
  - テストファイル
  - 開発用のファイル (開発用のスクリプトなど？)
- 秘密のファイル
  - 秘密鍵や個人情報が含まれるファイル

### パッケージのインストール

**なぜ `apt update && apt install hoge` と1行にする必要がある？**

キャッシュされた古い結果が使われてしまい、最新のパッケージをインストールできない可能性があるから。

各 `RUN` 命令は、キャッシュ可能な実行ユニットとみなされる (= `レイヤー` )。細かく分けた場合、意図しないキャッシュが生成されてしまうため、キャッシュを使用したくないコマンドは同一の `RUN` 命令にまとめることで、キャッシュを毎回更新するようにする必要がある。

> Each RUN instruction can be seen as a cacheable unit of execution. Too many of them can be unnecessary, while chaining all commands into one RUN instruction can bust the cache easily, hurting the development cycle. When installing packages from package managers, you always want to update the index and install packages in the same RUN: they form together one cacheable unit. Otherwise you risk installing outdated packages.
>
> 

ちなみに、複数行をまとめて記述するためのヒアドキュメントという記法も使用できる。

> ```dockerfile
> RUN <<EOF
>   yum update -y
>   yum install -y git
>   yum install -y tree
>   yum install -y jq
>   yum install -y wget
>   rm -rf /var/cache/yum
> EOF
> ```
>
> [Dockerfile で新しく使えるようになった構文「ヒアドキュメント」で複数行の RUN をシュッと書く - kakakakakku blog](https://kakakakakku.hatenablog.com/entry/2021/08/10/085625)

### ENV

#### `RUN export HOGE="hoge"`

他の命令で環境変数を使用できない。その命令でのみ環境変数を使う / 最終的なイメージに含めたくない場合に使用する。

#### `ENV NAME="hoge"`

Dockerfile内の他の命令からも環境変数が使用できる。複数命令で使用したい / 最終的なイメージに含めたい場合に使用する。

## 課題2 (実装)

### `docker run && docker start` でアプリが起動するようなDockerfileを作成

[Dockerfile](./Dockerfile)


アプリの起動はできた。

```sh
~/dev/prahachallenge-ddd task/docker*
❯ curl http://localhost:8000
hello
```

しかし、Dockerで起動したコンテナとdocker-composeで起動したDBを接続する方法がわからず。(Dockerで起動したアプリ側のエラー)。networkを設定すれば良さそうだが時間切れ。

```sh
  Can't reach database server at `localhost`:`5400`

Please make sure your database server is running at `localhost`:`5400`.
    at Object.request (/dist/main.js:356:361)
    at async t._request (/dist/main.js:373:1508)
    at async So.query (/dist/main.js:374:171179)
    at async bo.exec (/dist/main.js:374:166075)
    at async getPairList (/dist/main.js:374:165218) {
  clientVersion: '3.11.1',
  errorCode: undefined
}

```

### `docker-compose.yml` を作成

[docker-compose.yml](./docker-compose.yml)

こちらもアプリの起動はできたがDBとの通信ができていない模様。

```sh
~/dev/prahachallenge-ddd task/docker* 21s
❯ curl http://localhost:8000     
hello
~/dev/prahachallenge-ddd task/docker*
❯ curl http://localhost:8000/pair

```

### 補足

該当PR: https://github.com/sushidesu/prahachallenge-ddd/pull/23

### 参考にしたリンク

- [最小のNode.jsのDockerイメージを目指すスレ - Qiita](https://qiita.com/shibukawa/items/f7076cf4b181ee141bcd)
  - 例が簡潔でわかりやすかった
