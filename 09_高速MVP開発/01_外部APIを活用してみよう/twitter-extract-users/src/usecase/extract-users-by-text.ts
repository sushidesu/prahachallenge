import { ITwitterClient } from "../domain/twitter-user/twitter-client-interface"
import { UserDTO } from "./user-dto"

export class ExtractUsersByText {
  constructor(private readonly twitterClient: ITwitterClient) {}

  async exec(text: string): Promise<UserDTO[]> {
    const users = await this.twitterClient.getUsersByTweet(text)
    return users.map((u) => {
      return new UserDTO({
        id: u.id,
        name: u.name,
        username: u.username,
      })
    })
  }
}
