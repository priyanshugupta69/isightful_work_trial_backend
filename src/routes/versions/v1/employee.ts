import express from "express";
import employeeRoutes from "../../../Controller/employee";
const router = express.Router();
import { verifyMiddleware, verifyOrganizationMiddleware } from "../../../Middleware/core/auth";

router.use('/employee', verifyMiddleware, verifyOrganizationMiddleware, employeeRoutes);
export default router;