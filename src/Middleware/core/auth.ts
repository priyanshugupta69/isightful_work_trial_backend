import jwt from 'jsonwebtoken';
import { jwtAccessTokenSecret, jwtRefreshTokenSecret } from '../../config';
import { Request, Response, NextFunction } from 'express';
import { ProtectedRequest, UserType } from '../../types/custom';
import { AccessTokenError,InternalError } from './apiError';

const verifyToken = (token: string) => {
    try {
        if(!jwtAccessTokenSecret) {
            throw new Error('JWT access token secret is not set');
        }
        const decoded = jwt.verify(token, jwtAccessTokenSecret);
        return decoded;
    } catch (error) {
        throw new InternalError('Failed to verify token', error);
    }
}

const verifyMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        throw new AccessTokenError('Access token is required');
    }
    const decoded = verifyToken(token);
        (req as ProtectedRequest).user = decoded;
        next();
    } catch (error) {
        next(error);
    }
}

const verifyOrganizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const reqUser = (req as ProtectedRequest).user;
        if (reqUser.type !== UserType.ORGANIZATION) {
            throw new AccessTokenError('You are not authorized to access this resource');
        }
        next();
    } catch (error) {
        next(error);
    }
}
const verifyEmployeeMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const reqUser = (req as ProtectedRequest).user;
        if (reqUser.type !== UserType.EMPLOYEE) {
            throw new AccessTokenError('You are not authorized to access this resource');
        }
        next();
    } catch (error) {
        next(error);
    }
}
export { verifyToken, verifyMiddleware, verifyOrganizationMiddleware, verifyEmployeeMiddleware };