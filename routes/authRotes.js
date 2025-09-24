import express from "express";
import { register, login } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ------------------- Public Routes -------------------
router.post("/register", register);
router.post("/login", login);

// ------------------- Protected Route -------------------
router.get("/me", authMiddleware, (req, res) => {
    res.json({
        message: "Authorized user",
        user: req.user,
    });
});

export default router;
