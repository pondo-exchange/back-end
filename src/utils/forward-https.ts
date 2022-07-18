import { RequestHandler } from 'express';

export const forwardHTTPS: RequestHandler = (req, res, next) => {
    if (req.headers.host === undefined) {
        const error = new Error('missing host in header');
        return next({ error });
    }

    if (!req.secure) {
        const new_host = req.headers.host.split(':')[0] + ':8443';
        return res.redirect("https://" + new_host + req.url);
    }

    next();
};