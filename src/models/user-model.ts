import mongoose from 'mongoose';


export interface IUser {
    username: string;
    hashedPassword: string;
    perms?: { admin?: boolean }
};

const UserSchema = new mongoose.Schema<IUser>({
    username: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    perms: {
        type: {
            admin: { type: Boolean, required: false },
        },
        required: false,
    }
});

const User = mongoose.model('User', UserSchema);

export default User;