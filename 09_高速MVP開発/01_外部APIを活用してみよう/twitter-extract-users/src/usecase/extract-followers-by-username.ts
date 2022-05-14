import { ITwitterClient } from "../domain/twitter-user/twitter-client-interface"
import { UserDTO } from "./user-dto"

export class ExtractFollowersByUsername {
  constructor(private readonly twitterClient: ITwitterClient) {}

  async exec(username: string): Promise<UserDTO[]> {
    const target = await this.twitterClient.getUserByUsername(username)
    if (target === undefined) {
      throw new Error(`username: ${username} is not found`)
    }

    const followers = await this.twitterClient.getUsersByFollowing(target.id)
    return followers.map(
      (u) =>
        new UserDTO({
          id: u.id,
          name: u.name,
          username: u.username,
        })
    )
  }
}
