import type { Request, Response } from "express";

export class HealthController {
  // Health check endpoint
  static async healthCheck(req: Request, res: Response) {
    res.status(200).json({
      status: "UP",
      message: "Mobile Auth Server is running",
    });
  }
}
