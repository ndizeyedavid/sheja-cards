import { Router } from "express";
import schoolRoutes from "./school.routes";
import staffRoutes from "./staff.routes";
import classRoutes from "./class.routes";
import studentRoutes from "./student.routes";
import templateRoutes from "./template.routes";
import idcardRoutes from "./idcard.routes";
import { validate } from "../middlewares/validate.middleware";
import { superLogin } from "../controllers/auth.controller";
import { loginSchema } from "../schemas/validation.schema";

const router = Router();

router.post("/super/login", validate(loginSchema), superLogin);

// Register all routes
router.use("/schools", schoolRoutes);
router.use("/staff", staffRoutes);
router.use("/classes", classRoutes);
router.use("/students", studentRoutes);
// router.use('/templates', templateRoutes);
router.use("/idcards", idcardRoutes);

export default router;
