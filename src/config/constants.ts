export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export const PORT = process.env.PORT || 3002;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;


export const EMAIL_VERIFICATION_KEY = process.env.EMAIL_VERIFICATION_KEY;
export const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

export const MOBILE_DEEP_LINK = {
    SUCCESS: "safarimusic://sign-in/",
    ERROR: "safarimusic://sign-in/",
};
