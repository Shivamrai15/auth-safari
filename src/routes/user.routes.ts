import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = Router();

// Session endpoint for mobile apps to verify tokens
router.get("/session", authenticateJWT, UserController.getSession);

// User profile endpoint
router.get("/profile", authenticateJWT, UserController.getProfile);

// Logout endpoint
router.post("/logout", authenticateJWT, UserController.logout);

export default router;
