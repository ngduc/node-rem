export {};
const express = require('express');
import { NextFunction, Request, Response, Router } from 'express';
const router = express.Router();
const { authorize } = require('../../middlewares/auth');

const controller = require('../../controllers/read.controller');

router.route('/read').get(authorize(), controller.read);

module.exports = router;
