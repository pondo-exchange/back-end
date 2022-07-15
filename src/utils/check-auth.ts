import express, { RequestHandler, Request } from 'express';
import jwt from 'jsonwebtoken';
import User from '@models/user-model';
import { validateUserTokenPayload } from './validators/user-validator';
import { ExchangeRequest, IUser, IUserTokenPayload } from '@common/types';

const checkAuth: RequestHandler = async (req: ExchangeRequest, res, next) => {
    /*

    1. 401 if user not logged in
    2. check the user jwt is correctly signed
    3. update the req to contain the user object

    */

    const sentJWT = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (sentJWT === undefined) {
        return res.status(401).send('authorization header not sent');
    }

    // @ts-ignore
    jwt.verify(sentJWT, process.env.ACCESS_TOKEN_KEY, async (err, decoded) => {
        if (err) {
            return res.status(403).send('invalid authentication');
        }

        if (!validateUserTokenPayload(decoded)) {
            return res.status(400).send('invalid authentication token payload');
        }

        // add user information to the request
        const dbUser = await User.findOne({ username: (decoded as IUserTokenPayload).username });

        // confirm the user in the token actually exists
        if (dbUser === null) {
            return res.status(404).send('');
        }

        req.user = { id: dbUser._id.toString(), username: dbUser.username, perms: dbUser.perms };

        next();
    });
};

export default checkAuth;