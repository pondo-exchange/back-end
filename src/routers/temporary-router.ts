import express from 'express';
import checkAuth from '../utils/check-auth';
import User from '../models/user-model';
import { IUser } from '../common/types';
import UserList from '../models/user-list-model';

const router = express.Router();

// GET USERS
router.get('/users', (req, res) => {
    User.find({}).then(userDocs => {
        return userDocs.map(user => user.username)
    }).then(usernames => {
        return res.status(200).json(usernames);
    }).catch(err => {
        return res.sendStatus(500);
    });
});

router.get('/user-lists', async (req, res) => {
    return res.json(
        (await UserList.find({})).map(userList => userList.users)
    );
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


export default router;