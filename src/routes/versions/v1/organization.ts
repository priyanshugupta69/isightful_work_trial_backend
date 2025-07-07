import express from "express";
import organizationController from "../../../Controller/organization";
import { verifyMiddleware, verifyOrganizationMiddleware } from "../../../Middleware/core/auth";

const router = express.Router();

router.use('/organization', verifyMiddleware,verifyOrganizationMiddleware, organizationController);

export default router;


