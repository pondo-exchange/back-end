import express from 'express';
import specificRouter from './specific-tournament-router';

const router = express.Router();

// general tournament routing (with no ID)

// specific tournament routing (with ID)
router.use('/:tournamentId', specificRouter);

export default router;