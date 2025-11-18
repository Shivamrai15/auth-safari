import * as z from "zod";

export const RegistrationSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.email(),
  password: z.string().min(6, {
    message: "Minimum 6 characters are required",
  }),
});

export const LoginSchema = z.object({
  email: z.email({
    message: "Your email is required",
  }),
  password: z.string().min(1, {
    message: "Your password is required",
  }),
  token: z.string().optional(),
});


export const PasswordlessLoginSchema = z.object({
  email: z.email(),
});

export const VerifyOTPSchema = z.object({
  email: z.email(),
  otp: z.string().length(6, { message: "OTP must be 6 characters long" }).regex(/^\d{6}$/, { message: "OTP must be a 6-digit number" }),
});
