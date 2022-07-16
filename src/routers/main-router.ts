import express, { Request, Response, NextFunction } from 'express';
import tempRouter from '../routers/temporary-router';
import authRouter from '../routers/auth-router';
import instrumentRouter from '../routers/tournament-routers/instrument-router';
import tournamentRouter from '../routers/tournament-routers/tournament-router';

const router = express.Router();

router.use(authRouter);
router.use(tempRouter);
router.use('/instrument', instrumentRouter);
router.use('/tournament', tournamentRouter);

// error handling
router.use((req, res, next) => {
    const error = new Error('route not found');
    return next({ status: 404, error });
});

router.use((err: { status?: number, error: Error }, req: Request, res: Response, next: NextFunction) => {
    if (err.status !== undefined)
        return res.status(404).send(err.error.message);
    return res.status(500).send('internal server error');
});

export default router;