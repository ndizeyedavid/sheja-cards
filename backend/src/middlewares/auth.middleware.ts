import { Request, Response, NextFunction } from "express";
import { verifyToken, extractToken } from "../helpers/jwt.helper";
import { StaffRole } from "../models/staff.model";

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: string;
                school: string;
            };
        }
    }
}

/**
 * Middleware to protect routes that require authentication
 */
export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const token = extractToken(authHeader);
        const decoded = verifyToken(token);

        req.user = {
            id: decoded.id as string,
            role: decoded.role as string,
            school: decoded.school as string,
        };
        next();
    } catch (error: any) {
        return res.status(401).json({ message: error.message });
    }
};

/**
 * Middleware to restrict routes to specific roles
 */
export const restrictTo = (...roles: String[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }

        if (!roles.includes(req.user.role as StaffRole)) {
            return res.status(403).json({
                message: "You do not have permission to perform this action",
            });
        }

        next();
    };
};

/**
 * Middleware to ensure user belongs to the same school
 */
export const sameSchool = (req: Request, res: Response, next: NextFunction) => {
    const schoolId = req.params.schoolId || req.body.school;

    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }

    if (req.user.school !== schoolId) {
        return res.status(403).json({
            message: "You can only access resources from your school",
        });
    }

    next();
};
