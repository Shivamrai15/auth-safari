import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET } from "../config/constants.js";
import { db } from "../lib/db.js";


function verifyToken(token: string) {
    try {
        
        const decoded = jwt.verify(token, JWT_REFRESH_SECRET!);
        return decoded;

    } catch (error) {
        return null;
    }
}


export async function logoutController(req: Request, res: Response) {
    try {
        
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await db.session.deleteMany({
            where : {
                sessionToken : token
            }
        });

        return res.status(200).json({ message: "Logged out successfully" });
        
    } catch (error) {
        console.error("LOGOUT GET API ERROR", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}