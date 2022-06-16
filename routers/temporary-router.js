import express from 'express';
import checkAuth from '../utils/check-auth.js';

const router = express.Router();

// temporary get users router
import users from '../temp-db.js';

// GET USERS
router.get('/users', (req, res) => {
    return res.json(users);
});

// TEST AUTHORIZATION
router.get('/testauth', checkAuth, (req, res) => {
    return res.status(200).send(`${req.user.username} you made it!`);
});

export default router;