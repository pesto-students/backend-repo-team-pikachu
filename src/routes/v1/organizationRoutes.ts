import express from "express";
import * as organizationController from "../../controllers/organizationController";
import authMiddleware from "../../middleware/authMiddleware";

const router = express.Router();

router.get("/me", authMiddleware, organizationController.getMe);
router.post("/me", authMiddleware, organizationController.postMe);
router.put("/me", authMiddleware, organizationController.putMe);

export default router;
