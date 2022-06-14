import express from 'express';
import tempRouter from './temporary-router.js';

const router = express.Router();

router.use(tempRouter);

export default router;