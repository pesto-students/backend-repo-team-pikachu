// src/models/Organization.ts

export default class Organization {
  constructor(
    public id: number,
    public name: string,
    public description?: string,
    public address?: string,
    public website?: string,
    public phone?: string,
    public logoURL?: string,
  ) {}
}
