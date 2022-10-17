import { IMiddleware } from '../../types/middleware.interface.js';
import multer, { diskStorage } from 'multer';
import mime from 'mime-types';
import { nanoid } from 'nanoid';
import { NextFunction, Request, Response } from 'express';

export default class UploadFileMiddleware implements IMiddleware {
  constructor(
    private directoryName: string,
    private fieldName: string,
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.directoryName,
      filename(_req, file, callback) {
        const fileExtension = mime.extension(file.mimetype);
        const filename = nanoid();
        callback(null, `${filename}.${fileExtension}`);
      },
    });

    const uploadSingleFileMiddleware = multer({storage}).single(this.fieldName);

    uploadSingleFileMiddleware(req, res, next);
  }
}

