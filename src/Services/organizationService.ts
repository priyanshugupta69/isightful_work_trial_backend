import { PrismaClient, TaskPriority, TaskStatus } from "../../generated/prisma";
import { BadRequestError, InternalError } from "../Middleware/core/apiError";

export default class OrganizationService {
    constructor(private readonly prisma: PrismaClient) { }

    async addProject(name: string, organization_id: number) {
        try {
            const project = await this.prisma.project.create({
                data: { name, org_id: organization_id }
            });
            return project;
        } catch (error) {
            throw new InternalError('Failed to add project', error);
        }
    }
    async editProject(id: number, name: string, organization_id: number) {
        try {
            const project = await this.prisma.project.update({
                where: { id, org_id: organization_id },
                data: { name}
            });
            return project;
        } catch (error) {
            throw new InternalError('Failed to edit project', error);
        }
    }
    async deleteProject(id: number, organization_id: number) {
        try {
            const project = await this.prisma.project.update({
                where: { id, org_id: organization_id },
                data: { deleted_at: new Date() }
            });
            return project;
        } catch (error) {
            throw new InternalError('Failed to delete project', error);
        }
    }
    async addTeam(name: string, organization_id: number) {
        try {
            const maxTeamId = await this.prisma.team.aggregate({
                where: { organization_id },
                _max: { id: true }
            });

            const nextId = (maxTeamId._max.id || 0) + 1;
            const team = await this.prisma.team.create({
                data: { id: nextId, name, organization_id }
            });
            return team;
        } catch (error) {
            throw new InternalError('Failed to add team', error);
        }
    }
    async addProjectMember(project_id: number, employee_ids: number[]) {
        try {
            const newProjectMembers = await this.prisma.project_employee.createMany({
                data: employee_ids.map(employee_id => ({ project_id, employee_id }))
            });
        } catch (error) {
            throw new InternalError('Failed to add project member', error);
        }
    }
    async deleteProjectMember(project_id: number, employee_id: number) {
        try {
            const deletedProjectMembers = await this.prisma.project_employee.updateMany({
                where: { project_id, employee_id },
                data: { deleted_at: new Date() }
            });
            return deletedProjectMembers;
        } catch (error) {
            throw new InternalError('Failed to delete project member', error);
        }
    }
    async addTask(project_id: number, title: string, description: string, priority: TaskPriority) {
        try {
            const task = await this.prisma.task.create({
                data: { project_id, title, description, priority }
            });
            return task;
        } catch (error) {
            throw new InternalError('Failed to add task', error);
        }
    }
    async assignTask(task_id: number, employee_ids: number[]        ) {
        try {
            const newTaskEmployees = await this.prisma.task_employee.createMany({
                data: employee_ids.map(employee_id => ({ task_id, employee_id }))
            });
            return newTaskEmployees;
        } catch (error) {
            throw new InternalError('Failed to assign task', error);
        }
    }
    async unassignTask(task_id: number, employee_id: number) {
        try {
            const deletedTaskEmployees = await this.prisma.task_employee.updateMany({
                where: { task_id, employee_id },
                data: { deleted_at: new Date() }
            });
            return deletedTaskEmployees;
        } catch (error) {
            throw new InternalError('Failed to unassign task', error);
        }
    }
    async getProjects(organization_id: number) {
        try {
            const projects = await this.prisma.project.findMany({
                where: { org_id: organization_id },
                select: {
                    id: true,
                    name: true,
                    created_at: true,
                    tasks: true
                }
            });
            return projects;
        } catch (error) {
            throw new InternalError('Failed to get projects', error);
        }
    }
}