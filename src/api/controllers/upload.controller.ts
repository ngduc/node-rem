export {};
const fs = require('fs');
import { NextFunction, Request, Response, Router } from 'express';

import { apiJson } from 'api/utils/Utils';

const { UPLOAD_LIMIT } = require('config/vars');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/', limits: { fieldSize: UPLOAD_LIMIT + 'MB' } }).single('fileUpload');

exports.upload = async (req: any, res: Response, next: NextFunction) => {
  try {
    const data = { status: 'OK' };
    return apiJson({ req, res, data });
  } catch (error) {
    return next(error);
  }
}
