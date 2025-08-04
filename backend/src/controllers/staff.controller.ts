import { Request, Response } from "express";
import Staff from "../models/staff.model";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper";
import { generateToken } from "../helpers/jwt.helper";
import { emailTemplates, sendTemplatedEmail } from "../utils/mailer.utils";
import bcrypt from "bcrypt";
/**
 * [SELF]Create a new staff member
 */

export const selfCreateStaff = async (req: Request, res: Response) => {
  try {
    const { name, email, password, schoolId, phone, idNumber, role } = req.body;

    // Generate temporary password
    // const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await hashPassword(password);

    const staff = await Staff.create({
      name,
      email,
      phone,
      idNumber,
      password: hashedPassword,
      role,
      school: schoolId,
    });

    // Send welcome email with temporary password
    await sendTemplatedEmail(
      email,
      emailTemplates.welcomeStaff(name, role, password)
    );

    res.status(201).json({
      message: "Staff member created successfully",
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating staff member",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

/**
 * Create a new staff member
 */
export const createStaff = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, idNumber, role } = req.body;
    const schoolId = req.user?.school;

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    // const hashedPassword = await hashPassword(tempPassword);

    const staff = await Staff.create({
      name,
      email,
      phone,
      idNumber,
      password: tempPassword,
      role,
      school: schoolId,
    });

    // Send welcome email with temporary password
    await sendTemplatedEmail(
      email,
      emailTemplates.welcomeStaff(name, role, tempPassword)
    );

    res.status(201).json({
      message: "Staff member created successfully",
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating staff member",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

/**
 * Staff login
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const staff = await Staff.findOne({ email });

    if (!staff) {
      return res.status(401).json({
        message: "E-mail doesn't exist",
      });
    }

    const isPasswordValid = await comparePassword(password, staff.password);

    console.log(staff);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Incorrect Password",
      });
    }

    // Update login status
    await Staff.findByIdAndUpdate(staff._id as string, { isLoggedIn: true });
    await staff.save();

    const token = generateToken({
      id: staff._id as string,
      role: staff.role,
      school: staff.school?.toString(),
    });

    res.status(200).json({
      message: "Login successful",
      data: {
        ...staff.toObject(),
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

/**
 * Staff logout
 */
export const logout = async (req: Request, res: Response) => {
  try {
    const staffId = req.user?.id;

    await Staff.findByIdAndUpdate(staffId, { isLoggedIn: false });

    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during logout",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

/**
 * Get all staff members (paginated)
 */
export const getStaff = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const staff = await Staff.find({ school: req.user?.school })
      .skip(skip)
      .limit(limit)
      .select("-password");

    const total = await Staff.countDocuments({ school: req.user?.school });

    res.status(200).json({
      message: "Staff members retrieved successfully",
      data: {
        staff,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving staff members",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

/**
 * Get a single staff member
 */
export const getStaffMember = async (req: Request, res: Response) => {
  try {
    const staff = await Staff.findOne({
      _id: req.params.id,
      school: req.user?.school,
    }).select("-password");

    if (!staff) {
      return res.status(404).json({
        message: "Staff member not found",
      });
    }

    res.status(200).json({
      message: "Staff member retrieved successfully",
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving staff member",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

/**
 * Update a staff member
 */
export const updateStaff = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, role } = req.body;

    const staff = await Staff.findOneAndUpdate(
      {
        _id: req.params.id,
        school: req.user?.school,
      },
      { name, email, phone, role },
      { new: true }
    ).select("-password");

    if (!staff) {
      return res.status(404).json({
        message: "Staff member not found",
      });
    }

    res.status(200).json({
      message: "Staff member updated successfully",
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating staff member",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

/**
 * Delete a staff member
 */
export const deleteStaff = async (req: Request, res: Response) => {
  try {
    const staff = await Staff.findOneAndDelete({
      _id: req.params.id,
      school: req.user?.school,
    });

    if (!staff) {
      return res.status(404).json({
        message: "Staff member not found",
      });
    }

    res.status(200).json({
      message: "Staff member deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting staff member",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

/**
 * Change password
 */
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const staffId = req.user?.id;

    const staff = await Staff.findById(staffId).select("+password");

    if (!staff) {
      return res.status(404).json({
        message: "Staff member not found",
      });
    }

    const isPasswordValid = await comparePassword(
      currentPassword,
      staff.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    staff.password = await hashPassword(newPassword);
    await staff.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error changing password",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const staff = await Staff.findOne({ email });

    if (!staff) {
      return res.status(404).json({
        message: "Staff member not found",
      });
    }

    // Generate reset token
    const resetToken = Math.random().toString().slice(-6);
    (staff as any).resetToken = resetToken;
    (staff as any).resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await staff.save();

    // Send reset email
    await sendTemplatedEmail(
      email,
      emailTemplates.resetPassword(staff.name, resetToken)
    );

    res.status(200).json({
      message: "Password reset instructions sent to email",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error requesting password reset",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

/**
 * Reset password
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    const staff = await Staff.findOne({
      email,
      resetToken,
      resetTokenExpires: { $gt: new Date() },
    });

    if (!staff) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    staff.password = await hashPassword(newPassword);
    (staff as any).resetToken = undefined;
    (staff as any).resetTokenExpires = undefined;
    await staff.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error resetting password",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};
