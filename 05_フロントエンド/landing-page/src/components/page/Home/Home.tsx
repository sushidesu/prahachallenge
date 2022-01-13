import HomeTemplate, { HomeTemplateProps } from "@/components/template/Home"

const _img = (image?: string): string | undefined =>
  image ? `/image/${image}` : undefined

const _genPost = (
  title: string,
  image?: string
): HomeTemplateProps["posts"][number] => ({
  date: new Date(),
  tag: {
    name: "Laravel",
    link: "",
  },
  title,
  body: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!",
  link: "/#",
  author: {
    name: "Alex John",
    image: _img(image),
  },
})

const _genAuthor = (
  name: string,
  image?: string
): HomeTemplateProps["authors"][number] => ({
  name,
  image: _img(image),
  numberOfPosts: 20,
})

const _genCategory = (
  name: string
): HomeTemplateProps["categories"][number] => ({
  name,
  link: "/#",
})

export const Home = (): JSX.Element => {
  const posts = [
    _genPost("Build Your New Idea with Laravel Freamwork."),
    _genPost("Accessibility tools for designers and developers"),
    _genPost("PHP: Array to Map"),
    _genPost("Django Dashboard - Learn by Coding"),
    _genPost("TDD First"),
  ]

  const authors = [
    _genAuthor("Alex John"),
    _genAuthor("Jane Doe", "neko.png"),
    _genAuthor("Lisa Way"),
    _genAuthor("Steve Matt", "sushidesu.jpg"),
    _genAuthor("Khatab Wedaa"),
  ]

  const categories = [
    _genCategory("AWS"),
    _genCategory("Laravel"),
    _genCategory("Vue"),
    _genCategory("Design"),
    _genCategory("Django"),
    _genCategory("PHP"),
  ]

  const resentPost = _genPost("Build Your New Idea with Laravel Freamwork.")

  const options: HomeTemplateProps["options"] = [
    {
      label: "Latest",
      value: "latest",
    },
    {
      label: "Last Week",
      value: "last-week",
    },
  ]

  const props: HomeTemplateProps = {
    posts,
    authors,
    categories,
    resentPost,
    options,
    pagenations: ["/#", "/#", "/#"],
  }

  return <HomeTemplate {...props} />
}
