import express from 'express';
import tempRouter from '#routers/temporary-router.js';
import authRouter from '#routers/auth-router.js';
import instrumentRouter from '#tournament-routers/instrument-router.js';
import tournamentRouter from '#tournament-routers/tournament-router.js';

const router = express.Router();

router.use(authRouter);
router.use(tempRouter);
router.use('/instrument', instrumentRouter);
router.use('/tournament', tournamentRouter);

export default router;