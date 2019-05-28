export {};
const express = require('express');
import { NextFunction, Request, Response, Router } from 'express';
const router = express.Router();
const { authorize } = require('../../middlewares/auth');

const controller = require('../../controllers/people.controller');

router.route('/').get(authorize(), controller.list);

router.route('/all').get(authorize(), controller.listAll);

router.route('/').post(authorize(), controller.addPerson);

router.route('/remove/:personId').delete(authorize(), controller.removePerson);

module.exports = router;
