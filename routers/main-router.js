import express from 'express';
import tempRouter from './temporary-router.js';
import authRouter from './auth-router.js';

const router = express.Router();

router.use(authRouter);
router.use(tempRouter);

export default router;