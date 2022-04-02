import { TwitterUser } from "./twitter-user"

export interface ITwitterClient {
  getUsersByTweet(text: string): Promise<TwitterUser[]>
  getUsersByFollowing(followingUserId: string): Promise<TwitterUser[]>
}
