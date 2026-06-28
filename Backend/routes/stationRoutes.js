import express from "express";
import { createStation, deleteStation, getstation, updateStation } from "../controllers/stationController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createStation);
router.get("/",protect,getstation),
router.put("/:id",protect,updateStation)
router.delete("/:id",protect,deleteStation)

export default router;