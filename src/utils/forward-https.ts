import { RequestHandler } from 'express';

export const forwardHTTPS: RequestHandler = (req, res) => {
    return res.redirect('https://' + req.headers.host + req.url);
};