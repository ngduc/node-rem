export {};
const express = require('express');
import { NextFunction, Request, Response, Router } from 'express';
const router = express.Router();
const { authorize } = require('../../middlewares/auth');

const controller = require('../../controllers/person.controller');

router.route('/').get(authorize(), controller.list);

router.route('/').post(authorize(), controller.addPerson);

module.exports = router;
