import mongoose from 'mongoose';


export interface IUserList {
    users: Array<mongoose.Types.ObjectId>;
}

const UserListSchema = new mongoose.Schema<IUserList>({
    users: {
        type: [ mongoose.Schema.Types.ObjectId ],
        required: true,
    },
});

const UserList = mongoose.model<IUserList>('UserList', UserListSchema);

export default UserList;