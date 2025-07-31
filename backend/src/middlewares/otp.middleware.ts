import { Request, Response, NextFunction } from 'express';
import { generateOTP, verifyOTP } from '../utils/otp.utils';
import { sendMail } from '../config/mailer';

/**
 * Middleware to generate and send OTP via email
 */
export const sendOTPMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    // Generate OTP
    const { otp, expiresAt } = generateOTP();

    // Store OTP in request for next middleware
    req.body.otp = otp;
    req.body.otpExpiresAt = expiresAt;

    // Send OTP via email
    const html = `
      <h1>Email Verification</h1>
      <p>Your verification code is: <strong>${otp}</strong></p>
      <p>This code will expire in 10 minutes.</p>
    `;

    await sendMail(email, 'Email Verification Code', html);

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to verify OTP
 */
export const verifyOTPMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { otp, storedOTP, otpExpiresAt } = req.body;

    if (!otp || !storedOTP || !otpExpiresAt) {
      return res.status(400).json({
        message: 'OTP verification failed: Missing required fields',
      });
    }

    const isValid = verifyOTP(otp, storedOTP, new Date(otpExpiresAt));

    if (!isValid) {
      return res.status(400).json({
        message: 'Invalid or expired OTP',
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};