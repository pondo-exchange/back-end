import 'module-alias/register';
import 'dotenv/config';
import cors from 'cors';
import http from 'http';
import https from 'https';
import express from 'express';
import mongoose from 'mongoose';
import mainRouter from './routers/main-router';
import path from 'path';
import { forwardHTTPS } from './utils/forward-https';
import { readFileSync as read } from 'fs';

// back-end server
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', mainRouter);

const httpApp = express();
httpApp.get('*', forwardHTTPS);

const httpServer = http.createServer();
const httpsServer = https.createServer({
    key: read(path.join(__dirname, 'keys/privkey.pem')),
    cert: read(path.join(__dirname, 'keys/fullchain.pem'))
}, app);


const PORT = process.env.PORT || 8080;
const SECURE_PORT = process.env.SECURE_PORT || 8443;

const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/pondoexchange";

const main = async () => {
    await mongoose.connect(DB_URL);

    // TODO: add https certs and redirect http to https
    if (process.env.ALLOW_HTTP)
        httpServer.listen(PORT, () => console.log(`http server running on port ${PORT}`));
    httpsServer.listen(SECURE_PORT, () => console.log(`https server running on port ${SECURE_PORT}`));
};

main().catch(err => console.log(err));

