import express from 'express';
import checkAuth from '#utils/check-auth.js';
import User from '#models/user-model.js';

const router = express.Router();

// GET USERS
router.get('/users', (req, res) => {
    User.find({}).then(docs => {
        return res.status(200).json(docs);
    }).catch(err => {
        return res.sendStatus(500);
    });
});

// TEST AUTHORIZATION
router.get('/testauth', checkAuth, (req, res) => {
    return res.status(200).send(`${req.user.username} you made it!`);
});

router.get('/reset/:username', (req, res) => {
    const username = req.params.username;
    User.deleteOne({ username }).then(({ deletedCount }) => {
        if (deletedCount === 0) {
            return res.status(404).send(`user ${username} not found`);
        }
        return res.status(200).send('successful resetting user ' + username);
    }).catch(err => {
        return res.status(500).send('unsuccessful resetting user ' + username);
    });
});

router.get('/reset', (req, res) => {
    User.deleteMany({}).then(out => {
        return res.status(200).send('successful reset');
    }).catch(err => {
        return res.status(500).send('unsuccessful resetting Users');
    });
});



/*

TEMP TOURNAMENT ROUTES

*/

router.get('/tournament/:tournamentId/instruments', (req, res) => {
    try {
        const tournamentId = parseInt(req.params.tournamentId);
        return res.json([1, 2]);
    } catch {
        return res.sendStatus(500);
    }
});

router.get('/instrument/:instrumentId/view', checkAuth, (req, res) => {
    return res.json({
        bids: [{ price: 10, volume: 1 }, { price: 11, volume: 1 }],
        asks: [{ price: 12, volume: 2 }, { price: 13, volume: 3 }],
        userBids: [{price: 10, volume: 1}],
        userAsks: [{price: 12, volume: 1}]
    });
});

router.get('/instrument/:instrumentId/profit', checkAuth, (req, res) => {
    return res.json(420);
});

router.get('/instrument/:instrumentId/position', checkAuth, (req, res) => {
    return res.json(-3);
});

router.get('/instrument/:instrumentId/trades', checkAuth, (req, res) => {
    return res.json([
        { isBuy: true, price: 120, volume: 3 }
    ]);
});


export default router;