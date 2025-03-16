import ejs from 'ejs';
import nodemailer from 'nodemailer';
import { getEmailTemplatePath } from '../lib/utils.js';
export class EmailService {
  static instance;
  transporter;
  emailFrom;
  emailActive;
  constructor() {
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;
    const emailPortParsed = process.env.EMAIL_PORT;
    const emailHost = process.env.EMAIL_HOST;
    const emailFrom = process.env.EMAIL_FROM;
    const emailActive = process.env.EMAIL_ACTIVE === 'true';
    const secure = emailPortParsed === '465';
    this.emailFrom = emailFrom;
    this.emailActive = emailActive;
    this.transporter = nodemailer.createTransport({
      host: emailHost,
      port: parseInt(emailPortParsed),
      secure: secure,
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });
  }
  static getInstance() {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }
  async sendEmail({ to, subject, text, html }) {
    try {
      if (!this.emailActive) {
        return { success: true };
      }
      await this.transporter.sendMail({
        from: this.emailFrom,
        to,
        subject,
        text,
        html,
      });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }
  async sendOtpEmail({ name, email, otp }) {
    const templatePath = getEmailTemplatePath('otp.ejs');
    const html = await ejs.renderFile(templatePath, {
      name,
      otp,
    });
    return this.sendEmail({
      to: email,
      subject: 'You requested an OTP',
      html: html,
    });
  }
}
