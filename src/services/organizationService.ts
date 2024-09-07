import * as databaseService from "./databaseService";

export const getOrganizationByUserId = async (userId: number) => {
  const organization = await databaseService.getOrganizationByUserId(userId);
  if (!organization) {
    throw new Error("Organization not found");
  } else if (organization) {
    const {
      id: organizationId,
      name,
      description,
      address,
      website,
      phone,
    } = organization;
    return {
      organizationId,
      name,
      description,
      address,
      website,
      phone,
    };
  }
};

export const createOrganization = async (
  userId: number,
  name: string,
  description: string,
  address: string,
  website: string,
  phone: string,
  logoURL: string,
) => {
  const organization = await databaseService.createOrganization(
    userId,
    name,
    description,
    address,
    website,
    phone,
    logoURL,
  );
  if (!organization) {
    throw new Error("Organization not found");
  } else if (organization) {
    await databaseService.insertOrganizationToUser(userId, organization.id);
    const {
      id: organizationId,
      name,
      description,
      address,
      website,
      phone,
    } = organization;
    return {
      organizationId,
      name,
      description,
      address,
      website,
      phone,
    };
  }
};

export const updateOrganization = async (
  userId: number,
  organizationId: number,
  name: string,
  description: string,
  address: string,
  website: string,
  phone: string,
) => {
  const organization = await databaseService.updateOrganization(
    userId,
    organizationId,
    name,
    description,
    address,
    website,
    phone,
  );
  if (!organization) {
    throw new Error("Organization not found");
  } else if (organization) {
    const {
      id: organizationId,
      name,
      description,
      address,
      website,
      phone,
    } = organization;
    return {
      organizationId,
      name,
      description,
      address,
      website,
      phone,
    };
  }
};
