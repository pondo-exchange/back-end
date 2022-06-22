import express from 'express';

const router = express.Router();

const validateTournamentId = (req, res, next) => {
    if (!tournament.find())
    return res.status(404).send('invalid tournament id')
}

router.user(validateTournamentId);

export default router;