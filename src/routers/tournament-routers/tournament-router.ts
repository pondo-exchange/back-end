import express from 'express';
import specificTournamentRouter from './tournament-name-router';
import Tournament from '@models/tournament-model';

const router = express.Router({ mergeParams: true });

router.use('/name/:tournamentName', specificTournamentRouter);

router.get('/list', async (req, res) => {
    const tournaments = await Tournament.find({});
    return res.json(tournaments);
});

export default router;