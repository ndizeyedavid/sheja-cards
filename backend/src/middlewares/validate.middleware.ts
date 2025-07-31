import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

/**
 * Middleware to validate request data against a Zod schema
 * @param schema - Zod schema to validate against
 */
export const validate =
    (schema: ZodObject) => async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate request data against schema
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Format Zod validation errors
                return res.status(400).json({
                    message: "Validation failed",
                    errors: JSON.parse(error.message),
                });
            }

            // Handle other types of errors
            return res.status(500).json({
                message: "Internal server error during validation",
            });
        }
    };
