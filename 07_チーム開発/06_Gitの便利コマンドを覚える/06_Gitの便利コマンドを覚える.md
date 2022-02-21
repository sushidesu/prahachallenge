# Gitの便利コマンドを覚える

## 課題1 (質問)

### 1. 特定のコミットとの差分を表示

```sh
git diff [特定のコミット]
# --cached でステージとの比較もできる
git diff --cached
```

特定のコミットの指定方法にはいくつかある

- コミットハッシュを指定する方法
  - `git log --oneline` などでコミットハッシュを確認できる
- `HEAD` やチルダ (`~`)、キャレット (`^`)を使用する
  - コミットハッシュを調べなくて良いので便利

#### チルダ、キャレット、HEADについて

| 文字 | 意味 |
| --- | --- |
| `HEAD` | 現在のブランチの最新のコミットを表す |
| `@` | `HEAD` のエイリアス |
| `~` | チルダ。1番目の親(1世代前)を表す。 |
| `~~` | 1番目の親の1番目の親(2世代前)を表す。 |
| `~2` | 1番目の親の1番目の親(2世代前)を表す。(`~~`と同じ) |
| `^` | キャレット。1番目の親を表す。 |
| `^^` | 1番目の親の1番目の親を表す。 |
| `^2` | 2番目の親を表す。 |

まとめると、

- `~` は世代を指定
- `^` は親を指定
- `HEAD~`, `HEAD^` は同じ
- `HEAD~~`, `HEAD~2`, `HEAD^^` も同じ
- `HEAD^2` だけ違う

---

以下のgit履歴を例に試してみる。以下2つのブランチがある。(時系列順に①~⑤の番号を記載)

- `main`
- `feat/add`

```sh
❯ git log --oneline --graph
*   03dfb63 (HEAD -> main) merge feat/add branch (⑤)
|\  
| * 6aae3f9 (feat/add) feat: use add.ts (④)
| * 2da58db feat: create add.ts (③)
|/  
* 0df1ee2 fix: hello -> hello world (②)
* 25e817b fist commit (①)
```

この時 `main` ブランチが1番目の親、 `feat/add` ブランチが2番目の親になる。(恐らくマージした順?)

##### `HEAD~`, `HEAD^`

1番目の親なので、②番 `0df1ee2` を表す。直近のコミットである④番は、2番目の親であるため、該当しない。

```sh
~/dev/test/git-sandbox main
❯ git checkout HEAD~       
HEAD is now at 0df1ee2 fix: hello -> hello world (②)
```

```sh
~/dev/test/git-sandbox main
❯ git checkout HEAD^       
HEAD is now at 0df1ee2 fix: hello -> hello world (②)
```

##### `HEAD~~`, `HEAD~2`, `HEAD^^`

`HEAD` の親の親、つまり2世代前なので、 ① `25e817b` を表す。

```sh
~/dev/test/git-sandbox main
❯ git checkout HEAD~~      
HEAD is now at 25e817b fist commit (①)
```

```sh
~/dev/test/git-sandbox main
❯ git checkout HEAD~2 
HEAD is now at 25e817b fist commit (①)
```

```sh
~/dev/test/git-sandbox main
❯ git checkout HEAD^^      
HEAD is now at 25e817b fist commit (①)
```

##### `HEAD^2`

`HEAD` の2番目の親なので、 ④ `6aae3f9` を表す。

```sh
~/dev/test/git-sandbox main
❯ git checkout HEAD^2      
HEAD is now at 6aae3f9 feat: use add.ts (④)
```

##### 突然のクイズ

同じく以下の状況で、`HEAD^2^` はどのコミットを表すでしょうか？

```sh
❯ git log --oneline --graph
*   03dfb63 (HEAD -> main) merge feat/add branch (⑤)
|\  
| * 6aae3f9 (feat/add) feat: use add.ts (④)
| * 2da58db feat: create add.ts (③)
|/  
* 0df1ee2 fix: hello -> hello world (②)
* 25e817b fist commit (①)
```






