import express from "express";

const router = express.Router();

router.get("/status", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is up and running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
