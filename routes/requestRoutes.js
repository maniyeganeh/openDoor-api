import express from "express";
import {
    createRequest,
    getRequestsForConsultant,
    getRequestsForDeveloper,
    updateRequestStatus,
} from "../controllers/requestController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/", authMiddleware, createRequest);


router.get("/consultant", authMiddleware, getRequestsForConsultant);

router.get("/developer", authMiddleware, getRequestsForDeveloper);


router.patch("/:requestId/status", authMiddleware, updateRequestStatus);

export default router;
