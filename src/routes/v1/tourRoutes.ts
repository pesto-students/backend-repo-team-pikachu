import express from "express";
import * as tourController from "../../controllers/tourController";
import authMiddleware from "../../middleware/authMiddleware";

const router = express.Router();

router.post("/create", authMiddleware, tourController.createTour);
router.get("/get/:tourId", authMiddleware, tourController.getTour);
router.put("/update/:tourId", authMiddleware, tourController.updateTour);
router.delete("/delete/:tourId", authMiddleware, tourController.deleteTour);
router.get("/all", authMiddleware, tourController.getAllTours);

export default router;
