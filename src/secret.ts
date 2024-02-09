import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 8000;
export const ACCESS_SECRET = process.env.ACCESS_SECRET!;
export const REFRESH_SECRET = process.env.REFRESH_SECRET!;
export const SMTP_HOST = process.env.SMTP_HOST!;
export const SMTP_USER = process.env.SMTP_USER!;
export const SMTP_PASS = process.env.SMTP_PASS!;
