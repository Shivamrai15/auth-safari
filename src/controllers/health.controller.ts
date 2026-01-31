import type { Request, Response } from "express";

export class HealthController {
    static async healthCheck(req: Request, res: Response) {
        return res.status(200).json({
            status: "healthy",
            service: "Authentication Server API",
            version: "2.0.0",
        });
    }
}
