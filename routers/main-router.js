import express from 'express';
import tempRouter from '#routers/temporary-router.js';
import authRouter from '#routers/auth-router.js';

const router = express.Router();

router.use(authRouter);
router.use(tempRouter);

export default router;