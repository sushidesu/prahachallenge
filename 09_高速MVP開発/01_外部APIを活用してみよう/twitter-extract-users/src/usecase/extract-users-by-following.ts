import { ITwitterClient } from "../domain/twitter-user/twitter-client-interface"
import { UserDTO } from "./user-dto"

export class ExtractUsersByFollowing {
  constructor(private readonly twitterClient: ITwitterClient) {}

  async exec(userId: string): Promise<UserDTO[]> {
    const users = await this.twitterClient.getUsersByFollowing(userId)
    return users.map(
      (u) =>
        new UserDTO({
          id: u.id,
          name: u.name,
          username: u.username,
        })
    )
  }
}
