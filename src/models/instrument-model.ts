import mongoose from 'mongoose';

const InstrumentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userList: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
});

const Instrument = mongoose.model('Instrument', InstrumentSchema);

export default Instrument;