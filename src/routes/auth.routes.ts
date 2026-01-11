import { Router } from "express";
import { loginController } from "../controllers/login.controller.js";
import { registerController } from "../controllers/register.controller.js";
import { refreshTokenController } from "../controllers/refresh.controller.js";
import passport from "passport";
import { AuthController } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.post("/refresh", refreshTokenController);

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