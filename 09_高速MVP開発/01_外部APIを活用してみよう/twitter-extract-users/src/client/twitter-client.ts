import "dotenv/config"
import { ITwitterClient } from "../domain/twitter-user/twitter-client-interface"
import { TwitterUser } from "../domain/twitter-user/twitter-user"
import {
  twitterRecentTweetsResponseScheme,
  twitterUsersByResponseScheme,
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

    return parsed.data === undefined
      ? undefined
      : {
          id: parsed.data.id,
          name: parsed.data.name,
          username: parsed.data.username,
        }
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
    const url = `${this.API_ORIGIN}/users/${followingUserId}/followers`
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
    const result = await response.json()
    const parsed = twitterUsersResponseScheme.parse(result)

    return parsed.data.map((u) => ({
      id: u.id,
      name: u.name,
      username: u.username,
    }))
  }
}
