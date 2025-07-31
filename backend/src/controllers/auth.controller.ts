import { Request, Response } from "express";
import Staff from "../models/staff.model";
import School from "../models/school.model";
import { hashPassword } from "../helpers/bcrypt.helper";
import { generateToken } from "../helpers/jwt.helper";
import { generateOTP } from "../utils/otp.utils";
import { emailTemplates, sendTemplatedEmail } from "../utils/mailer.utils";
import { env } from "../config/env";

/**
 * Register new staff member
 */
export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, schoolId } = req.body;

        // Check if school exists
        const school = await School.findById(schoolId);
        if (!school) {
            return res.status(404).json({
                message: "School not found",
            });
        }

        // Check if email is already registered
        const existingStaff = await Staff.findOne({ email });
        if (existingStaff) {
            return res.status(400).json({
                message: "Email already registered",
            });
        }

        // Generate temporary password if not provided
        const finalPassword = password || Math.random().toString(36).slice(-8);
        const hashedPassword = await hashPassword(finalPassword);

        // Create staff member
        const staff = await Staff.create({
            name,
            email,
            password: hashedPassword,
            role,
            school: schoolId,
        });

        // Generate OTP for email verification
        const { otp, expiresAt } = generateOTP();
        staff.emailVerificationToken = otp;
        staff.emailVerificationExpires = expiresAt;
        await staff.save();

        // Send welcome email with credentials
        await sendTemplatedEmail(
            email,
            emailTemplates.welcomeStaff(name, role, finalPassword)
        );

        // Send verification email
        await sendTemplatedEmail(email, emailTemplates.verifyEmail(name, otp));

        res.status(201).json({
            message:
                "Staff registered successfully. Please check your email for verification.",
            data: {
                id: staff._id,
                name: staff.name,
                email: staff.email,
                role: staff.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Error registering staff",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};

/**
 * Login staff member
 */
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Find staff member and include password field
        const staff = await Staff.findOne({ email }).select("+password");
        if (!staff) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        // Check if email is verified
        if (!staff.isActive) {
            return res.status(401).json({
                message: "Please verify your email before logging in",
            });
        }

        // Verify password
        const isPasswordValid = await staff.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        // Generate JWT token
        const token = generateToken({
            id: staff._id as string,
            role: staff.role,
            school: staff.school.toString(),
        });

        // Update last login
        staff.lastLogin = new Date();
        await staff.save();

        res.status(200).json({
            message: "Login successful",
            data: {
                token,
                staff: {
                    id: staff._id,
                    name: staff.name,
                    email: staff.email,
                    role: staff.role,
                    school: staff.school,
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Error during login",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};

/**
 * Verify OTP code
 */
export const verifyOTP = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;

        const staff = await Staff.findOne({
            email,
            emailVerificationToken: otp,
            emailVerificationExpires: { $gt: new Date() },
        });

        if (!staff) {
            return res.status(400).json({
                message: "Invalid or expired OTP",
            });
        }

        // Activate account and clear verification tokens
        staff.isActive = true;
        staff.emailVerificationToken = undefined;
        staff.emailVerificationExpires = undefined;
        await staff.save();

        res.status(200).json({
            message: "Email verified successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error verifying OTP",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};

/**
 * Setup or reset password
 */
export const setupPassword = async (req: Request, res: Response) => {
    try {
        const { email, currentPassword, newPassword } = req.body;

        // Find staff member and include password field
        const staff = await Staff.findOne({ email }).select("+password");
        if (!staff) {
            return res.status(404).json({
                message: "Staff not found",
            });
        }

        // Verify current password
        const isPasswordValid = await staff.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Current password is incorrect",
            });
        }

        // Hash and update new password
        staff.password = await hashPassword(newPassword);
        await staff.save();

        res.status(200).json({
            message: "Password updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating password",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};

export const superLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (email != env.SUPER_EMAIL || password != env.SUPER_PASSWORD)
            return res.status(401).json({
                message: "Invalid credentials",
            });

        const token = generateToken({
            id: "admin",
            role: "admin",
            school: "null",
        });

        res.status(200).json({
            message: "Login successful",
            data: {
                token,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Error during login",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};
