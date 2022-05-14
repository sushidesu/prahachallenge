import { TwitterUser } from "./twitter-user"

export interface ITwitterClient {
  getUserByUsername(username: string): Promise<TwitterUser | undefined>
  getUsersByTweet(text: string): Promise<TwitterUser[]>
  getUsersByFollowing(followingUserId: string): Promise<TwitterUser[]>
}
