import express from "express";
import sessionController from "../../../Controller/sessionController";
import { verifyMiddleware, verifyEmployeeMiddleware } from "../../../Middleware/core/auth";

const router = express.Router();

router.use('/session', verifyMiddleware, verifyEmployeeMiddleware, sessionController);

export default router;