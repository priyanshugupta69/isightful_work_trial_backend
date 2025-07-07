import express from "express";
import { PrismaClient } from "../../generated/prisma";
import { SuccessResponse} from "../Middleware/core/apiResponse";
import asyncHandler from "../Middleware/core/asyncHandler";
import EmployeeService from "../Services/employeeService";
import { ProtectedRequest } from "../types/custom";
import SessionService from "../Services/sessionService";
const router = express.Router();
const prisma = new PrismaClient();
const employeeService = new EmployeeService(prisma);
router.post('/add-employee', asyncHandler(async (req: ProtectedRequest, res) => {
    const organization_id = req.user.id;
    const { email, team_id, first_name, last_name} = req.body;
    const employee = await employeeService.addEmployee(email, team_id, first_name, last_name, organization_id);
    return new SuccessResponse('Employee added successfully', employee).send(res);
}));
router.put('/update-employee', asyncHandler(async (req: ProtectedRequest, res) => {
    const organization_id = req.user.organization_id;
    const { email, team_id, first_name, last_name } = req.body;
    const employee = await employeeService.updateEmployee(email, organization_id, team_id, first_name, last_name);
    return new SuccessResponse('Employee updated successfully', employee).send(res);
}));
router.delete('/delete-employee', asyncHandler(async (req: ProtectedRequest, res) => {
    const organization_id = req.user.organization_id;
    const { email } = req.body;
    const employee = await employeeService.deleteEmployee(email, organization_id);
    return new SuccessResponse('Employee deleted successfully', employee).send(res);
}));
router.get('/get-employees', asyncHandler(async (req: ProtectedRequest, res) => {
    const organization_id = req.user.organization_id;
    const employees = await employeeService.getEmployees(organization_id);
    return new SuccessResponse('Employees fetched successfully', employees ).send(res);
}));
router.get('/get-employee-sessions', asyncHandler(async (req: ProtectedRequest, res) => {
    const { employee_id } = req.body;
    const sessionService = new SessionService(prisma);
    const sessions = await sessionService.getEmployeeSessions(employee_id);
    return new SuccessResponse('Employee sessions fetched successfully', sessions).send(res);
}));


export default router;