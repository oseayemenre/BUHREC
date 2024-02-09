import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 465,
  auth: {
    user: "oseayemenre04@gmail.com",
    pass: "mA0fOn6EH4Wp5Mrx",
  },
});
