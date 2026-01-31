import type { Request, Response } from "express";
import { MOBILE_DEEP_LINK } from "../config/constants.js";
// import { generateAuthTokens } from "../lib/token.js";

import { db } from "../lib/db.js";
import { TokenManager } from "../lib/v3/token.js";

export class AuthController {
    static async googleCallback(req: any, res: Response) {
        try {

            const tokens = await TokenManager.generateOnLogin({
                userId: req.user.id,
                email: req.user.email,
            });

            // await db.session.create({
            //     data : {
            //         userId : req.user.id,
            //         sessionToken : tokens.refreshToken,
            //         expires : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            //     }
            // });

            const user = await db.user.findUnique({
                where: { id: req.user.id },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    image: true,
                    emailVerified: true,
                    createdAt: true,
                },
            });

            if (!user) {
                return res.redirect(
                    `${MOBILE_DEEP_LINK.ERROR}?message=User not found`
                );
            }

            const params = {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                id: user.id,
                email: user.email,
                name: user.name ?? '',
                image: user.image ?? '',
                emailVerified: user.emailVerified?.toISOString() ?? '',
                createdAt: user.createdAt.toISOString(),
            };

            const queryString = new URLSearchParams(params).toString();
            return res.redirect(`${MOBILE_DEEP_LINK.SUCCESS}?${queryString}`);
        
        } catch (error) {
            console.error("Callback error:", error);
            return res.redirect(
                `${MOBILE_DEEP_LINK.ERROR}?message=Authentication failed`
            );
        }
    }

    static async redirectToGoogle(req: Request, res: Response) {
        console.log("Mobile app requesting Google OAuth");
        res.redirect("/auth/google");
    }
}