import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import healthRoutes from "./health.routes.js";
import mobileRoutes from "./mobile.routes.js";

const router = Router();

// Mount routes
router.use("/api/auth", authRoutes);
router.use("/api/v2", userRoutes);
router.use("/api/v2", healthRoutes);
router.use("/auth", mobileRoutes);

export default router;
