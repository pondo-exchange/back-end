import express from 'express';
import specificInstrumentRouter from './instrument-name-router';

const router = express.Router({ mergeParams: true });

router.use('/name/:instrumentName', specificInstrumentRouter);

export default router;