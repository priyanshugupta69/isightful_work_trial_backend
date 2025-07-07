import express from "express";
import organizationRoutes from "./versions/v1/organization";
import employeeRoutes from "./versions/v1/employee";
import authRoutes from "./versions/v1/auth";
import sessionRoutes from "./versions/v1/session";
const router = express.Router();

router.use('/v1', organizationRoutes);
router.use('/v1', employeeRoutes);
router.use('/v1', authRoutes);
router.use('/v1', sessionRoutes);
export default router;