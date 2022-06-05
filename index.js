import 'dotenv/config';
import http from 'http';
import express from 'express';

// back-end server
const app = express();

// temporary endpoint for testing
app.get('/api/get-live-tournaments', (req, res) => {
    res.json(
        [
            {
                'name': 'Sample Live Tournament B',
                'uuid': 'ed72e3b7-8a72-44d4-8da8-fa60c2246c7a'
            },
            {
                'name': 'Sample Live Tournament A',
                'uuid': 'ed72e3b7-8a72-44d4-8da8-fa60c2246c7a'
            },
        ]
    );
});

app.get('/api/get-past-tournaments', (req, res) => {
    res.json(
        [
            {
                'name': 'Sample Past Tournament A',
                'uuid': 'e1618396-16f9-4341-9940-77a6ba7fd365'
            },
            {
                'name': 'Sample Past Tournament B',
                'uuid': 'e1618396-16f9-4341-9940-77a6ba7fd365'
            },
        ]
    );
});

// TODO: add https certs and redirect http to https
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => console.log(`Listening on port ${PORT}..`));
