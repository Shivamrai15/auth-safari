import type { Request, Response } from "express";
import { db } from "../lib/db.js";
import { PasswordlessLoginSchema, VerifyOTPSchema } from "../lib/schemas.js";
import { generateOTP, verifyOTP } from "../lib/otp.js";
import { sendOTPEmail } from "../lib/mail.js";
import { JWT_SECRET } from "../config/constants.js";
import jwt from "jsonwebtoken";


export async function passwordlessLoginController(req: Request, res: Response) {
    try {
        const body = req.body;
        const validatedData = await PasswordlessLoginSchema.safeParseAsync(body);
        if (!validatedData.success) {
            return res.status(400).json({
                status: false,
                message: "Invalid email address!",
                data: {},
            });
        }

        const { email } = validatedData.data;
        const user = await db.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "Account does not exist!",
                data: {},
            });
        }
        
        const otp = await generateOTP(email);
        await sendOTPEmail(email, otp);

        return res.status(200).json({
            status: true,
            message: "OTP has been sent to your email!",
            data: {},
        });


    } catch (error) {
        console.error("PASSWORDLESS LOGIN ERROR", error);
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            data: {},
        });
    }
}

export async function verifyOTPController(req: Request, res: Response) {
    try {

        const body = req.body;
        const validatedData = await VerifyOTPSchema.safeParseAsync(body);
        if (!validatedData.success) {
            return res.status(400).json({
                status: false,
                message: "Invalid data provided!",
                data: {},
            });
        }

        const { email, otp } = validatedData.data;
        const isOTPValid = await verifyOTP(email, otp);
        if (!isOTPValid) {
            return res.status(400).json({
                status: false,
                message: "Invalid or expired OTP!",
                data: {},
            });
        }
        const user = await db.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "Account does not exist!",
                data: {},
            });
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
            },
            JWT_SECRET,
            { 
                expiresIn: "30d"
            }
        );
    
        return res.status(200).json({
            status: true,
            message: "Login successful",
            data: {
                    token,
                    user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    emailVerified: user.emailVerified,
                    createdAt: user.createdAt,
                },
            },
        });

    }   catch (error) {
        console.error("VERIFY OTP ERROR", error);
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            data: {},
        });
    }
}