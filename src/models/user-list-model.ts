import mongoose from 'mongoose';

const UserListSchema = new mongoose.Schema({
    users: {
        type: [ mongoose.Schema.Types.ObjectId ],
        required: true,
    },
});

const UserList = mongoose.model('UserList', UserListSchema);

export default UserList;