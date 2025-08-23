import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";

const router = Router();

// Main mobile auth endpoint
router.get("/google", AuthController.redirectToGoogle);

export default router;
