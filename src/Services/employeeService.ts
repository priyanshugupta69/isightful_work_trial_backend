import { PrismaClient } from "../../generated/prisma";
import { BadRequestError, InternalError } from "../Middleware/core/apiError";
import NodemailerMailService from "./mailService/nodemailer";
import { frontendUrl } from "../config";
import redis from "./redis";
import { v4 as uuidv4 } from 'uuid';
const nodemailerMailService = new NodemailerMailService();
export default class EmployeeService {
    constructor(private readonly prisma: PrismaClient) {}

    async addEmployee(email: string, team_id: number, first_name: string, last_name: string, organization_id: number) {
        try {
            const existingEmployee = await this.prisma.employee.findUnique({
                where: { idx_employee_email_organization_id_unique: { email, organization_id } }
            });
            if (existingEmployee) {
                throw new BadRequestError('Employee already exists');
            }
            const verificationToken = uuidv4();
            const employee = await this.prisma.employee.create({
                data: { email, team_id : team_id || 0, first_name, last_name, organization_id, verified: false},
                select: {
                    email: true,
                    verified: true
                }
            });
            await nodemailerMailService.sendEmail(email, 'Welcome to the team', `<h3>Fololow the link to verify and download the software</h3> <a href="${frontendUrl}/verify-employee-email?token=${verificationToken}">Verify Email</a>`);
            await redis.hset(verificationToken, {email: email, organization_id: organization_id});
            await redis.expire(verificationToken, 60 * 60 * 24 * 30);
            return employee;
            
        } catch (error) {
            throw new InternalError('Failed to add employee', error);
        }
        
    }

    async updateEmployee(email: string, organization_id: number, team_id: number, first_name: string, last_name: string) {
        try {
            const employee = await this.prisma.employee.update({
                where: { idx_employee_email_organization_id_unique: { email, organization_id } },
                data: { team_id, first_name, last_name }
            });
            return employee;
            
        } catch (error) {
            throw new InternalError('Failed to update employee', error);
        }
        
    }
    async deleteEmployee(email: string, organization_id: number) {
        try {
            const employee = await this.prisma.employee.update({
                where: { idx_employee_email_organization_id_unique: { email, organization_id } },
                data: { deleted_at: new Date() }
            });
            return employee;
        } catch (error) {
            throw new InternalError('Failed to delete employee', error);
        }
    }
    async getEmployees(organization_id: number) {
        try {
            const employees = await this.prisma.employee.findMany({
                where: { 
                    organization_id,
                    deleted_at: null // Only get active employees
                },
                select: {
                    id: true,
                    email: true,
                    first_name: true,
                    last_name: true,
                    verified: true,
                    hourly_rate: true,
                    team: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    project_employees: {
                        where: {
                            deleted_at: null // Only get active project assignments
                        },
                        select: {
                            project: {
                                select: {
                                    id: true,
                                    name: true,
                                    created_at: true
                                }
                            }
                        }
                    },
                    task_employees: {
                        where: {
                            deleted_at: null // Only get active task assignments
                        },
                        select: {
                            task: {
                                select: {
                                    id: true,
                                    title: true,
                                    description: true,
                                    status: true,
                                    priority: true,
                                    created_at: true,
                                    project_id: true
                                }
                            }
                        }
                    }
                }
            });

            // Transform the data to match the desired structure
            const transformedEmployees = employees.map(employee => {
                // Create a map of project_id to tasks
                const projectTasksMap = new Map();
                
                employee.task_employees.forEach(te => {
                    const projectId = te.task.project_id;
                    if (!projectTasksMap.has(projectId)) {
                        projectTasksMap.set(projectId, []);
                    }
                    projectTasksMap.get(projectId).push({
                        id: te.task.id,
                        title: te.task.title,
                        description: te.task.description,
                        status: te.task.status,
                        priority: te.task.priority,
                        created_at: te.task.created_at
                    });
                });

                // Create projects array with tasks
                const projects = employee.project_employees.map(pe => ({
                    id: pe.project.id,
                    name: pe.project.name,
                    created_at: pe.project.created_at,
                    tasks: projectTasksMap.get(pe.project.id) || []
                }));

                return {
                    id: employee.id,
                    email: employee.email,
                    first_name: employee.first_name,
                    last_name: employee.last_name,
                    verified: employee.verified,
                    hourly_rate: employee.hourly_rate,
                    team: employee.team,
                    projects: projects
                };
            });

            return transformedEmployees;
        } catch (error) {
            throw new InternalError('Failed to get employees', error);
        }
    }
}