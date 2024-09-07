import express from "express";
import * as userController from "../../controllers/userController";
import authMiddleware from "../../middleware/authMiddleware";

const router = express.Router();

router.get("/me", authMiddleware, userController.getMe);
router.put("/me", authMiddleware, userController.putMe);

export default router;
