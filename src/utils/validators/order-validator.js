import joi from 'joi';

const orderSchema = joi.object({
    isBuy: joi.bool().required(),
    price: joi.number().integer().positive().required(),
    volume: joi.number().integer().positive().required()
}).unknown(true).required();

const validateBodyOrder = (req, res, next) => {
    const { err } = orderSchema.validate(req.body.order);
    if (err !== undefined) return res.status(400).send('invalid order payload');
    next();
};

export { validateBodyOrder };
