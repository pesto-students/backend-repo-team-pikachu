import dotenv from "dotenv";
dotenv.config();

import express from "express";
import authRoutes from "./routes/v1/authRoutes";
import userRoutes from "./routes/v1/userRoutes";
import organizationRoutes from "./routes/v1/organizationRoutes";
import healthRoutes from "./routes/v1/healthRoutes";
import tourRoutes from "./routes/v1/tourRoutes";

const app = express();

app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/v1/health", healthRoutes);
app.use("/v1/auth", authRoutes);
app.use("/v1/user", userRoutes);
app.use("/v1/organization", organizationRoutes);
app.use("/v1/tour", tourRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
