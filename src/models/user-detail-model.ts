import mongoose from 'mongoose';

export interface IUserDetail {
    userId: mongoose.Types.ObjectId;
    instrumentId: mongoose.Types.ObjectId;
    position: number;
    balance: number;
}

const UserDetailSchema = new mongoose.Schema<IUserDetail>({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    instrumentId: { type: mongoose.Schema.Types.ObjectId, required: true },
    position: { type: Number, required: true },
    balance: { type: Number, required: true },
});

const UserDetail = mongoose.model<IUserDetail>('UserDetail', UserDetailSchema);

export default UserDetail;