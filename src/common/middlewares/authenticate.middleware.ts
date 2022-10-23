import { IMiddleware } from '../../types/middleware.interface.js';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import HttpError from '../errors/http-error.js';
import { jwtVerify } from 'jose';
import crypto from 'crypto';

export default class AuthenticateMiddleware implements IMiddleware {
  constructor(
    private readonly jwtSecter: string
  ) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.headers?.authorization?.split(' ');

    if(!authorizationHeader) {
      return next();
    }
    const [, token] = authorizationHeader;

    try {
      const { payload } = await jwtVerify(token, crypto.createSecretKey(this.jwtSecter, 'utf-8'));
      req.user = {id: payload.id as string, email: payload.email as string};

      return next();
    } catch {
      return next(new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid Token',
        'AuthenticateMiddleware'
      ));
    }
  }
}
