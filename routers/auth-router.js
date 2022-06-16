import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// TODO: replace with database
import users from '../temp-db.js';


router.post('/register', async (req, res) => {
    /*

    1. get the sent username and password
    2. check the username isn't taken
    3. get the hash the password
    4. store that in the database

    */

    if (req.body.user === undefined) {
        return res.status(400).send('invalid payload: no user supplied');
    }

    // get the sent user and password
    const { username, password } = req.body.user;

    // check the username isn't taken
    if (users.find(user => user.username === username)) {
        // idk what error code to send, probably some kind of 400
        return res.status(400).send('username taken');
    }

    // hash the password and store it in the database
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // store the created user
        const newUser = { username, hashedPassword };
        users.push(newUser);

        return res.status(201).send('successfully created user');
    } catch {
        return res.status(500).send('failed to create user');
    }
});

router.post('/login', async (req, res) => {
    /*

    1. get the stored user of sent username and password
    2. compare with the username and password in the database
    3. send auth token if all good

    */

    if (req.body.user === undefined) {
        return res.status(400).send('must send auth details');
    }

    // get the stored user and sent user
    const sentUser = req.body.user;
    const foundUser = users.find(user => user.username === sentUser.username);

    // check the user exists
    if (foundUser === undefined) {
        return res.status(404).send();
    }


    // filter out and return if incorrect password
    try {
        if (!(await bcrypt.compare(sentUser.password, foundUser.hashedPassword))) {
            return res.status(401).send();
        }
    } catch {
        return res.status(500).send();
    }

    // the user is correct, so we can send a jwt with the user information
    const outputUser = {
        username: 'jslew'
    };
    return res.status(200).send(jwt.sign(outputUser, process.env.ACCESS_TOKEN_KEY));
});

export default router;