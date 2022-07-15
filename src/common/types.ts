import { Request } from "express";
import { OrderBook } from "./exchange-ds";

export interface IUserPerms {
    admin?: boolean;
}

export interface IUser {
    id: string;
    username: string;
    perms: IUserPerms;
};

export interface IUserTokenPayload {
    username: string;
}

export type RequestBody<T> = Request<{}, {}, T>;

export interface ExchangeRequest extends Request {
    user?: IUser;
    orderbook?: OrderBook;
    tournament?: any;
    instrument?: any;
};