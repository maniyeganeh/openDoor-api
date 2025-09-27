import express from "express";
import {
    createVisit,
    getVisitsForConsultant,
    getVisitsForDeveloper,
    updateVisitStatus,
} from "../controllers/visitController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ------------------- Protected Routes -------------------
router.post("/", authMiddleware, createVisit); // مشاور
router.get("/consultant", authMiddleware, getVisitsForConsultant);
router.get("/developer", authMiddleware, getVisitsForDeveloper);
router.put("/:visitId", authMiddleware, updateVisitStatus); // سازنده

export default router;