<!-- すぐ下にクイズの答えがあります (ネタバレ防止のための空行) -->







<details><summary>答え</summary>

`HEAD` の2番目の親の1番目の親(1世代前)なので、③ `2da58db`を表す。

```sh
~/dev/test/git-sandbox main
❯ git checkout HEAD^2^
HEAD is now at 2da58db feat: create add.ts (③)
```

`HEAD` の2番目の親 (④ `6aae3f9`) から見たときの1番目の親なので、③ `2da58db` になる。
</details>










<!-- クイズの答えここまで (ネタバレ防止のための空行終わり)-->

##### 参考

- [[git] チルダ(~)とキャレット(^)の違い | Tech控え帳](https://www.chihayafuru.jp/tech/index.php/archives/2535)

### 2. 差分があるファイル名だけを一覧表示

```sh
git status --short
# または
git status -s
```

`git status` は現在の状態を表示するコマンド。

### 3. ファイルの一部をステージング

```sh
git add --patch
# または
git add -p
```

`git add --patch` は対象のファイルを任意のhunk(かたまり)に分割して、そのhunkステージ/スキップを選択できるオプション。

ちなみにhunkは英語で(肉・パンなどの)大きなかたまりの意味。(参考: [hunkの意味・使い方・読み方 | Weblio英和辞書](https://ejje.weblio.jp/content/hunk))

パッチーモード中に使用できるコマンドは以下

| コマンド | 説明 |
| --- | --- |
| `y` | 現在のhunkをステージングする |
| `n` | 現在のhunkをステージングしない |
| `q` | 終了する |
| `a` | このファイル内の、現在のhunk・残りのhunkをステージングする |
| `d` | このファイル内の、現在のhunk・残りのhunkをステージングしない |
| `g` | 対象のhunkを選択する |
| `/` | 正規表現でhunkを探す |
| `j` | 次の未定義のhunkに進む |
| `J` | 次のhunkに進む |
| `k` | 前の未定義のhunkに戻る |
| `K` | 前のhunkに戻る |
| `s` | 現在のhunkを小さなhunkに分割する |
| `e` | 手動でhunkを編集する |
| `?` | ヘルプ |

参考

- https://qiita.com/cotton_desu/items/bf08ac57d59b37dd5188
- https://qiita.com/crifff/items/1abf08bca4ce51db4775

### 4. 一時的に変更内容を退避

```sh
git stash
# --message オプションでコメントをつけることもできる
git stash -m "message"
```

その他stash周りでよく使いそうなコマンド

| コマンド | 説明 |
| --- | --- |
| `git stash -u` | 新規作成ファイルも含めて退避 |
| `git stash apply [stash]` | stashの呼び出し |
| `git stash drop [stash]` | stashの削除 |
| `git stash pop [stash]` | stashを呼び出して、削除 |
| `git stash list` | stashの一覧を表示 |
| `git stash show [stash]` | stashの内容を表示 |
| `git stash clear` | すべて削除 |

参考: https://qiita.com/chihiro/items/f373873d5c2dfbd03250

### 5. 特定ファイルのコミット履歴を見る

```sh
git log [ファイル名]
```

便利なオプション

- `--oneline`
- `-[行数]`
- `--graph`

### 6. 複数に分かれたコミットを一つにまとめる

```sh
git rebase -i [特定のコミット]
# その後、rebaseモード内でfixupまたはsquashを選択
```

リベースモード中に使用できるコマンド

| コマンド | 説明 |
| --- | --- |
| `p`, `pick` | そのままにする |
| `r`, `reword` | コミットメッセージを編集 |
| `e`, `edit` | コミットを編集する |
| `s`, `squash` | 1つ前(上)のコミットに統合する |
| `f`, `fixup` | 1つ前(上)のコミットに統合する(コミットメッセージはそのまま) |
| `d`, `drop` | コミットを削除 | 

### 7. 特定のブランチをもとに新たなブランチを作成 (?)

```sh
# 派生元のブランチで
git switch -c [ブランチ名]
```

##### switchとcheckoutの違い

`switch` は機能が多すぎる `checkout` を分割して新たに作られたコマンド。

「変更を戻す」に関連する機能が `restore` コマンドに、「ブランチ操作」に関連する機能が `switch` に分割されている。

`switch` は使っていたけど `restore` は使っていなかった。これからは使いたい！

参考

- [Git2.23のハイライト| GitHubブログ](https://github.blog/2019-08-16-highlights-from-git-2-23/)
- [git checkout の代替としてリリースされた git switch と git restore - kakakakakku blog](https://kakakakakku.hatenablog.com/entry/2020/04/08/151627)
- [gitコマンド checkoutとswitchの違い　～これからはswitchを使おう～ | Snow System](https://snowsystem.net/git/git-command/git-switch/)

### 8. 最新コミットのみをクローン

```sh
git clone --depth=1 <url>
```

最新のコミットのみのクローンはシャロークローンと呼ばれる。過去のコミットは取得しないため、`git log` や `git blame` などのコマンドは機能しない。また、その後のfetchには大きなコストがかかるため、開発環境では使用しづらい。

git公式ブログでは `古い機能` と呼ばれており、推奨されていない。

> このクローンは後からのフェッチに過度のストレスを与えることになるので、開発者が使用することは強くお勧めしません。一度ビルドした後にリポジトリを削除するビルド環境では便利です。
>
> [パーシャルクローンとシャロークローンを活用しよう - GitHubブログ](https://github.blog/jp/2021-01-13-get-up-to-speed-with-partial-clone-and-shallow-clone/)

他には以下のクローン方法がある。

- ブロブレスクローン
- ツリーレスクローン

#### ブロブレスクローン

到達可能なすべてのコミットとファイルツリーをダウンロードする。ファイルの内容(ブロブ)は必要に応じて取得する。

高速にクローンできる + その後の作業もそこそこ快適なクローン。ファイル容量が大きいレポジトリをクローンして作業したい場合に最適。

```sh
git clone --filter=blob:none <url>
```

> リポジトリの履歴が多く、大きなブロブがたくさんあるような場合は、このオプションを使うことで git clone の時間を大幅に短縮することができます。コミットやツリーのデータはそのまま残っているので、それ以降の git checkout では欠落しているブロブをダウンロードするだけで済みます。Git クライアントは、欠落しているブロブだけをサーバーに要求するリクエストをまとめて実行することができます。
>
> [パーシャルクローンとシャロークローンを活用しよう - GitHubブログ](https://github.blog/jp/2021-01-13-get-up-to-speed-with-partial-clone-and-shallow-clone/)

#### ツリーレスクローン

到達可能なすべてのコミットをダウンロードする。(ツリー・ファイルの内容はダウンロードしない)

しかし、`git log -- <path>`や `git checkout`など、過去のファイルの内容が必要になったときにはほぼすべてのツリーをダウンロードするため、クローン後の作業は不便。CI環境などで素早くクローンしたい場合に便利。

```sh
git clone --filter=tree:0 <url>
```

> 開発者の皆さんには、日々の作業にツリーレスクローンを使わないよう強くお勧めします。ツリーレスクローンが本当に役に立つのは、自動ビルドで素早くクローンを作成してプロジェクトをコンパイルし、リポジトリを捨てたいときだけです。パブリックランナーを使った GitHub Actions のような環境では、クローン時間を最小限に抑えて、ソフトウェアを実際にビルドするためにマシンの時間を使いたいでしょう！そのような環境では、ツリーレスクローンは優れた選択肢かもしれません。
>
> [パーシャルクローンとシャロークローンを活用しよう - GitHubブログ](https://github.blog/jp/2021-01-13-get-up-to-speed-with-partial-clone-and-shallow-clone/)

参考

- [パーシャルクローンとシャロークローンを活用しよう - GitHubブログ](https://github.blog/jp/2021-01-13-get-up-to-speed-with-partial-clone-and-shallow-clone/)
- [git リポジトリの最新の履歴だけを取得する shallow clone - Qiita](https://qiita.com/usamik26/items/7bfa61b31344206077fb)

### 9. マージを中断

```sh
# マージ中の中断
git merge --abort

# マージ作業中の変更を破棄して中断
git reset --hard HEAD
```

参考: [【git】マージしたけどやっぱりやめたい時のやり方4種類 - Qiita](https://qiita.com/chihiro/items/5dd671aa6f1c332986a7)

## その他

### ステージングの取り消し

```sh
git restore --staged
# または
git reset HEAD
```

### そもそも `reset --soft` とか `reset --hard` って何？

構文: `git reset [<mode>] [<commit>]`

git resetは `mode` と `commit` を指定できる。`--soft` や `--mixed` は `mode` の一種。

| `mode` | 説明 |
| --- | --- |
| `--soft` | コミットを戻す。 |
| `--mixed` | コミットとステージを戻す。 `mode` を指定しなかった場合のデフォルト。 |
| `--hard` | コミット・ステージ・作業内容すべてを戻す。 |

この図がわかりやすかった。

> And finally, a visualization:
>
> ![tree movements](https://i.stack.imgur.com/qRAte.jpg)
>
> [version control - What's the difference between git reset --mixed, --soft, and --hard? - Stack Overflow](https://stackoverflow.com/questions/3528245/whats-the-difference-between-git-reset-mixed-soft-and-hard)

参考

- [Git - git-reset Documentation](https://git-scm.com/docs/git-reset)
- [version control - What's the difference between git reset --mixed, --soft, and --hard? - Stack Overflow](https://stackoverflow.com/questions/3528245/whats-the-difference-between-git-reset-mixed-soft-and-hard)

### alias

.gitconfigファイルにaliasを設定することができる。よく使うコマンドのaliasを作成しておくと便利。

自分のaliasはこんな感じです。(コメント・空行は見やすさのために追記したものです)

```sh
[alias]
      # 設定されているalias一覧を表示 たまに使う
      alias = config --get-regexp ^alias\\.

      # 簡単にログを見る 👍よく使う
      lo = log --oneline -12 --reverse

      # 詳しめにログを見る あまり使わない
      logn = log --name-status --oneline -5

      # ステータス表示 👍よく使う
      ss = status

      # 一つ前のコミットに追加 たまに使う
      ca = commit --amend

      # 1つ前のコミットに追加(コミットメッセージ編集なし) まあまあ使う
      can = commit --amend --no-edit

      # 削除されたリモートブランチをローカルからも削除しつつfetch 👍よく使う
      fp = fetch --prune

      # すべてステージング 👍よく使う
      a = add -A

      # コミット 👍よく使う
      c = commit

      # メッセージ付きコミット commitしてvimでメッセージを書く事が多いので、あまり使わない
      cm = commit -m

      # すべてステージングしてコミット あまり使わない(忘れてた)
      ac = commit -a

      # プル あまり使わない(普通にpullと打つ)
      pl = pull

      # プッシュ あまり使わない(普通にpushと打つ)
      ps = push

      # ブランチの切り替え 👍よく使う
      sw = switch

      # ブランチを作成して切り替え あまり使わない (sw -c を打ちがち)
      swc = switch -c

      # リモートブランチを含むブランチ一覧を表示 👍よく使う
      ba = branch -a

      # ブランチを削除 👍よく使う
      bd = branch -d

      # ブランチを強制削除 まあまあ使う
      bdd = branch -D
```

いろんなaliasが載っていて面白いブログ → [マイGitしぐさ](https://miyaoka.dev/posts/2021-02-12-git-alias)
