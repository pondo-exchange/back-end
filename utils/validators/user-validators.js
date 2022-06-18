const USERNAME_MIN_LENGTH = 5;
const USERNAME_MAX_LENGTH = 16;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 32;

const USERNAME_CHAR_PATTERN = /^[a-zA-z0-9]+$/

const hasUser = (req, res, next) => {
    const {username, password} = req.body.user || {};
    if (username === undefined || password === undefined) {
        return res.status(400).send('invalid payload: no user supplied');
    }
    next();
}

const checkUsernameChars = username => {
    return USERNAME_CHAR_PATTERN.test(username);
};

const userValidator = (req, res, next) => {
    const n = req.body.user.username.length;
    const m = req.body.user.password.length;

    if (!(USERNAME_MIN_LENGTH <= n && n <= USERNAME_MAX_LENGTH)) {
        return res.status(400).send(`username not between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters`);
    }

    if (!(PASSWORD_MIN_LENGTH <= n && n <= PASSWORD_MAX_LENGTH)) {
        return res.status(400).send(`password not between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters`);
    }

    if (!checkUsernameChars(req.body.user.username)) {
        return res.status(400).send('username does not only contain alphanumeric characters');
    }

    next();
};

const registerValidator = [hasUser, userValidator];

export { hasUser, userValidator, registerValidator };