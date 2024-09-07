import express from "express";
import * as authController from "../../controllers/authController";
import authMiddleware from "../../middleware/authMiddleware";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.get("/me", authMiddleware, authController.getMe);

export default router;
