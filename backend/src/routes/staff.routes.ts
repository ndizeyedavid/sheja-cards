import { Router } from "express";
import {
    createStaff,
    login,
    logout,
    getStaff,
    getStaffMember,
    updateStaff,
    deleteStaff,
    changePassword,
    requestPasswordReset,
    resetPassword,
    selfCreateStaff,
} from "../controllers/staff.controller";
import { protect, restrictTo, sameSchool } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
    createStaffSchema,
    updateStaffSchema,
    loginSchema,
    changePasswordSchema,
    resetPasswordSchema,
} from "../schemas/validation.schema";

const router = Router();

// Public routes
router.post("/login", validate(loginSchema), login);
router.post(
    "/reset-password/request",
    validate(resetPasswordSchema),
    requestPasswordReset
);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

// Headmaster create account
router.route("/self").post(validate(createStaffSchema), selfCreateStaff);

// Protected routes
router.use(protect);

router.post("/logout", logout);
router.patch("/change-password", validate(changePasswordSchema), changePassword);

// School admin and DOS routes
router.use(restrictTo("HEADMASTER", "DOS"));

router.route("/").get(getStaff).post(validate(createStaffSchema), createStaff);

router
    .route("/:id")
    .get(sameSchool, getStaffMember)
    .patch(sameSchool, validate(updateStaffSchema), updateStaff)
    .delete(sameSchool, deleteStaff);

export default router;
