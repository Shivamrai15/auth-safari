import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import healthRoutes from "./health.routes.js";
import mobileRoutes from "./mobile.routes.js";
import passwordlessRoutes from "./passwordless.route.js";

const router = Router();

// Mount routes
router.use("/api/auth", authRoutes);
router.use("/api/v2", userRoutes);
router.use("/api/v2", healthRoutes);
router.use("/auth", mobileRoutes);
router.use("/api/v2", passwordlessRoutes)

export default router;
