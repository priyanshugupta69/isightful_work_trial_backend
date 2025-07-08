import express from "express";
import { PrismaClient } from "../../generated/prisma";
import { SuccessResponse} from "../Middleware/core/apiResponse";
import asyncHandler from "../Middleware/core/asyncHandler";
import OrganizationService from "../Services/organizationService";
import { ProtectedRequest } from "../types/custom";
const router = express.Router();
const prisma = new PrismaClient();
const organizationService = new OrganizationService(prisma);

router.post('/add-project', asyncHandler(async (req: ProtectedRequest, res) => {
    const organization_id = req.user.id;
    const { name } = req.body;
    const project = await organizationService.addProject(name, organization_id);
    return new SuccessResponse('Project added successfully', project).send(res);
}));
router.put('/edit-project', asyncHandler(async (req: ProtectedRequest, res) => {
    const organization_id = req.user.id;
    const { id, name } = req.body;
    const project = await organizationService.editProject(id, name, organization_id);
    return new SuccessResponse('Project updated successfully', project).send(res);
}));
router.delete('/delete-project', asyncHandler(async (req: ProtectedRequest, res) => {
    const organization_id = req.user.id;
    const { id } = req.body;
    const project = await organizationService.deleteProject(id, organization_id);
    return new SuccessResponse('Project deleted successfully', project).send(res);
}));
router.post('/add-project-member', asyncHandler(async (req: ProtectedRequest, res) => {
    const { project_id, employee_ids } = req.body;
    const projectMembers = await organizationService.addProjectMember(project_id, employee_ids);
    return new SuccessResponse('Project members added successfully', projectMembers).send(res);
}));
router.delete('/delete-project-member', asyncHandler(async (req: ProtectedRequest, res) => {
    const organization_id = req.user.id;
    const { project_id, employee_id } = req.body;
    const projectMembers = await organizationService.deleteProjectMember(project_id, employee_id);
    return new SuccessResponse('Project members deleted successfully', projectMembers).send(res);
}));

router.post('/add-team', asyncHandler(async (req: ProtectedRequest, res) => {
    const organization_id = req.user.id;
    const { name } = req.body;
    const team = await organizationService.addTeam(name, organization_id);
    return new SuccessResponse('Team added successfully', team).send(res);
}));

router.post('/add-task', asyncHandler(async (req: ProtectedRequest, res) => {
    const organization_id = req.user.id;
    const { project_id, title, description, priority } = req.body;
    const task = await organizationService.addTask(project_id, title, description, priority);
    return new SuccessResponse('Task added successfully', task).send(res);
}));
router.post('/assign-task', asyncHandler(async (req: ProtectedRequest, res) => {
    const organization_id = req.user.id;
    const { task_id, employee_ids } = req.body;
    const taskEmployees = await organizationService.assignTask(task_id, employee_ids);
    return new SuccessResponse('Task assigned successfully', taskEmployees).send(res);
}));
router.delete('/unassign-task', asyncHandler(async (req: ProtectedRequest, res) => {
    const organization_id = req.user.id;
    const { task_id, employee_id } = req.body;
    const taskEmployees = await organizationService.unassignTask(task_id, employee_id); 
    return new SuccessResponse('Task unassigned successfully', taskEmployees).send(res);
}));
router.get('/projects', asyncHandler(async (req: ProtectedRequest, res) => {
    const organization_id = req.user.id;
    const projects = await organizationService.getProjects(organization_id);
    return new SuccessResponse('Projects fetched successfully', projects).send(res);
}));
router.get('/teams', asyncHandler(async (req: ProtectedRequest, res) => {
    const organization_id = req.user.id;
    const teams = await organizationService.getTeams(organization_id);
    return new SuccessResponse('Teams fetched successfully', teams).send(res);
}));
router.get('/projects-employees/:project_id', asyncHandler(async (req: ProtectedRequest, res) => {
    const { project_id } = req.params;
    const projects = await organizationService.getProjectsEmployees(Number(project_id));
    return new SuccessResponse('Projects employees fetched successfully', projects).send(res);
}));
router.get('/projects/tasks/:project_id', asyncHandler(async (req: ProtectedRequest, res) => {
    const { project_id } = req.params;
    const tasks = await organizationService.getProjectTasks(Number(project_id));
    return new SuccessResponse('Project tasks fetched successfully', tasks).send(res);
}));
router.get('/task-employees/:task_id', asyncHandler(async (req: ProtectedRequest, res) => {
    const { task_id } = req.params;
    const taskEmployees = await organizationService.getTaskEmployees(Number(task_id));
    return new SuccessResponse('Task employees fetched successfully', taskEmployees).send(res);
}));

export default router;