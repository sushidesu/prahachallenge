# State hooksを理解してTODOアプリを実装しよう

## 課題1

### 1

hooksメリット

- hooksによって凝集度が高まる
  - > ReactHooksのuseEffect関数により(時間的凝集が)擬似的な機能的凝集となる。
  - from: [オブジェクト指向のその前に-凝集度と結合度/Coheision-Coupling - Speaker Deck](https://speakerdeck.com/sonatard/coheision-coupling?slide=25)
- 凝集度が高いことで、再利用性や保守性が高まる

### 2

便利なhooks

- chakra-uiのhooks
  - [useClipboard - Chakra UI](https://chakra-ui.com/docs/hooks/use-clipboard)
    - クリップボードにコピーを簡単に実現できるhooks
  - [useOutsideClick - Chakra UI](https://chakra-ui.com/docs/hooks/use-outside-click)
    - 要素の外側をクリックしたことを判定してくれるhooks
    - モーダルを実装するときに使うと便利
  - chakra-uiには他にも汎用的なhooksがあって便利
- [thebuilder/react-intersection-observer: React implementation of the Intersection Observer API to tell you when an element enters or leaves the viewport.](https://github.com/thebuilder/react-intersection-observer)
  - 要素が画面内にあるか判定してくれるhooks
  - 画面内に入ったらふわっと出現させるのようなよくあるアニメーションを実現するときに使ったら便利だった
- [@sushidesu/use-filter-select - npm](https://www.npmjs.com/package/@sushidesu/use-filter-select)
  - 他のselectの選択結果を元にselectのoptionsをフィルターするを簡単に書くためのhooks
  - もっと汎用的にしたいがTypeScript力が足りない

## 課題2

Todoアプリのリファクタリング

- リファクタリング後のコード
  - [simple-to-do-list/src/App.tsx](./simple-to-do-list/src/App.tsx)
  - [simple-to-do-list/src/useTodo.ts](./simple-to-do-list/src/useTodo.ts)
- リファクタリング前と後の比較: https://github.com/sushidesu/prahachallenge/compare/a5d83d0cadc2342887a49a01056783698d2aed4f...bbadd6abe559837327b5796e24ccceee032324b6
- やったこと
  - `TodoBox` のロジックを `useTodo` に移動
    - `useTodo` は４つの値を返す
      - `Task[]`: todoのリスト
      - `AddTaskFunction`: todoを追加するときに使う関数
      - `RemoveTaskFunction`: todoを削除するときに使う関数
      - `ToggleCompleteFunction`: todoの完了を切り替えるときに使う関数
  - `TodoItem` は受け取ったものを表示するだけのシンプルなものに変更
    - 削除ボタン/完了ボタン用のハンドラを、ボタンに直接受け渡すように変更した
  - `TodoList` は削除
  - その他 `const` を使用する、クラスコンポーネントから関数コンポーネントへの変更、型をつけるなど細かい修正
- 感想
  - 元コードのReactのバージョンが古すぎて(v0.13.0)、hooksすら使えなかった
  - 新しいバージョンに移したかったが、新しいバージョンにはないdeprecatedなAPIが使われていたた (`React.createClass`, `React.findDOMNode` など)
  - 一般的なclassコンポーネントの実装に移し替えた後、リファクタリングを行った
  - ↑classコンポーネントに移し替えるのが一番大変だった！！

## 課題3

### 1

presentational, container

- メリット
  - storybookで操作しやすくなる
    - > presenterはpureに全状態を外から受け取るような構成にしておけば、presenterに対してstoryを書くことでstorybookによるvisual regression testのカバレッジを100%近くに上げられるんだよなーというのを思っています。
    - from: [SPA Componentの推しディレクトリ構成について語る](https://zenn.dev/yoshiko/articles/99f8047555f700#container%2Fpresenter%E3%81%AE%E5%88%86%E9%9B%A2)
  - ロジックに対するテストがしやすくなる
    - > Container ComponentはPresentational Componentに加工したpropsを渡すだけなので、ロジックに対するテストも簡単になります。
    - from: [React Componentの実装ルールを決めてみた | Money Forward Engineers' Blog](https://moneyforward.com/engineers_blog/2020/02/18/react-component-rules/)
  - ロジックとUIが分離されていることによる疎結合化 (?)
    - > Container Component と Presentational Component に分けることで、見た目とロジックを切り分けることができます
    - from: [Presentational Component と Container Component · React-Basic-Udemy](https://nakanisi-yusuke.gitbooks.io/react-basic-udemy/content/redux-no/presentational-component-to-container-component.html)
  - 可読性 (?)
    - > ロジックとUIを分離し、可読性が良くなる
    - from: [Container / Presentational構成【Reactのコンポーネント設計】 | NOCHITOKU](https://www.nochitoku-it.com/containr-1)
- デメリット
  - ファイル数が増える、面倒
    - > ただファイル数も増えるし、stateがでてくるたびに分割していくのはさすがに面倒かな…と思って踏み切れてません。
    - from: [SPA Componentの推しディレクトリ構成について語る](https://zenn.dev/yoshiko/articles/99f8047555f700#container%2Fpresenter%E3%81%AE%E5%88%86%E9%9B%A2)

#### 個人的に思うこと

##### 見た目 / ロジックという分け方は適切か？

- ブログを例にすると、postRepositoryから取得したものは `<Post />` のところに表示するし、commentRepositoryから取得したものは `<Comment />` に表示するはず
  - つまり、post取得とブログ記事の表示、comment取得とコメントの表示は関連性が高い
- 一方、`BlogContainer` 内のブログ記事の取得とコメントの取得、はそれぞれ関連のある処理とは言えず、 `時間的凝集` であるといえる
  - Postの表示とCommentの表示もたまたま同じページにあるだけで、それほど関連性は高くないと言える
- テンプレートはどのpropsをどのコンポーネントに渡すかを知らなくてはいけない
  - どのように使うかを知らなくてはいけない
    - 例: `isCommentLoading` が `true` のときは、コメントの代わりに `ロード中...` を表示する
  - 違うものを渡すと動かない

```tsx
/* Container / Presenter  の例 */

const BlogPageContainer = (id: string) => {
  // post取得、comment取得, いいねボタンクリック時の処理 に強い関連はなく、
  // 時間的凝集にとどまっている
  const post = postRepository.get(id)
  const [comments, isCommentLoading] = useFetch(() => commentRepository.get(id))
  const handleLike = () => {
    likePost(id)
  }

  const props = {
    post,
    comments,
    isCommentLoading,
    handleLike,
  }
  return <BlogPageTemplate {...props}/>
}

const BlogPageTemplate = (props: BlogPageTemplateProps) => {
  const { post, comments, isCommentLoading, handleLike } = props
  return (
    <div>
      <div className="post">
        <Post post={post} />
      </div>
      <div className="comments">
        {isCommentLoading
          ? <p>ロード中...</p>
          : comments.map(comment => (
            <Comment key={comment.id} comment={comment} />
          ))
        }
      </div>
      <div className="likeButton">
        <LikeButton onClick={handleLike} />
      </div>
    </div>
  )
}
```

- なら、`(ブログ取得->表示)`, `(コメント取得->表示)`, `(いいねボタンの処理->いいねボタンを表示)` のような分け方も考えられるのではないか
  - こちらのほうがより機能的凝集に近いのではないか？
- 使う側のコンポーネントは、細かい使い方やどのコンポーネントにどのpropsを渡すかなどを気にすることなく使うことができる
- `PostPage` の責務は各hooksの呼び出しと、各コンポーネントの配置 のみになる

```tsx
/* こっちの方がいいのでは？ の例 */

const usePost = (id: string) => {
  // post取得 -> Post表示をまとめている
  const post = postRepository.get(id)
  return () => (<Post post={post} />)
}

const useComments = (id: string) => {
  // comment取得 -> Comment表示をまとめている
  // 取得中の処理や表示についてもhooks内に隠蔽されている
  const [comments, isLoading] = useFetch(() => commentRepository.get(id))

  return () => {
    if (isLoading) {
      return <p>ロード中...</p>
    } else {
      return comments.map(comment => (
        <Comment key={comment.id} comment={comment} />
      ))
    }
}

const useLikeButton = (id: string) => {
  const handleLike = () => {
    likePost(id)
  }
  return () => <LikeButton onClick={handleLike} />
}

const BlogPage = (id: string) => {
  const renderPost = usePost(id)
  const renderComments = useComments(id)
  const renderLikeButton = useLikeButton(id)

  return (
    <div>
      <div className="post">{renderPost()}</div>
      <div className="comments">{renderComments()}</div>
      <div className="likeButton">{renderLikeButton()}</div>
    </div>
  )
}
```

##### 可読性はむしろ下がるのでは？

- ページ内のコンテンツを一気に流し込む場合、大量の引数がcontainerに羅列される。それらがどのように使われるかは別ファイルのtemplateを見なければならず、読み解きづらいと思う
  - 前述した、どのコンポーネントにどのpropsを渡すのか問題が発生する
  - hogePropsがコンポーネントhogeに渡されるのは明らかなのに、わざわざ渡さなければいけない

### 2

organismであるHeaderコンポーネントを presenter/containerに分割しました。

- presenter: [Header.tsx](../landing-page/src/components/organism/Header/Header.tsx)
- container: [HeaderContainer.tsx](../landing-page/src/components/organism/Header/HeaderContainer.tsx)

しかし、Atomic Designの `page` の役割がコンテンツの流し込みであるから、 template/pageレベルのコンポーネントでしか分割は起こりえない？特定のorganismに対応するcontainerを設けるのはおかしいように感じた。

本来なら page -> template -> organism(Header) のような経路で渡すほうが自然かも？

## クイズ

### クイズ1

`Add Task` ボタンを押したのにも関わらず、 タスクが追加されません。なぜでしょうか？

```tsx
const Todo = () => {
  const [tasks, setTasks] = useState<string[]>([])

  const addTask = (task: string) => {
    setTasks(prev => {
      prev.push(task)
      return prev
    })
  }

  return (
    <div>
      <ul>
        {tasks.map((task, i) => (
          <li key={i}>{task}</li>
        ))}
      </ul>
      <button onClick={() => {
        addTask("hello") // "hello" が追加されるはずなのに、表示が変わらない！
      }}>Add Task</button>
    </div>
  )
}
```

<details><summary>回答例</summary>

Reactは `Object.is()` を使用してstateの変更を検知しているので、 `Array.push()` などのオブジェクトの参照が変わらない変更は検知されず、再レンダリングが行われないため。

セット関数(または、セット関数のコールバックから返す値) には、新しいオブジェクトを渡すように修正すると想定通りの動作になる。

正しく動く例

- `setTasks(prev => [...prev, task])`
- `setTasks(prev => prev.concat(task))`

参考

- [React の state hook で array を更新しても再描画がされない問題 | gotohayato.com](https://gotohayato.com/content/509/)
- [オブジェクト参照とコピー](https://ja.javascript.info/object-copy)

---

ちなみに、state自体の変更は行われているため、 `addTask()` の後に適当なstateを変更して強制的に再レンダリングを行うと、最新の `tasks` を表示することができる。

動作サンプル: https://codesandbox.io/s/dirty-array-state-mutation-318xr
</details>

### クイズ2

`Form_1` と `Form_2` ではどちらのstateの使い方が適切でしょうか？

```tsx
type FormValue = {
  name: string
  age: string
  open: boolean
}

const Form_1 = () => {
  const [form, setForm] = useState<FormValue>({
    name: "",   // ユーザーからの入力を保持する
    age: "",    // ユーザーからの入力を保持する変数
    open: false // モーダルフォームの開閉を表す変数
  })
}

//////////////////////////////////////

const Form_2 = () => {
  const [name, setName] = useState<string>("")
  const [age, setAge] = useState<string>("")
  const [open, setOpen] = useState<boolean>(false)
}
```

<details><summary>回答例</summary>

`Form_2` のほうが適切だと考えられる。

- セット関数がシンプルになる
  - オブジェクトを管理する場合、プロパティの一部のみ更新するのが少し面倒 (セット関数が複雑になる)
  - 例: `setForm(prev => ({ ...prev, age: "10" }))`
- カスタムフックへの抽出がしやすくなる

> どの値が一緒に更新されやすいのかに基づいて、state を複数の state 変数に分割することをお勧めします。
>
> [フックに関するよくある質問 – React](https://ja.reactjs.org/docs/hooks-faq.html#should-i-use-one-or-many-state-variables)
</details>
