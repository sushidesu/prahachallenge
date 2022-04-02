#!/usr/bin/env node
import { program } from "commander"
import { TwitterClient } from "./client/twitter-client"
import { ExtractUsersByFollowing } from "./usecase/extract-users-by-following"
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
    .argument("<userId>", "user id for query")
    .action(async (arg) => {
      if (!isString(arg)) {
        console.log("<userId> is required")
        return
      }
      const twitterClient = new TwitterClient()
      const extractByFollowing = new ExtractUsersByFollowing(twitterClient)

      console.log(`users who following ${arg}:`)
      const result = await extractByFollowing.exec(arg)
      console.log(format(result))
    })

  program.parse()
}

const format = (users: UserDTO[]): string => {
  return users.map((u) => `${u.props.name} (@${u.props.username})`).join("\n")
}

const isString = (value: unknown): value is string => {
  return typeof value === "string"
}

main()
