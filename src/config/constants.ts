export const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
export const PORT = process.env.PORT || 3002;
export const BASE_URL = process.env.BASE_URL;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const VERIFICATION_BASE = process.env.VERIFICATION_BASE;

export const VERIFICATION_SECRET = process.env.VERIFICATION_SECRET;
export const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
export const EMAIL_CREDENTIALS = process.env.EMAIL_CREDENTIALS;

export const MOBILE_DEEP_LINK = {
  SUCCESS: "safari://auth/success",
  ERROR: "safari://auth/error",
};
