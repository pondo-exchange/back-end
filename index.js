import 'dotenv/config';
import cors from 'cors';
import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import mainRouter from './routers/main-router.js';

// back-end server
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', mainRouter);

const httpServer = http.createServer(app);
const PORT = process.env.PORT || 8080;
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/pondoexchange";

const main = async () => {
    await mongoose.connect(DB_URL);

    // TODO: add https certs and redirect http to https
    httpServer.listen(PORT, () => console.log(`Listening on port ${PORT}..`));
};

main().catch(err => console.log(err));

