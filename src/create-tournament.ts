/**
 * TODO: MAKE INTO ENDPOINTS TO BE DONE ON ADMIN PANEL LATER
 */
import mongoose from 'mongoose';
import UserList from './models/user-list-model';
import Instrument from './models/instrument-model';
import Tournament from './models/tournament-model';
import UserDetail from './models/user-detail-model';
import { IUser } from './common/types';

const clearAll = async () => {
    await UserList.deleteMany({});
    await Instrument.deleteMany({});
    await Tournament.deleteMany({});
    await UserDetail.deleteMany({}); 
};

const createUserList = async () => {
    const userList = new UserList({ users: [] });
    const userListDoc = await userList.save();
    return userListDoc;
};

const createInstrument = async (instrumentName: string, userListId: mongoose.Types.ObjectId) => {
    const instrument = new Instrument({
        name: instrumentName,
        userList: userListId,
    });
    const instrumentDoc = await instrument.save();
    return instrumentDoc;
};

const createTournament = async (tournamentName: string, instrumentNames: Array<string>) => {
    const userListDoc = await createUserList();
    const instrumentDocs = [];
    for (let instrumentName of instrumentNames) {
        instrumentDocs.push(await createInstrument(instrumentName, userListDoc._id));
    }
    const tournament = new Tournament({
        name: tournamentName,
        instruments: instrumentNames,
        userList: userListDoc._id,
    });
    const tournamentDoc = await tournament.save();
    return tournamentDoc;
};


const PORT = process.env.PORT || 8080;
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/pondoexchange";

const main = async () => {
    const db = await mongoose.connect(DB_URL);
    await clearAll();
    await createTournament('a', ['a-insa', 'a-insb']);
    mongoose.disconnect();
};

main().catch(err => console.log(err));
