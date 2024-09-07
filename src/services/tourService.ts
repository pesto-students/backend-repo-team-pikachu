import * as databaseService from "./databaseService";

export const createTour = async (
  userId: number,
  tourId: string,
  organizationId: number,
  tourData: object,
) => {
  const tour = await databaseService.createTour(
    userId,
    tourId,
    organizationId,
    tourData,
  );
  return tour;
};

export const getTour = async (tourId: string, organizationId: number) => {
  const tour = await databaseService.getTour(tourId, organizationId);
  return tour;
};

export const updateTour = async (
  tourId: string,
  organizationId: number,
  tourData: object,
) => {
  const updatedTour = await databaseService.updateTour(
    tourId,
    organizationId,
    tourData,
  );
  return updatedTour;
};

export const deleteTour = async (tourId: string, organizationId: number) => {
  const result = await databaseService.deleteTour(tourId, organizationId);
  return result;
};

export const getAllTours = async (organizationId: number) => {
  const tours = await databaseService.getAllTours(organizationId);
  return tours;
};
