import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: String,
    hashedPassword: String,
});

const User = mongoose.model('User', UserSchema);

export default User;