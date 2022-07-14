import joi from 'joi';

const userSchema = joi.object({
    username: joi.string().alphanum().min(5).max(16).required(),
    hashedPassword: joi.string().min(8).max(32).required(),
}).unknown(true).required();

const registerSchema = userSchema.append({
});

const validateBodyUser = (req, res, next) => {
    const { error: err } = userSchema.validate(req.body.user);
    if (err !== undefined) return res.status(400).send('invalid user payload');
    next();
};

const registerValidator = (req, res, next) => {
    const { error: err } = registerSchema.validate(req.body.user);
    if (err !== undefined) return res.status(400).send('invalid user payload');
    next();
};

export { validateBodyUser, registerValidator };