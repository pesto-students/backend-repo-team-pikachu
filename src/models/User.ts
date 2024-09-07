// src/models/User.ts

export default class User {
  constructor(
    public id: number,
    public email: string,
    public hashed_password: string,
    public organizationId?: number,
    public firstName?: string,
    public lastName?: string,
    public phone?: string,
    public profileImageURL?: string,
  ) {}
}
