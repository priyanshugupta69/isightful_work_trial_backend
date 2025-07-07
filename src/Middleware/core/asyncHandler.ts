import { Request, Response, NextFunction } from 'express';
import { ProtectedRequest } from '../../types/custom';

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;

export default (execution: AsyncFunction) =>
  (req: Request | ProtectedRequest, res: Response, next: NextFunction) => {
    execution(req, res, next).catch(next);
  };