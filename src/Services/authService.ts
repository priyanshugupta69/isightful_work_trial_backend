import { PrismaClient } from "../../generated/prisma";
import { frontendUrl, jwtAccessTokenSecret, jwtRefreshTokenSecret } from "../config";
import { BadRequestError, InternalError } from "../Middleware/core/apiError";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ResendMailService } from "./mailService/resend";
import redis from "./redis";
import { JwtPayload, UserType } from "../types/custom";
import { v4 as uuidv4 } from 'uuid';
import generator from 'generate-password';
import NodemailerMailService from "./mailService/nodemailer";
const nodemailerMailService = new NodemailerMailService();
export default class AuthService {
    constructor(private prisma: PrismaClient) { }

    async organizationSignup(name: string, email: string, password: string) {
        try {
            const existingOrganization = await this.prisma.organization.findUnique({
                where: { email }
            });
            if (existingOrganization) {
                throw new BadRequestError('Organization already exists');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            
            const result = await this.prisma.$transaction(async (tx) => {
                const organization = await tx.organization.create({
                    data: { name, email, password: hashedPassword }
                });

                await tx.team.create({
                    data: {
                        id: 0,
                        name: 'Default Team',
                        organization_id: organization.id
                    }
                });

                return organization;
            });

            const verificationToken = uuidv4();
            if(result && result.uuid) {
                await redis.set(verificationToken, email, 'EX', 60 * 60 * 24 * 30);
                const verificationLink = `${frontendUrl}/verify-organization-email?token=${verificationToken}`;
                await nodemailerMailService.sendEmail(email, 'Welcome to Mercor', `<h1>You have successfully created an account on Mercor <br> Please verify your email</h1> <a href="${verificationLink}">Verify your email</a>`);
            }
            else{
                throw new InternalError('Failed to add organization');
            }
            return result;
        } catch (error) {
            console.log(error);
            throw new InternalError('Failed to signup');
        }
    }
    async resendEmail(email: string) {
        try {
            const organization = await this.prisma.organization.findUnique({
                where: { email }
            });
            if (!organization) {
                throw new BadRequestError('Organization not found');
            }
            const verificationToken = uuidv4();
            await redis.set(verificationToken, email, 'EX', 60 * 60 * 24 * 30);
            const verificationLink = `${frontendUrl}/verify-oraganization-email?token=${verificationToken}`;
            await nodemailerMailService.sendEmail(email, 'Welcome to Mercor', `<h1>You have successfully created an account on Mercor <br> Please verify your email</h1> <a href="${verificationLink}">Verify your email</a>`);
        } catch (error) {
            console.log(error);
            throw new InternalError('Failed to resend email');
        }
      
    }
    async verifyOrganizationEmail(token: string) {
        const email = await redis.get(token);
        if (!email) {
            throw new BadRequestError('Invalid token');
        }
        const organization = await this.prisma.organization.findUnique({
            where: { email }
        });
        if (!organization) {
            throw new BadRequestError('Organization not found');
        }
        const jwtPayload = {
            id: Number(organization.id),
            email: organization.email,
            name: organization.name,
            is_verified: true,
            type: UserType.ORGANIZATION
        }
        await this.prisma.organization.update({
            where: { email },
            data: { is_verified: true }
        });
        const { accessToken, refreshToken } = this.generateToken(jwtPayload);
        return { accessToken, refreshToken, organization };
    }
    async verifyEmployeeEmail(token: string) {
        const { email, organization_id } = await redis.hgetall(token);
        if (!email || !organization_id) {
            throw new BadRequestError('Invalid token');
        }
        const employee = await this.prisma.employee.findUnique({
            where: { idx_employee_email_organization_id_unique: { email, organization_id: Number(organization_id) } }
        });
        if (!employee) {
            throw new BadRequestError('Employee not found');
        }
        const jwtPayload = {
            id: Number(employee.id),
            email: employee.email,
            name: employee.first_name + ' ' + employee.last_name,
            is_verified: true,
            type: UserType.EMPLOYEE
        }
        const password = generator.generate({
            length: 10,
            numbers: true,
            uppercase: true,
            lowercase: true,
            symbols: true
        });
        const hashedPassword = bcrypt.hashSync(password, 10);
        await this.prisma.employee.update({
            where: { idx_employee_email_organization_id_unique: { email, organization_id: Number(organization_id) } },
            data: { verified: true, password: hashedPassword }
        });
        await nodemailerMailService.sendEmail(email, 'Welcome to the team', `<h3>Your password for the logging in is ${password}</h3>`);
        const { accessToken, refreshToken } = this.generateToken(jwtPayload);
        return { accessToken, refreshToken};
    }
    generateToken(payload: JwtPayload): { accessToken: string, refreshToken: string } {
        try {
            if (!jwtAccessTokenSecret || !jwtRefreshTokenSecret) {
                throw new Error('JWT secrets are not set');
            }
            const accessToken = jwt.sign(payload, jwtAccessTokenSecret, { expiresIn: '7d' });
            const refreshToken = jwt.sign(payload, jwtRefreshTokenSecret, { expiresIn: '30d' });
            return { accessToken, refreshToken };
        } catch (error) {
            console.log(error);
            throw new InternalError('Failed to generate token');
        }
    }
    async organizationLogin(email: string, password: string) {
        const organization = await this.prisma.organization.findUnique({
            where: { email }
        });
        if (!organization) {
            throw new BadRequestError('Organization not found');
        }
        const isPasswordValid = await bcrypt.compare(password, organization.password);
        if (!isPasswordValid) {
            throw new BadRequestError('Invalid password');
        }
        const { accessToken, refreshToken } = this.generateToken({
            id: Number(organization.id),
            email: organization.email,
            name: organization.name,
            is_verified: organization.is_verified,
            type: UserType.ORGANIZATION
        });
        return { accessToken, refreshToken };
    }
    async employeeLogin(email: string, password: string) {
        const employee = await this.prisma.employee.findFirst({
            where: { email }
        });
        if (!employee) {
            throw new BadRequestError('Employee not found');
        }
        if (!employee.password) {
            throw new BadRequestError('Employee not verified');
        }
        const isPasswordValid = await bcrypt.compare(password, employee.password);
        if (!isPasswordValid) {
            throw new BadRequestError('Invalid password');
        }
        const { accessToken, refreshToken } = this.generateToken({
            id: Number(employee.id),
            email: employee.email,
            name: employee.first_name + ' ' + employee.last_name,
            is_verified: employee.verified || false,
            type: UserType.EMPLOYEE
        });
        return { accessToken, refreshToken };
    }   
}