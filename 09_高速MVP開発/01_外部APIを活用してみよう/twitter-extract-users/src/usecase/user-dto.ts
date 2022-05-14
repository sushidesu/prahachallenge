export class UserDTO {
  constructor(
    public readonly props: {
      id: string
      name: string
      username: string
    }
  ) {}
}
