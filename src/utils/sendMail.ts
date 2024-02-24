import { ISendMail } from "../interfaces/sendMail.interface";
import { transporter } from "./nodemailer";

export const sendmail = async (data: ISendMail) => {
  await transporter.sendMail({
    from: '"BUHREC" <info@buhrec.com>',
    to: data.email,
    subject: "Your BUHREC Login Information",
    html: `<p>Dear ${data.name},</p>
          <p>We hope this message finds you well. As part of our ongoing efforts to provide a seamless user experience, we're sharing your login credentials for BUHREC:</p>
          <p>Username: <b>${data.username}</b></p>
          <p>Password: <b>${data.password}</b></p>
          <p>For security reasons, we recommend logging in and updating your password at your earliest convenience.</p>
          <p>Thank you for being a valued member of BUHREC.</p>
          <p>Best regards,</p>
          <p>BUHREC</p>
          `,
  });
};
