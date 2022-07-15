import mongoose from 'mongoose';

export interface ITournament {
    name: string;
    instruments: Array<string>;
    userList: mongoose.Types.ObjectId;
};

const TournamentSchema = new mongoose.Schema<ITournament>({
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

const Tournament = mongoose.model<ITournament>('Tournament', TournamentSchema);

export default Tournament;