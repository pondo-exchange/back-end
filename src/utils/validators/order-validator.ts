import joi from 'joi';
import { RequestHandler } from 'express';

export const orderSchema = joi.object({
    isBuy: joi.bool().required(),
    price: joi.number().integer().positive().required(),
    volume: joi.number().integer().positive().required()
}).unknown(true).required();

export const validateBodyOrder: RequestHandler = (req, res, next) => {
    const { error: err } = orderSchema.validate(req.body.order);
    if (err !== undefined) {
        next({ status: 400, error: err })
    };
    next();
};
