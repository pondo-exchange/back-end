import mongoose from 'mongoose';

const InstrumentSchema = new mongoose.Schema({
    userDetails: {
        type: [{
            userId: { type: mongoose.Schema.Types.ObjectId, required: true },
            profit: { type: Number, required: true }
        }],
        required: true,
    }
});

const Instrument = mongoose.model('Instrument', InstrumentSchema);

export default Instrument;