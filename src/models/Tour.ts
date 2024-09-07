// src/models/User.ts

export default class Tour {
  constructor(
    public id: number,
    public tourId: string,
    public organizationId?: number,
    public tourData?: object,
  ) {}
}
