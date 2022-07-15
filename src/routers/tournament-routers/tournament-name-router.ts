import mongoose from 'mongoose';
import express, { RequestHandler } from 'express';
import Tournament from '@models/tournament-model';
import UserList from '@models/user-list-model';
import UserDetail from '@models/user-detail-model';
import checkAuth from '@utils/check-auth';
import Instrument from '@models/instrument-model';
import { ExchangeRequest } from '@common/types';

const router = express.Router({ mergeParams: true });

const getTournament: RequestHandler = (req: ExchangeRequest, res, next) => {
    Tournament.findOne({ name: req.params.tournamentName }).then(tournament => {
        if (tournament === null) return res.status(404).send('tournament not found');
        req.tournament = tournament;
        next();
    }).catch(err => {
        return res.sendStatus(500);
    });
};

router.use(getTournament);

router.get('/instruments', (req: ExchangeRequest, res) => {
    return res.json(req.tournament.instruments);
});

router.get('/register-user', checkAuth, async (req: ExchangeRequest, res) => {
    const userList = await UserList.findById(req.tournament.userList);

    if (userList === null) return res.sendStatus(500);

    if (userList.users.includes(new mongoose.Types.ObjectId(req.user!.id))) {
        return res.status(400).json({ error: 'already registered' });
    }

    userList.users.push(new mongoose.Types.ObjectId(req.user!.id));
    await userList.save();

    for (let instrumentName of req.tournament.instruments) {
        const instrument = await Instrument.findOne({ name: instrumentName });
        
        if (instrument === null) return res.sendStatus(500);

        const userDetail = new UserDetail({ 
            userId: req.user!.id,
            instrumentId: instrument._id,
            position: 0,
            balance: 0,
        });
        await userDetail.save();
    }

    res.sendStatus(200);
});

export default router;