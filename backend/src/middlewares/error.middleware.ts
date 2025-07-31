import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

interface CustomError extends Error {
    statusCode?: number;
    code?: number;
    keyValue?: Record<string, any>;
    errors?: Record<string, any>;
}

/**
 * Global error handling middleware
 */
export const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Default error
    let error = {
        message: err.message || "Something went wrong",
        statusCode: err.statusCode || 500,
        errors: [],
    };

    // Send response
    res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
        stack: env.NODE_ENV === "development" ? err.stack : undefined,
    });
};
