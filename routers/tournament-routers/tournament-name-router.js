import express from 'express';
import Tournament from '#models/tournament-model.js';
import UserList from '#models/user-list-model.js';
import UserDetail from '#models/user-detail-model.js';
import checkAuth from '#utils/check-auth.js';
import Instrument from '#models/instrument-model.js';

const router = express.Router({ mergeParams: true });

const getTournament = (req, res, next) => {
    Tournament.findOne({ name: req.params.tournamentName }).then(tournament => {
        if (tournament === null) return res.status(404).send('tournament not found');
        req.tournament = tournament;
        next();
    }).catch(err => {
        return res.sendStatus(500);
    });
};

router.use(getTournament);

router.get('/instruments', (req, res) => {
    return res.json(req.tournament.instruments);
});

router.get('/register-user', checkAuth, async (req, res) => {
    const userList = await UserList.findById(req.tournament.userList);

    if (userList.users.includes(req.user._id)) {
        return res.status(400).json({ error: 'already registered' });
    }

    userList.users.push(req.user._id);
    await userList.save();

    for (let instrumentName of req.tournament.instruments) {
        const instrument = await Instrument.findOne({ name: instrumentName });
        const userDetail = new UserDetail({ 
            userId: req.user._id,
            instrumentId: instrument._id,
            position: 0,
            balance: 0,
        });
        await userDetail.save();
    }

    res.sendStatus(200);
});

export default router;