import styles from "./Home.module.css"

import { Box } from "@/components/atom/Box"
import { Card } from "@/components/atom/Card"
import { Container } from "@/components/atom/Container"
import { List } from "@/components/atom/List"
import { ListItem } from "@/components/atom/ListItem"
import { Section } from "@/components/atom/Section"
import { SectionTitle } from "@/components/atom/SectionTitle"
import { Select, OptionItem } from "@/components/atom/Select"
import {
  AuthorDetails,
  AuthorDetailsProps,
} from "@/components/molecule/AuthorDetails"
import { CardPost, CardPostProps } from "@/components/organism/CardPost"
import {
  CardPostSmall,
  CardPostSmallProps,
} from "@/components/organism/CardPostSmall"
import { Pagenation } from "@/components/organism/Pagenation"

type _Category = {
  name: string
  link: string
}

export type HomeTemplateProps = {
  posts: CardPostProps[]
  authors: AuthorDetailsProps[]
  categories: _Category[]
  resentPost: CardPostSmallProps
  options: OptionItem[]
  pagenations: string[]
}

export const Home = (props: HomeTemplateProps): JSX.Element => {
  const { posts, authors, categories, resentPost, options, pagenations } = props

  return (
    <div className={styles["wrapper"]}>
      <Container>
        <div className={styles["inner"]}>
          <div className={styles["main"]}>
            <Box spaceX="lg">
              <Section
                size="lg"
                header={
                  <div className={styles["main-header"]}>
                    <SectionTitle>Post</SectionTitle>
                    <Select options={options} />
                  </div>
                }
                footer={<Pagenation links={pagenations} />}
              >
                <List size="md">
                  {posts.map((post, i) => (
                    <CardPost key={i} {...post} />
                  ))}
                </List>
              </Section>
            </Box>
          </div>
          <div className={styles["side"]}>
            <Box spaceX="lg">
              <List size="lg">
                <Section header={<SectionTitle>Authors</SectionTitle>}>
                  <Card>
                    <List size="sm">
                      {authors.map((author, i) => (
                        <AuthorDetails key={i} {...author} />
                      ))}
                    </List>
                  </Card>
                </Section>
                <Section header={<SectionTitle>Categories</SectionTitle>}>
                  <Card>
                    <List size="sm">
                      {categories.map((category, i) => (
                        <ListItem key={i}>
                          <p>{category.name}</p>
                        </ListItem>
                      ))}
                    </List>
                  </Card>
                </Section>
                <Section header={<SectionTitle>Recent Post</SectionTitle>}>
                  <CardPostSmall {...resentPost} />
                </Section>
              </List>
            </Box>
          </div>
        </div>
      </Container>
    </div>
  )
}
