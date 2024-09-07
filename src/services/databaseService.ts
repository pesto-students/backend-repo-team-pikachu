import pool from "../config/database";

import User from "../models/User";
import Organization from "../models/Organization";
import Tour from "../models/Tour";

async function initDatabase() {
  let conn;
  try {
    conn = await pool.getConnection();

    await conn.execute("CREATE DATABASE IF NOT EXISTS travelsuite");

    await conn.query("USE travelsuite");

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS organizations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        address TEXT,
        website VARCHAR(255),
        phone VARCHAR(20),
        logo_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        updated_by INT
      )
    `);

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL UNIQUE,
        hashed_password VARCHAR(255) NOT NULL,
        organization_id INT,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        phone VARCHAR(20),
        profile_image_url VARCHAR(255),
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        updated_by INT,
        FOREIGN KEY (organization_id) REFERENCES organizations(id)
      )
    `);

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS tours (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tour_id VARCHAR(255) NOT NULL UNIQUE,
        organization_id INT,
        tour_data JSON NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by INT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        updated_by INT,
        FOREIGN KEY (organization_id) REFERENCES organizations(id)
      );
    `);

    console.log("Database and tables initialized successfully");
  } catch (err) {
    console.error("Error initializing database:", err);
  } finally {
    if (conn) conn.release();
  }
}

export const createOrganization = async (
  userId: number,
  name: string,
  description?: string,
  address?: string,
  website?: string,
  phone?: string,
  logoURL?: string,
): Promise<Organization> => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.execute(
      `
      INSERT INTO organizations(
        name,
        description,
        address,
        website,
        phone,
        logo_url,
        created_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, description, address, website, phone, logoURL, userId],
    );

    const organizationId = (result as any).insertId;

    return new Organization(
      organizationId,
      name,
      description,
      address,
      website,
      phone,
      logoURL,
    );
  } finally {
    conn.release();
  }
};

export const updateOrganization = async (
  userId: number,
  id: number,
  name: string,
  description?: string,
  address?: string,
  website?: string,
  phone?: string,
  logoURL?: string,
): Promise<Organization> => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.execute(
      `
      UPDATE organizations SET
        name = ?,
        description = ?,
        address = ?,
        website = ?,
        phone = ?,
        logo_url = ?,
        updated_by = ?
      WHERE id = ?`,
      [name, description, address, website, phone, logoURL, userId, id],
    );

    if ((result as any).affectedRows === 0) {
      throw new Error("Organization not found");
    }

    return new Organization(
      id,
      name,
      description,
      address,
      website,
      phone,
      logoURL,
    );
  } finally {
    conn.release();
  }
};

export const getOrganizationById = async (
  id: number,
): Promise<Organization | null> => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.execute(
      "SELECT * FROM organizations WHERE id = ?",
      [id],
    );
    if ((rows as any[]).length === 0) return null;
    const org = (rows as any[])[0];
    return new Organization(
      org.id,
      org.name,
      org.description,
      org.address,
      org.website,
      org.phone,
    );
  } finally {
    conn.release();
  }
};

export const getOrganizationLogo = async (
  id: number,
): Promise<Buffer | null> => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.execute(
      "SELECT logo FROM organizations WHERE id = ?",
      [id],
    );
    if ((rows as any[]).length === 0) return null;
    return (rows as any[])[0].logo;
  } finally {
    conn.release();
  }
};

export const createUser = async (
  email: string,
  hashedPassword: string,
  firstName: string,
  lastName: string,
): Promise<User> => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.execute(
      `
      INSERT INTO users (email, hashed_password, first_name, last_name)
      VALUES (?, ?, ?, ?)
      `,
      [email, hashedPassword, firstName, lastName],
    );

    const userId = (result as any).insertId;

    return new User(
      userId,
      email,
      "",
      undefined,
      firstName,
      lastName,
      undefined,
      undefined,
    );
  } finally {
    conn.release();
  }
};

