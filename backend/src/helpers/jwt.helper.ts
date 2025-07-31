import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface JwtPayload {
    id: string;
    role: string;
    school: string | null;
}

export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: "24h",
    });
};

export const verifyToken = (token: string): JwtPayload => {
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
        return decoded;
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
};

export const extractToken = (authHeader: string): string => {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("No token provided or invalid format");
    }
    return authHeader.split(" ")[1];
};
