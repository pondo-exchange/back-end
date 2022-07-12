import mongoose from 'mongoose';

const TournamentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    instruments: {
        type: [ String ],
        required: true,
    },
    userList: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
});

const Tournament = mongoose.model('Tournament', TournamentSchema);

export default Tournament;