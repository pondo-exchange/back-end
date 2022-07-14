import express from 'express';
import tempRouter from '@routers/temporary-router';
import authRouter from '@routers/auth-router';
import instrumentRouter from '@tournament-routers/instrument-router';
import tournamentRouter from '@tournament-routers/tournament-router';

const router = express.Router();

router.use(authRouter);
router.use(tempRouter);
router.use('/instrument', instrumentRouter);
router.use('/tournament', tournamentRouter);

export default router;