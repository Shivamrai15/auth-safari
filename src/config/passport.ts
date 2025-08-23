import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { db } from "../lib/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Google OAuth Strategy
passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const googleId = profile.id;
        const name = profile.displayName;
        const image = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error("No email found in Google profile"), false);
        }

        // Check if user exists by email
        let user = await db.user.findUnique({
          where: { email },
          include: {
            accounts: true,
          },
        });

        if (!user) {
          // Create new user with Google account
          user = await db.user.create({
            data: {
              email,
              name,
              image: image || null,
              emailVerified: new Date(),
              accounts: {
                create: {
                  type: "oauth",
                  provider: "google",
                  providerAccountId: googleId,
                  access_token: accessToken,
                  refresh_token: refreshToken,
                  token_type: "Bearer",
                },
              },
            },
            include: {
              accounts: true,
            },
          });
        } else {
          // Check if Google account is already linked
          const existingGoogleAccount = user.accounts.find(
            (account) =>
              account.provider === "google" &&
              account.providerAccountId === googleId
          );

          if (!existingGoogleAccount) {
            // Link Google account to existing user
            await db.account.create({
              data: {
                userId: user.id,
                type: "oauth",
                provider: "google",
                providerAccountId: googleId,
                access_token: accessToken,
                refresh_token: refreshToken,
                token_type: "Bearer",
              },
            });
          } else {
            // Update existing Google account tokens
            await db.account.update({
              where: { id: existingGoogleAccount.id },
              data: {
                access_token: accessToken,
                refresh_token: refreshToken,
              },
            });
          }

          // Update user profile with latest Google info
          user = await db.user.update({
            where: { id: user.id },
            data: {
              name: name || user.name,
              image: image || user.image,
              emailVerified: user.emailVerified || new Date(),
            },
            include: {
              accounts: true,
            },
          });
        }

        return done(null, user as any);
      } catch (error) {
        console.error("Google OAuth error:", error);
        return done(error, false);
      }
    }
  )
);

// JWT Strategy
passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await db.user.findUnique({
          where: { id: payload.userId },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            emailVerified: true,
            showRecommendations: true,
            privateSession: true,
            createdAt: true,
          },
        });

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;
