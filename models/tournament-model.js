import mongoose from 'mongoose';

const TournamentSchema = new mongoose.Schema({
    tournamentId: Number,
    instruments: [ Number ],
    registeredUsers: [ Schema.Types.ObjectId ],
});

const Tournament = mongoose.model('Tournament', TournamentSchema);

export default Tournament;