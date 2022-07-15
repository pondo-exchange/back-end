import mongoose from 'mongoose';

export interface IInstrument {
    name: string;
    userList: mongoose.Types.ObjectId;
};

const InstrumentSchema = new mongoose.Schema<IInstrument>({
    name: { type: String, required: true },
    userList: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
});

const Instrument = mongoose.model<IInstrument>('Instrument', InstrumentSchema);

export default Instrument;