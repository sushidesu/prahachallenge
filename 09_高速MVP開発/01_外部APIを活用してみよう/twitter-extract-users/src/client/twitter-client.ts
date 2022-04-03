import "dotenv/config"
import { ITwitterClient } from "../domain/twitter-user/twitter-client-interface"
import { TwitterUser } from "../domain/twitter-user/twitter-user"
import { twitterRecentTweetsResponseScheme } from "./twitter-api-response-scheme"

export class TwitterClient implements ITwitterClient {
  private readonly token: string
  private readonly API_ORIGIN = "https://api.twitter.com/2"

  constructor() {
    // .envからBEARER_TOKENを読み込む
    const token = process.env["BEARER_TOKEN"]
    if (token === undefined) {
      throw new Error("env.BEARER_TOKEN is required")
    }
    this.token = token
  }

  async getUsersByTweet(text: string): Promise<TwitterUser[]> {
    const query = new URLSearchParams({
      query: text,
      expansions: "author_id",
      "user.fields": "id,name,username",
    })
    const url = `${this.API_ORIGIN}/tweets/search/recent?${query.toString()}`
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
    const result = await response.json()
    const parsed = twitterRecentTweetsResponseScheme.parse(result)

    return parsed.includes.users.map((u) => ({
      id: u.id,
      name: u.name,
      username: u.username,
    }))
  }

  async getUsersByFollowing(followingUserId: string): Promise<TwitterUser[]> {
    console.info(`TwitterClient.getUsersByFollowing()`, followingUserId)
    return [
      {
        id: "test-user",
        name: "test",
        username: "tteesstt",
      },
    ]
  }
}
