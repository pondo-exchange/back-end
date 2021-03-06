import express from 'express';
import jwt from 'jsonwebtoken';
import User from '#models/user-model.js';
import { User as UserType } from '#common/types.js';

const checkAuth = async (req, res, next) => {
    /*

    1. 401 if user not logged in
    2. check the user jwt is correctly signed
    3. update the req to contain the user object

    */

    const sentJWT = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (sentJWT === undefined) {
        return res.status(401).send('authorization header not sent');
    }

    jwt.verify(sentJWT, process.env.ACCESS_TOKEN_KEY, async (err, decoded) => {
        if (err) {
            return res.status(403).send('invalid authentication');
        }

        // add user information to the request
        const dbUser = await User.findOne({ username: decoded.username });

        // confirm the user in the token actually exists
        if (dbUser === null) {
            return res.status(404).send('');
        }

        req.user = new UserType(dbUser._id, dbUser.username);

        next();
    });
};

export default checkAuth;