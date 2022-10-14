import { Request, Response, NextFunction } from 'express';
import { HttpMethod } from './http-method.enum.js';
import { IMiddleware } from './middleware.interface.js';

export interface IRoute {
  path: string,
  method: HttpMethod,
  handler: (req: Request, res: Response, next: NextFunction) => void,
  middlewares?: IMiddleware[],
}
