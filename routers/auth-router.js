import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user-model.js';

const router = express.Router();

const hasUser = (req, res, next) => {
    const {username, password} = req.body.user || {};
    if (username === undefined || password === undefined) {
        return res.status(400).send('invalid payload: no user supplied');
    }
    next();
}

router.post('/register', hasUser, async (req, res) => {
    /*

    1. get the sent username and password
    2. check the username isn't taken
    3. get the hash the password
    4. store that in the database

    */

    // get the sent user and password
    const sentUser = req.body.user;

    // check the username isn't taken
    const dbUser = await User.findOne({ username: sentUser.username });
    if (dbUser !== null) {
        // idk what error code to send, probably some kind of 400
        return res.status(400).send('username taken');
    }

    // hash the password and store it in the database
    try {
        const hashedPassword = await bcrypt.hash(sentUser.password, 10);

        // store the created user
        const newUser = User({ username: sentUser.username, hashedPassword });
        await newUser.save();

        return res.status(201).send('successfully created user');
    } catch {
        return res.status(500).send('failed to create user');
    }
});

router.post('/login', hasUser, async (req, res) => {
    /*

    1. get the stored user of sent username and password
    2. compare with the username and password in the database
    3. send auth token if all good

    */

    // get the stored user and sent user
    const sentUser = req.body.user;
    const dbUser = await User.findOne({ username: sentUser.username })

    // check the user exists
    if (dbUser === null) {
        return res.status(404).send();
    }


    // filter out and return if incorrect password
    try {
        if (!(await bcrypt.compare(sentUser.password, dbUser.hashedPassword))) {
            return res.status(401).send();
        }
    } catch {
        return res.status(500).send();
    }

    // the user is correct, so we can send a jwt with the user information
    const outputUser = { username: 'jslew' };

    return res.status(200).send(jwt.sign(outputUser, process.env.ACCESS_TOKEN_KEY));
});

export default router;