import express from 'express';
import checkAuth from '@utils/check-auth';
import User from '@models/user-model';
import UserList from '@models/user-list-model';

const router = express.Router();

// GET USERS
router.get('/users', (req, res) => {
    User.find({}).then(docs => {
        return res.status(200).json(docs);
    }).catch(err => {
        return res.sendStatus(500);
    });
});

router.get('/user-lists', async (req, res) => {
    return res.json(await UserList.find({}));
})

// TEST AUTHORIZATION
router.get('/testauth', checkAuth, (req: any, res) => {
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


router.get('/tournament/name/:tournamentName/instruments', (req, res) => {
    return res.json(['1', '2']);
});

router.get('/instrument/name/:instrumentName/view', checkAuth, (req, res) => {
    return res.json({
        bids: [{ price: 10, volume: 1 }, { price: 11, volume: 1 }],
        asks: [{ price: 12, volume: 2 }, { price: 13, volume: 3 }],
        userBids: [{price: 10, volume: 1}],
        userAsks: [{price: 12, volume: 1}]
    });
});

router.get('/instrument/name/:instrumentName/profit', checkAuth, (req, res) => {
    return res.json(420);
});

router.get('/instrument/name/:instrumentName/position', checkAuth, (req, res) => {
    return res.json(-3);
});

router.get('/instrument/name/:instrumentName/trades', checkAuth, (req, res) => {
    return res.json([
        { isBuy: true, price: 120, volume: 3 }
    ]);
});

/**/


export default router;