import express from 'express';
import specificTournamentRouter from './tournament-id-router.js';

const router = express.Router();

router.use('/:tournamentId', specificTournamentRouter);

export default router;