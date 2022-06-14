import express from 'express';

const router = express.Router();

router.get('/get-live-tournaments', (req, res) => {
    res.json(
        [
            {
                'name': 'Sample Live Tournament A',
                'uuid': 'ed72e3b7-8a72-44d4-8da8-fa60c1246c7a'
            },
            {
                'name': 'Sample Live Tournament B',
                'uuid': 'ed72e3b7-8a72-44d4-8da8-fa60c2246c7a'
            },
        ]
    );
});

router.get('/get-past-tournaments', (req, res) => {
    res.json(
        [
            {
                'name': 'Sample Past Tournament A',
                'uuid': 'e1618396-16f9-4341-9940-77a6ba7fd365'
            },
            {
                'name': 'Sample Past Tournament B',
                'uuid': 'e1618396-16f9-4341-9920-77a6ba7fd365'
            },
        ]
    );
});

export default router;