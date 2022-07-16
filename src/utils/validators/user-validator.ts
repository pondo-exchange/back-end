import { RequestHandler } from 'express';
import joi from 'joi';

export const userSchema = joi.object({
    username: joi.string().alphanum().min(5).max(16).required(),
    password: joi.string().min(8).max(32).required(),
    perms: joi.object({ admin: joi.boolean() }),
}).unknown(true).required();

export const registerSchema = userSchema.append({
});

export const userTokenPayloadSchema = joi.object({
    username: joi.string().alphanum().min(5).max(16).required()
}).unknown(true).required();

export const validateBodyUser: RequestHandler = (req, res, next) => {
    const { error: err } = userSchema.validate(req.body.user);
    if (err !== undefined) {
        return next({ status: 400, error: err });
    }
    next();
};

export const isUserTokenPayload = (payload: any) => {
    const { error: err } = userTokenPayloadSchema.validate(payload);

    return err !== undefined;
};

export const registerValidator: RequestHandler = (req, res, next) => {
    const { error: err } = registerSchema.validate(req.body.user);

    if (err !== undefined)
        return next({ status: 400, error: err });

    next();
};