import express from "express";
import {
    createProject,
    getProjects,
    getMyProjects,
    getProjectById,
    updateProject,
    deleteProject
} from "../controllers/projectController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ------------------- Public Routes -------------------
router.get("/", getProjects);
router.get("/:id", getProjectById);

// ------------------- Protected Routes -------------------
router.post("/", authMiddleware, createProject);
router.get("/me/my-projects", authMiddleware, getMyProjects);
router.put("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);

export default router;
