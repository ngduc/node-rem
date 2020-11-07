export {};
const express = require('express');
import { NextFunction, Request, Response, Router } from 'express';
const router = express.Router();
const { authorize } = require('../../middlewares/auth');
const { UPLOAD_LIMIT } = require('../../../config/vars');

const controller = require('../../controllers/upload.controller');

const multer = require('multer');
const storage = multer.diskStorage({
  destination(req: Request, file: any, cb: any) {
    cb(null, 'uploads/');
  },
  filename(req: Request, file: any, cb: any) {
    // fieldname, originalname, mimetype
    cb(null, `${file.fieldname}-${Date.now()}.png`);
  }
});
const upload = multer({ storage, limits: { fieldSize: `${UPLOAD_LIMIT}MB` } });

router.route('/file').post(authorize(), upload.single('file'), controller.upload);

module.exports = router;
