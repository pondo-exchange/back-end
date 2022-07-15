import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { IUser } from './types';

export class Order {
    isBuy: boolean;
    price: number;
    volume: number;
    user: IUser;

    constructor(isBuy: boolean, price: number, volume: number, user: IUser) {
        this.isBuy = isBuy;
        this.price = price;
        this.volume = volume;
        this.user = user;
    }

    decVolume(volume: number) {
        this.volume -= volume;
    }

    static trade(orderA: Order, orderB: Order) {
        const tradeVol = Math.min(orderA.volume, orderB.volume);

        orderA.decVolume(tradeVol);
        orderB.decVolume(tradeVol);

        return tradeVol;
    }
};