import express from "express";
import { PrismaClient } from "../../generated/prisma";
import { SuccessResponse} from "../Middleware/core/apiResponse";
import asyncHandler from "../Middleware/core/asyncHandler";
import AuthService from "../Services/authService";
const router = express.Router();
const prisma = new PrismaClient();
const authService = new AuthService(prisma);


router.post('/signup', asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const organization = await authService.organizationSignup(name, email, password)
    return new SuccessResponse('Organization created successfully', organization.name).send(res);
}));

router.post('/resend-verify-email', asyncHandler(async (req, res) => {
    const { email } = req.body;
    await authService.resendEmail(email);
    return new SuccessResponse('Email sent successfully', { email }).send(res);
}));

router.post('/verify-organization-email', asyncHandler(async (req, res) => {
    const { token } = req.body;
    const { accessToken, refreshToken} = await authService.verifyOrganizationEmail(token);
    return new SuccessResponse('Email verified successfully', { accessToken, refreshToken }).send(res);
}));
router.post('/verify-employee-email', asyncHandler(async (req, res) => {
    const { token } = req.body;
    const employee = await authService.verifyEmployeeEmail(token);
    return new SuccessResponse('Employee verified successfully', employee).send(res);
}));

router.post('/org-login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await authService.organizationLogin(email, password);
    return new SuccessResponse('Login successful', { accessToken, refreshToken }).send(res);
}));
router.post('/employee-login', asyncHandler(async (req, res) =>{
    const {email, password} = req.body
    const {accessToken, refreshToken} = await authService.employeeLogin(email, password);
    return new SuccessResponse('Login successful', { accessToken, refreshToken }).send(res);
}))

export default router;