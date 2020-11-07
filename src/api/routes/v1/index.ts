export {};
import * as express from 'express';
import { apiJson } from '../../../api/utils/Utils';

const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const uploadRoutes = require('./upload.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res, next) => {
  apiJson({ req, res, data: { status: 'OK' } });
  return next();
});

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
