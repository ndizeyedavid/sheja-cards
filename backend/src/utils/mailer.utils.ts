import transporter from '../config/mailer';

interface EmailTemplate {
  subject: string;
  html: string;
}

/**
 * Email templates for different scenarios
 */
export const emailTemplates = {
  welcomeStaff: (name: string, role: string, tempPassword: string): EmailTemplate => ({
    subject: 'Welcome to Sheja - Staff Account Created',
    html: `
      <h1>Welcome to Sheja!</h1>
      <p>Dear ${name},</p>
      <p>Your staff account has been created with the role of <strong>${role}</strong>.</p>
      <p>Please use the following temporary password to log in:</p>
      <h3>${tempPassword}</h3>
      <p>For security reasons, please change your password after your first login.</p>
      <p>Best regards,<br>The Sheja Team</p>
    `,
  }),

  resetPassword: (name: string, resetToken: string): EmailTemplate => ({
    subject: 'Sheja - Password Reset Request',
    html: `
      <h1>Password Reset Request</h1>
      <p>Dear ${name},</p>
      <p>We received a request to reset your password.</p>
      <p>Your password reset code is:</p>
      <h3>${resetToken}</h3>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br>The Sheja Team</p>
    `,
  }),

  verifyEmail: (name: string, otp: string): EmailTemplate => ({
    subject: 'Sheja - Email Verification',
    html: `
      <h1>Email Verification</h1>
      <p>Dear ${name},</p>
      <p>Your verification code is:</p>
      <h3>${otp}</h3>
      <p>This code will expire in 10 minutes.</p>
      <p>Best regards,<br>The Sheja Team</p>
    `,
  }),
};

/**
 * Send an email using a template
 * @param to - Recipient email address
 * @param template - Email template object
 * @returns Promise<boolean> indicating if email was sent successfully
 */
export const sendTemplatedEmail = async (
  to: string,
  template: EmailTemplate
): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: template.subject,
      html: template.html,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};