import { Request, Response } from "express";
import * as userService from "../services/userService";

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

    const user = await userService.getUserById(userId);
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

export const putMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userData?.userId;
    if (!userId) {
      res
        .status(401)
        .json({
          status: "failed",
          code: 401,
          message: "User not authenticated",
        });
      return;
    }

    const { email, firstName, lastName, phone } = req.body;
    if (!email || !firstName || !lastName || !phone) {
      res
        .status(400)
        .json({
          status: "failed",
          code: 400,
          message: "Missing required fields",
        });
      return;
    }

    const user = await userService.updateUser(
      userId,
      email,
      firstName,
      lastName,
      phone,
    );
    res.status(200).json({
      status: "success",
      code: 200,
      message: "User updated",
      data: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "failed", code: 500, message: "Internal server error" });
  }
};
