import { Request, Response } from "express";
import * as authService from "../services/authService";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const result = await authService.signup(
      email,
      password,
      firstName,
      lastName,
    );
    res.status(201).json({
      status: "success",
      code: 201,
      messsage: "Signed up successfully",
      data: result,
    });
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      res
        .status(409)
        .json({ status: "failed", code: 409, message: "Email already exists" });
      return;
    }
    res
      .status(400)
      .json({ status: "error", code: 400, message: (error as Error).message });
  }
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await authService.signin(email, password);
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Signed in successfully",
      data: result,
    });
  } catch (error) {
    res
      .status(401)
      .json({ status: "failed", code: 401, message: (error as Error).message });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userData?.userId;
    if (!userId) {
      res.status(401).json({
        status: "failed",
        code: 401,
        message: "User not authenticated",
      });
      return;
    }

    const user = await authService.getUserById(userId);
    if (!user) {
      res
        .status(404)
        .json({ status: "failed", code: 404, message: "User not found" });
      return;
    }

    res.status(200).json({
      status: "success",
      code: 200,
      message: "User found",
      data: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "failed", code: 500, message: "Internal server error" });
  }
};