export const upsertUser = async (
  email: string,
  firstName?: string,
  lastName?: string,
  id?: number,
  phone?: string,
  organizationId?: number,
  profileImageURL?: string,
): Promise<User> => {
  const conn = await pool.getConnection();
  try {
    let userId: number;

    if (id) {
      const [result] = await conn.execute(
        `
        UPDATE users SET
          email = ?,
          organization_id = ?,
          first_name = ?,
          last_name = ?,
          phone = ?,
          profile_image_url = ?
        WHERE id = ?`,
        [
          email,
          organizationId || null,
          firstName || null,
          lastName || null,
          phone || null,
          profileImageURL || null,
          id,
        ],
      );

      if ((result as any).affectedRows === 0) {
        throw new Error("User not found");
      }
      userId = id;
    } else {
      const [result] = await conn.execute(
        `
        INSERT INTO users(
          email,
          organization_id,
          first_name,
          last_name,
          phone,
          profile_image_url,
        )
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          email,
          organizationId || null,
          firstName || null,
          lastName || null,
          phone || null,
          profileImageURL || null,
        ],
      );
      userId = (result as any).insertId;
    }

    // Fetch the user to get the current hashed_password
    const user = await getUserById(userId);
    if (!user) {
      throw new Error("User not found after upsert");
    }

    return new User(
      userId,
      email,
      user.hashed_password,
      organizationId,
      firstName,
      lastName,
      phone,
      profileImageURL,
    );
  } finally {
    conn.release();
  }
};

export const upsertUserPassword = async (
  id: number,
  hashed_password: string,
): Promise<User> => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.execute(
      `
      UPDATE users SET
        hashed_password = ?
      WHERE id = ?`,
      [hashed_password, id],
    );

    if ((result as any).affectedRows === 0) {
      throw new Error("User not found");
    }

    // Fetch the updated user
    const user = await getUserById(id);
    if (!user) {
      throw new Error("User not found after password update");
    }

    return user;
  } finally {
    conn.release();
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if ((rows as any[]).length === 0) return null;
    const user = (rows as any[])[0];
    return new User(
      user.id,
      user.email,
      user.hashed_password,
      user.organization_id,
      user.first_name,
      user.last_name,
      user.phone,
    );
  } finally {
    conn.release();
  }
};

export const getUserById = async (id: number): Promise<User | null> => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.execute("SELECT * FROM users WHERE id = ?", [id]);
    if ((rows as any[]).length === 0) return null;
    const user = (rows as any[])[0];
    return new User(
      user.id,
      user.email,
      user.hashed_password,
      user.organization_id,
      user.first_name,
      user.last_name,
      user.phone,
    );
  } finally {
    conn.release();
  }
};

export const getOrganizationByUserId = async (
  userId: number,
): Promise<Organization | null> => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.execute(
      "SELECT * FROM organizations WHERE id = (SELECT organization_id FROM users WHERE id = ?)",
      [userId],
    );
    if ((rows as any[]).length === 0) return null;
    const org = (rows as any[])[0];
    return new Organization(
      org.id,
      org.name,
      org.description,
      org.address,
      org.website,
      org.phone,
    );
  } finally {
    conn.release();
  }
};

export const insertOrganizationToUser = async (
  userId: number,
  organizationId: number,
): Promise<void> => {
  const conn = await pool.getConnection();
  try {
    await conn.execute("UPDATE users SET organization_id = ? WHERE id = ?", [
      organizationId,
      userId,
    ]);
  } finally {
    conn.release();
  }
};

export const createTour = async (
  userId: number,
  tourId: string,
  organizationId: number,
  tourData: object,
): Promise<Tour> => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.execute(
      `
      INSERT INTO tours (tour_id, organization_id, tour_data, created_by)
      VALUES (?, ?, ?, ?)
      `,
      [tourId, organizationId, tourData, userId],
    );
    return new Tour((result as any).insertId, tourId, organizationId, tourData);
  } finally {
    conn.release();
  }
};

export const getTour = async (
  tourId: string,
  organizationId: number,
): Promise<Tour | null> => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.execute(
      "SELECT * FROM tours WHERE tour_id = ? AND organization_id = ?",
      [tourId, organizationId],
    );
    const tourData = (rows as any[])[0];
    if (!tourData) return null;
    return new Tour(
      tourData.id,
      tourData.tour_id,
      tourData.organization_id,
      tourData.tour_data,
    );
  } finally {
    conn.release();
  }
};

export const updateTour = async (
  tourId: string,
  organizationId: number,
  tourData: object,
): Promise<Tour | null> => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.execute(
      `
      UPDATE tours
      SET tour_data = ?
      WHERE tour_id = ? AND organization_id = ?
      `,
      [tourData, tourId, organizationId],
    );
    if ((result as any).affectedRows === 0) return null;
    return new Tour((result as any).insertId, tourId, organizationId, tourData);
  } finally {
    conn.release();
  }
};

export const deleteTour = async (
  tourId: string,
  organizationId: number,
): Promise<boolean> => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.execute(
      "UPDATE tours SET status = 'Deleted' WHERE tour_id = ? AND organization_id = ?",
      [tourId, organizationId],
    );
    return (result as any).affectedRows > 0;
  } finally {
    conn.release();
  }
};

export const getAllTours = async (organizationId: number): Promise<Tour[]> => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.execute(
      "SELECT * FROM tours WHERE organization_id = ? AND status != 'Deleted'",
      [organizationId],
    );
    const tours = (rows as any[]).map(
      (tour) =>
        new Tour(tour.id, tour.tour_id, tour.organization_id, tour.tour_data),
    );
    return tours;
  } finally {
    conn.release();
  }
};

// Initialize the database when this module is imported
initDatabase().catch(console.error);
