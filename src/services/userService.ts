import * as databaseService from "./databaseService";

export const getUserById = async (userId: number) => {
  const user = await databaseService.getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  } else if (user) {
    const {
      id: userId,
      email,
      organizationId,
      firstName,
      lastName,
      phone,
    } = user;
    return { userId, email, organizationId, firstName, lastName, phone };
  }
};

export const updateUser = async (
  userId: number,
  email: string,
  firstName: string,
  lastName: string,
  phone: string,
) => {
  const user = await databaseService.upsertUser(email, firstName, lastName, userId, phone);
  if (!user) {
    throw new Error("User not found");
  } else if (user) {
    const {
      id: userId,
      email,
      organizationId,
      firstName,
      lastName,
      phone,
    } = user;
    return { userId, email, organizationId, firstName, lastName, phone };
  }
}
