import "dotenv/config"
import { ITwitterClient } from "../domain/twitter-user/twitter-client-interface"
import { TwitterUser } from "../domain/twitter-user/twitter-user"
import {
  twitterRecentTweetsResponseScheme,
  twitterUsersByResponseScheme,
  TwitterUserScheme,
  twitterUsersResponseScheme,
} from "./twitter-api-response-scheme"

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

  async getUserByUsername(username: string): Promise<TwitterUser | undefined> {
    const url = `${this.API_ORIGIN}/users/by/username/${username}`
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
    const result = await response.json()
    const parsed = twitterUsersByResponseScheme.parse(result)

    return parsed.data === undefined ? undefined : this.convertUser(parsed.data)
  }

  async getUsersByTweet(text: string): Promise<TwitterUser[]> {
    const query = new URLSearchParams({
      query: text,
      expansions: "author_id",
      "user.fields": "id,name,username",
      max_results: "100", // 引数で指定できるようにしたい
    })
    const url = `${this.API_ORIGIN}/tweets/search/recent?${query.toString()}`
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
    const result = await response.json()
    const parsed = twitterRecentTweetsResponseScheme.parse(result)

    return parsed.includes.users.map((u) => this.convertUser(u))
  }

  async getUsersByFollowing(followingUserId: string): Promise<TwitterUser[]> {
    const query = new URLSearchParams({
      max_results: "100", // 引数で指定できるようにしたい
    })
    const url = `${
      this.API_ORIGIN
    }/users/${followingUserId}/followers?${query.toString()}`
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
    const result = await response.json()
    const parsed = twitterUsersResponseScheme.parse(result)

    return parsed.data.map((u) => this.convertUser(u))
  }

  private convertUser(value: TwitterUserScheme): TwitterUser {
    return {
      id: value.id,
      name: value.name,
      username: value.username,
    }
  }
}
