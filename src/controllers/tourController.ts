import { Request, Response } from "express";
import * as tourService from "../services/tourService";
import * as organizationService from "../services/organizationService";

export const createTour = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userData?.userId;
    const tourId = req.body.tourId;
    const tourData = req.body.tourData;

    if (!userId) {
      res.status(401).json({
        status: "failed",
        code: 401,
        message: "User ID not found",
      });
      return;
    }

    const organization =
      await organizationService.getOrganizationByUserId(userId);
    if (!organization) {
      res.status(404).json({
        status: "failed",
        code: 404,
        message: "Organization not found",
      });
      return;
    }

    const tour = await tourService.createTour(
      userId,
      tourId,
      organization.organizationId,
      tourData,
    );
    res.status(201).json({
      status: "success",
      code: 201,
      message: "Tour created",
      data: tour,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      code: 500,
      message: "An unknown error occurred",
    });
  }
};

export const getTour = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userData?.userId;
    const tourId = req.params.tourId;

    if (!userId) {
      res.status(401).json({
        status: "failed",
        code: 401,
        message: "User ID not found",
      });
      return;
    }

    const organization =
      await organizationService.getOrganizationByUserId(userId);
    if (!organization) {
      res.status(404).json({
        status: "failed",
        code: 404,
        message: "Organization not found",
      });
      return;
    }

    const tour = await tourService.getTour(tourId, organization.organizationId);
    if (!tour) {
      res.status(404).json({
        status: "failed",
        code: 404,
        message: "Tour not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Tour fetched successfully",
      data: tour,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      code: 500,
      message: "An unknown error occurred",
    });
  }
};

export const updateTour = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userData?.userId;
    const tourId = req.params.tourId;
    const tourData = req.body.tourData;

    if (!userId) {
      res.status(401).json({
        status: "failed",
        code: 401,
        message: "User ID not found",
      });
      return;
    }

    const organization =
      await organizationService.getOrganizationByUserId(userId);
    if (!organization) {
      res.status(404).json({
        status: "failed",
        code: 404,
        message: "Organization not found",
      });
      return;
    }

    const updatedTour = await tourService.updateTour(
      tourId,
      organization.organizationId,
      tourData,
    );
    if (!updatedTour) {
      res.status(404).json({
        status: "failed",
        code: 404,
        message: "Tour not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Tour updated successfully",
      data: updatedTour,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      code: 500,
      message: "An unknown error occurred",
    });
  }
};

export const deleteTour = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userData?.userId;
    const tourId = req.params.tourId;

    if (!userId) {
      res.status(401).json({
        status: "failed",
        code: 401,
        message: "User ID not found",
      });
      return;
    }

    const organization =
      await organizationService.getOrganizationByUserId(userId);
    if (!organization) {
      res.status(404).json({
        status: "failed",
        code: 404,
        message: "Organization not found",
      });
      return;
    }

    const result = await tourService.deleteTour(
      tourId,
      organization.organizationId,
    );
    if (!result) {
      res.status(404).json({
        status: "failed",
        code: 404,
        message: "Tour not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Tour deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      code: 500,
      message: "An unknown error occurred",
    });
  }
};

export const getAllTours = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userData?.userId;

    if (!userId) {
      res.status(401).json({
        status: "failed",
        code: 401,
        message: "User ID not found",
      });
      return;
    }

    const organization =
      await organizationService.getOrganizationByUserId(userId);
    if (!organization) {
      res.status(404).json({
        status: "failed",
        code: 404,
        message: "Organization not found",
      });
      return;
    }
    const tours = await tourService.getAllTours(organization.organizationId);
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Tours fetched successfully",
      data: tours,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      code: 500,
      message: "An unknown error occurred",
    });
  }
};
