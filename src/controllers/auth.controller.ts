import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET, MOBILE_DEEP_LINK } from "../config/constants.js";

export class AuthController {
  // Handle Google OAuth callback
  static async googleCallback(req: any, res: Response) {
    try {
      const token = jwt.sign(
        {
          userId: req.user.id,
          email: req.user.email,
        },
        JWT_SECRET,
        { expiresIn: "30d" }
      );

      console.log("Authentication successful, redirecting to mobile app");

      // Always redirect to mobile app with token
      return res.redirect(`${MOBILE_DEEP_LINK.SUCCESS}?token=${token}`);
    } catch (error) {
      console.error("Callback error:", error);

      // Redirect to mobile app with error
      return res.redirect(
        `${MOBILE_DEEP_LINK.ERROR}?message=Authentication failed`
      );
    }
  }

  // Redirect to Google OAuth
  static async redirectToGoogle(req: Request, res: Response) {
    console.log("Mobile app requesting Google OAuth");
    res.redirect("/api/auth/google");
  }
}
