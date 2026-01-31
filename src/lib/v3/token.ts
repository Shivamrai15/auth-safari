import jwt from "jsonwebtoken";
import crypto from "crypto";
import { redis } from "../redis.js";

import {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET
} from "../../config/constants.js";

export interface LoginPayload {
  userId: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const ACCESS_TOKEN_TTL_SECONDS = 24 * 60 * 60;
const REFRESH_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60;

export class TokenManager {

    private static generateJTI(): string {
        return crypto.randomUUID();
    }

    static async generateOnLogin(
        payload: LoginPayload
    ): Promise<AuthTokens> {

        const { userId, email } = payload;
        const jti = this.generateJTI();
        const now = Math.floor(Date.now() / 1000);

        const accessToken = jwt.sign(
            {
                userId,
                email,
                iat: now,
                exp: now + ACCESS_TOKEN_TTL_SECONDS
            },
            JWT_ACCESS_SECRET!
        );

        const refreshToken = jwt.sign(
            {
                userId,
                email,
                jti,
                iat: now,
                exp: now + REFRESH_TOKEN_TTL_SECONDS
            },
            JWT_REFRESH_SECRET!
        );

        const pipeline = redis.multi();

        pipeline.set(
            `refresh:${jti}`,
            JSON.stringify({
                userId,
                email,
                createdAt: Date.now()
            }),
            {
                EX: REFRESH_TOKEN_TTL_SECONDS
            }
        );

        pipeline.sAdd(`user_sessions:${userId}`, jti);

        await pipeline.exec();

        return {
            accessToken,
            refreshToken
        };
    }
}
