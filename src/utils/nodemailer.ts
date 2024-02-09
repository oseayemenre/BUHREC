import nodemailer from "nodemailer";
import { SMTP_USER, SMTP_HOST, SMTP_PASS } from "../secret";

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});
