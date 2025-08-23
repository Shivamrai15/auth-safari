import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { LoginSchema } from "../lib/schemas.js";
import { db } from "../lib/db.js";
import { generateVerificationToken } from "../lib/token.js";
import { sendVerificationEmail } from "../lib/mail.js";
import { JWT_SECRET } from "../config/constants.js";

export async function login(req: Request, res: Response) {
  try {
    const validatedData = await LoginSchema.safeParseAsync(req.body);
    if (!validatedData.success) {
      return res.status(400).json({
        status: false,
        message: "Invalid credentials!",
        data: {},
      });
    }

    const { email, password } = validatedData.data;

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !user.password) {
      return res.status(404).json({
        status : false,
        message: "Account does not exist!",
        data : {}
      });
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
      return res.status(401).json({
        status: false,
        message: "Invalid credentials!",
        data: {},
      });
    }

    if (!user.accountVerified) {
      const verificationToken = await generateVerificationToken(user.email);
      if (!verificationToken) {
        return res.status(500).json({
          status: false,
          message: "Failed to generate verification token",
          data: {},
        });
      }

      await sendVerificationEmail(
        user.email,
        user?.name || "User",
        verificationToken
      );
      return res.status(400).json({
        status: true,
        message: "Verification email has been sent",
        data: {},
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({
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
  } catch (error) {
    console.error("LOGIN API ERROR", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      data: {},
    });
  }
}
