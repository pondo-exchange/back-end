import mongoose from 'mongoose';

const TournamentSchema = new mongoose.Schema({
    instruments: {
        type: [ Number ],
        required: true,
    },
    registeredUsers: {
        type: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
        required: true,
    },
});

const Tournament = mongoose.model('Tournament', TournamentSchema);

export default Tournament;