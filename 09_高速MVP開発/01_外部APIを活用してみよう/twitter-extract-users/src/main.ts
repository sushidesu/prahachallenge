#!/usr/bin/env node
import { program } from "commander"
import { TwitterClient } from "./client/twitter-client"
import { ExtractUsersByText } from "./usecase/extract-users-by-text"

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
      console.log(
        result.map((u) => `${u.props.name} (@${u.props.username})`).join("\n")
      )
    })

  program
    .command("following")
    .description("extract users who are following a specific user")
    .argument("<userId>", "user id for query")
    .action((arg) => {
      if (!isString(arg)) {
        console.log("<userId> is required")
        return
      }

      console.log(`query by following user: ${JSON.stringify(arg)}`)
    })

  program.parse()
}

const isString = (value: unknown): value is string => {
  return typeof value === "string"
}

main()
