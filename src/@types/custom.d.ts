import { IUser } from '@common/types';
import { Request } from 'express';
import { OrderBook } from '@common/ds';

declare global {
    namespace Express {
        export interface Request {
            user?: IUser;
            orderbook?: OrderBook;
            tournament?: any;
            instrument?: any;
        }
    }
}
