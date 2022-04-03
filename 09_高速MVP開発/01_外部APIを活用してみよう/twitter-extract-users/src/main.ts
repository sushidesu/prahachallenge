#!/usr/bin/env node
import { program } from "commander"
import { z } from "zod"
import { TwitterClient } from "./client/twitter-client"
import { ExtractFollowersByUserId } from "./usecase/extract-followers-by-user-id"
import { ExtractFollowersByUsername } from "./usecase/extract-followers-by-username"
import { ExtractUsersByText } from "./usecase/extract-users-by-text"
import { UserDTO } from "./usecase/user-dto"

const main = () => {
  program
    .command("hello")
    .description("say hello")
    .action(() => {
      console.log("hello!")
    })

  program
    .command("text")
    .description("extract users who tweeted a specific word")
    .argument("<string>", "string for query")
    .action(async (arg) => {
      if (!isString(arg)) {
        console.log("<string> is required")
        return
      }
      const twitterClient = new TwitterClient()
      const extractByText = new ExtractUsersByText(twitterClient)

      console.log(`users who tweeted ${arg}:`)
      const result = await extractByText.exec(arg)
      console.log(format(result))
    })

  program
    .command("following")
    .description("extract users who are following a specific user")
    .option("-u,--username <username>", "query by username")
    .option("-i,--id <userId>", "query by userId")
    .action(async (arg) => {
      const parsed = userOptionScheme.parse(arg)
      const twitterClient = new TwitterClient()

      if (parsed.id !== undefined) {
        const extractFollowersByUserId = new ExtractFollowersByUserId(
          twitterClient
        )
        const result = await extractFollowersByUserId.exec(parsed.id)

        console.log(`users who following ${parsed.id}:`)
        console.log(format(result))
      } else if (parsed.username !== undefined) {
        const extractFollowersByUsername = new ExtractFollowersByUsername(
          twitterClient
        )
        const result = await extractFollowersByUsername.exec(parsed.username)

        console.log(`users who following @${parsed.username}:`)
        console.log(format(result))
      }
    })

  program.parse()
}

const format = (users: UserDTO[]): string => {
  return users.map((u) => `${u.props.name} (@${u.props.username})`).join("\n")
}

const isString = (value: unknown): value is string => {
  return typeof value === "string"
}

const userOptionScheme = z.object({
  id: z.string().nonempty().optional(),
  username: z.string().nonempty().optional(),
})

main()
