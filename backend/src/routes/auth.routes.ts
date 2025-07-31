import { Router } from "express";
import {
    register,
    login,
    verifyOTP,
    setupPassword,
    superLogin,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema } from "../schemas/auth.schema";
import { loginSchema } from "../schemas/validation.schema";
const router = Router();

router.post("/super/login", validate(loginSchema), superLogin);

// Register new user
router.post("/register", validate(registerSchema), register);

// Login user
router.post("/login", validate(loginSchema), login);

// Verify OTP code
router.post("/verify-otp", verifyOTP);

// Setup/Reset password
router.post("/setup-password", setupPassword);

export default router;
