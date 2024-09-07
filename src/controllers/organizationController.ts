import { Request, Response } from "express";
import * as organizationService from "../services/organizationService";

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userData?.userId;

    if (!userId) {
      res
        .status(401)
        .json({ status: "error", code: 401, message: "User ID not found" });
      return;
    }

    const organization =
      await organizationService.getOrganizationByUserId(userId);
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Organization fetched successfully",
      data: organization,
    });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(404)
        .json({ status: "error", code: 404, message: error.message });
    } else {
      res.status(500).json({
        status: "error",
        code: 500,
        message: "An unknown error occurred",
      });
    }
  }
};

export const postMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userData?.userId;

    if (!userId) {
      res
        .status(401)
        .json({ status: "error", code: 401, message: "User ID not found" });
      return;
    }
    const { name, description, address, website, phone } = req.body;
    const organization = await organizationService.createOrganization(
      userId,
      name,
      description,
      address,
      website,
      phone,
      "https://placehold.co/600x400.png",
    );
    res.status(201).json({
      status: "success",
      code: 201,
      message: "Organization created successfully",
      data: organization,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: "An unknown error occurred",
    });
  }
};

export const putMe = async (req: Request, res: Response): Promise<void> => {
  // Implementation for putMe
};
