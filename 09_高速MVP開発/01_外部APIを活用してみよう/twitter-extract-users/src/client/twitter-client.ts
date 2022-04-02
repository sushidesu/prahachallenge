import { ITwitterClient } from "../domain/twitter-user/twitter-client-interface"
import { TwitterUser } from "../domain/twitter-user/twitter-user"

export class TwitterClient implements ITwitterClient {
  async getUsersByTweet(text: string): Promise<TwitterUser[]> {
    console.info(`TwitterClient.getUsersByTweet()`, text)
    return [
      {
        id: "test-user",
        name: "test",
        username: "tteesstt",
      },
    ]
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
