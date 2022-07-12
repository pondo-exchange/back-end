import mongoose from 'mongoose';

const UserDetailSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    instrumentId: { type: mongoose.Schema.Types.ObjectId, required: true },
    position: { type: Number, required: true },
    balance: { type: Number, required: true },
});

const UserDetail = mongoose.model('UserDetail', UserDetailSchema);

export default UserDetail;