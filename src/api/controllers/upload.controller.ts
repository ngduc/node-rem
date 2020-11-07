export {};
import { NextFunction, Request, Response } from 'express';

import { apiJson } from '../../api/utils/Utils';

exports.upload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = { status: 'OK' };
    return apiJson({ req, res, data });
  } catch (error) {
    return next(error);
  }
};
