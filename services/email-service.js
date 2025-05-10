import ejs from 'ejs';
import nodemailer from 'nodemailer';
import { getEmailTemplatePath } from '../lib/utils.js';
export class EmailService {
  /** @type {EmailService} */
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

  /**
   * @param {Object} param0
   * @param {string} param0.to
   * @param {string} param0.subject
   * @param {string} [param0.text]
   * @param {string} param0.html
   * @returns {Promise<{success: boolean}>}
   * */
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

  /**
   * @param {Object} param0
   * @param {string} param0.name
   * @param {string} param0.email
   * @param {string} param0.otp
   * @returns {Promise<{success: boolean}>}
   * */
  async sendOtpEmail({ name, email, otp }) {
    console.log('LOGIN OTP', otp);
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

  /**
   * @param {Object} param0
   * @param {string} param0.name
   * @param {string} param0.email
   * @param {string} param0.otp
   * @returns {Promise<{success: boolean}>}
   * */
  async sendResetPasswordOtp({ name, email, otp }) {
    console.log('RESET PASSWORD OTP', otp);
    const templatePath = getEmailTemplatePath('reset-pw-otp.ejs');
    const html = await ejs.renderFile(templatePath, {
      name,
      otp,
    });
    return this.sendEmail({
      to: email,
      subject: 'You requested a password reset OTP',
      html: html,
    });
  }
}
