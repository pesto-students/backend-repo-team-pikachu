import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import jwtConfig from "../config/jwt";
import * as databaseService from "./databaseService";

export const signup = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
): Promise<{ userId: number }> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await databaseService.createUser(
    email,
    hashedPassword,
    firstName,
    lastName,
  );

  return { userId: user.id };
};

export const signin = async (
  email: string,
  password: string,
): Promise<{ token: string }> => {
  const user = await databaseService.getUserByEmail(email);
  if (!user) {
    throw new Error("Authentication failed");
  }
  const isMatch = await bcrypt.compare(password, user.hashed_password);
  if (!isMatch) {
    throw new Error("Authentication failed");
  }
  const token = jwt.sign({ userId: user.id }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
  return { token };
};

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
