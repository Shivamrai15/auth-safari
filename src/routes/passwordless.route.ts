import { Router } from "express";
import { passwordlessLoginController, verifyOTPController } from "../controllers/passwordless.controller.js";

const router = Router();

// Passwordless Login
router.post("/passwordless/login", passwordlessLoginController);
router.post("/passwordless/verify-otp", verifyOTPController);

export default router;