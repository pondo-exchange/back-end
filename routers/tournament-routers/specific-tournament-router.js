import express from 'express';
import { getTournament } from './tournament-middleware.js';

const router = express.Router();

router.use(getTournament);

export default router;