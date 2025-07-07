import { PrismaClient, TaskPriority, TaskStatus } from "../../generated/prisma";
import { BadRequestError, InternalError } from "../Middleware/core/apiError";

export default class SessionService {
    constructor(private readonly prisma: PrismaClient) {}

    async createSession(task_id: number, employee_id: number) {
        try {
            const session = await this.prisma.session.create({
                data: { task_id, employee_id }
            });
            return session;
        } catch (error) {
            throw new InternalError('Failed to create session', error);
        }
    }

    async endSession(session_id: number) {
        try {
            const session = await this.prisma.session.update({
                where: { id: session_id },
                data: { end_at: new Date() }
            });
            return session;
        } catch (error) {
            throw new InternalError('Failed to end session', error);
        }
    }
    async recieveScreenShot(session_id: number, image_url: string) {
        try {
            const session = await this.prisma.session_image.create({
                data: { session_id, image_url }
            });
            return session;
        } catch (error) {
            throw new InternalError('Failed to receive screenshot', error);
        }
    }
    async getSessionImages(session_id: number) {
        try {
            const session = await this.prisma.session_image.findMany({
                where: { session_id }
            });
            return session;
        } catch (error) {
            throw new InternalError('Failed to get session images', error);
        }
    }
    async getEmployeeSessions(employee_id: number) {
        try {
            const sessions = await this.prisma.session.findMany({
                where: { employee_id },
                include: {
                    session_images: true
                }
            });
            return sessions;
        } catch (error) {
            throw new InternalError('Failed to get employee sessions', error);
        }
    }
}   