import express from "express";
import { PrismaClient } from "../../generated/prisma";
import { SuccessResponse} from "../Middleware/core/apiResponse";
import asyncHandler from "../Middleware/core/asyncHandler";
import EmployeeService from "../Services/employeeService";
import { ProtectedRequest } from "../types/custom";
import SessionService from "../Services/sessionService";


const router = express.Router();
const prisma = new PrismaClient();
const sessionService = new SessionService(prisma);

router.post('/create-session', asyncHandler(async (req: ProtectedRequest, res) => {
    const employee_id = req.user.id;
    const { task_id } = req.body;
    const session = await sessionService.createSession(task_id, employee_id);
    return new SuccessResponse('Session created successfully', session).send(res);
}));

router.put('/end-session', asyncHandler(async (req: ProtectedRequest, res) => {
    const { session_id } = req.body;
    const session = await sessionService.endSession(session_id);
    return new SuccessResponse('Session ended successfully', session).send(res);
}));

router.post('/recieve-screenshot', asyncHandler(async (req: ProtectedRequest, res) => {
    const { session_id, image_url } = req.body;
    const session = await sessionService.recieveScreenShot(session_id, image_url);
    return new SuccessResponse('Screenshot received successfully', session).send(res);
}));

export default router;
