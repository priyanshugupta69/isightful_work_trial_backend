import { Request } from "express";

interface ProtectedRequest extends Request {
    user: any;
}
enum UserType {
    ORGANIZATION = 'organization',
    EMPLOYEE = 'employee'
}
interface JwtPayload {
    id: number;
    email: string;
    name: string;
    is_verified: boolean;
    type: UserType;
}
export { ProtectedRequest, JwtPayload, UserType };