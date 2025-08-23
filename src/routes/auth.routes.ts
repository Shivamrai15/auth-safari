import { Router } from "express";
import passport from "passport";
import { AuthController } from "../controllers/auth.controller.js";
import { login } from "../controllers/login.controller.js";
import { register } from "../controllers/register.controller.js";

const router = Router();

// Email/Password Login
router.post("/login", login);
router.post("/register", register);

// Google OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  AuthController.googleCallback
);

export default router;
