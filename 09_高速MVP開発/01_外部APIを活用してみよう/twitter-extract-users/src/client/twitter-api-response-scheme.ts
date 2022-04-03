import { z } from "zod"

const twitterUserScheme = z.object({
  id: z.string().nonempty(),
  name: z.string(),
  username: z.string().nonempty(),
})

const tweetScheme = z.object({
  author_id: z.string().nonempty(),
  id: z.string().nonempty(),
  text: z.string(),
})

export const twitterRecentTweetsResponseScheme = z.object({
  data: z.array(tweetScheme),
  includes: z.object({
    users: z.array(twitterUserScheme),
  }),
})

export const twitterUsersResponseScheme = z.object({
  data: z.array(twitterUserScheme),
})

export const twitterUsersByResponseScheme = z.object({
  data: twitterUserScheme.optional(),
})
