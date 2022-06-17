import express from 'express';
import checkAuth from '../utils/check-auth.js';
import User from '../models/user-model.js';

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

router.get('/reset', (req, res) => {
    User.deleteMany({}).then(out => {
        return res.status(200).send('successful reset');
    }).catch(err => {
        return res.status(500).send('unsuccessful resetting Users');
    });
});

export default router;