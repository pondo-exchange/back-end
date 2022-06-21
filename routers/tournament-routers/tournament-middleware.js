const getTournament = (req, res, next) => {
    if (req.params.tournamentId === undefined) {
        return res.status(404).send('tournament object not found');
    }

    next();
};

export default getTournament;