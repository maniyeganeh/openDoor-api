import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    verifyConsultant,
    getAllUsers,
    deleteUser,
    createProject,
    updateProject,
    deleteProject,
    getAllRequests,
    getAllVisits,
    verifyDeveloper
} from "../controllers/adminController.js";

const router = express.Router();

// middleware ادمین
const adminAuth = [authMiddleware, (req, res, next) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
    next();
}];

// Users
router.get("/users", adminAuth, getAllUsers);
router.put("/verify-consultant/:consultantId", adminAuth, verifyConsultant);
router.put("/verify-developer/:developerId", verifyDeveloper);

router.delete("/users/:userId", adminAuth, deleteUser);

// Projects
router.post("/projects", adminAuth, createProject);
router.put("/projects/:projectId", adminAuth, updateProject);
router.delete("/projects/:projectId", adminAuth, deleteProject);

// Requests
router.get("/requests", adminAuth, getAllRequests);

// Visits
router.get("/visits", adminAuth, getAllVisits);

export default router;
