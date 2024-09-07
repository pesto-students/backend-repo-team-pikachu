import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt";

interface JwtPayload {
  userId: number;
}

declare global {
  namespace Express {
    interface Request {
      userData?: JwtPayload;
    }
  }
}

export default (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Authentication failed");
    }
    const decodedToken = jwt.verify(token, jwtConfig.secret) as JwtPayload;
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};
