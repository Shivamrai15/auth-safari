import nodemailer from "nodemailer";
import { emailVerificationTemplate } from "./templates.js";
import {
  EMAIL_CREDENTIALS,
  EMAIL_USERNAME,
  VERIFICATION_BASE,
} from "../config/constants.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USERNAME,
    pass: EMAIL_CREDENTIALS,
  },
});

export const sendVerificationEmail = async (
  email: string,
  name: string,
  token: string
) => {
  try {
    const verificationUrl = `${VERIFICATION_BASE}/verification?token=${token}`;
    await transporter.sendMail({
      from: EMAIL_USERNAME,
      to: email,
      subject: "Verify your email",
      html: emailVerificationTemplate(verificationUrl),
    });
  } catch (error) {
    console.error("NODEMAILER VERIFICATION EMAIL ERROR", email);
  }
};
