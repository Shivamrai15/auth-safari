import type { Request, Response } from "express";

export class UserController {
  // Get current user session
  static async getSession(req: any, res: Response) {
    res.json({
      success: true,
      user: req.user,
    });
  }

  // Get user profile
  static async getProfile(req: any, res: Response) {
    res.json({
      success: true,
      user: req.user,
    });
  }

  // Logout user
  static async logout(req: Request, res: Response) {
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  }
}
