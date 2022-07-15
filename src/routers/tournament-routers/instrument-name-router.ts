import express, { Request, Response, RequestHandler } from 'express';
import Instrument from '@models/instrument-model';
import { validateBodyOrder } from '@validators/order-validator';
import checkAuth from '@utils/check-auth';
import { Order } from '@root/common/exchange-types';
import { OrderBook } from "@common/exchange-ds";
import { orderbookMap } from '@db/non-persistent';
import UserList from '@models/user-list-model';
import { ExchangeRequest, IUser } from '@common/types';
import UserDetail from '@models/user-detail-model';
import mongoose from 'mongoose';

const router = express.Router({ mergeParams: true });

const getInstrument: RequestHandler = (req: ExchangeRequest, res: Response, next) => {
    Instrument.findOne({ name: req.params.instrumentName }).then(instrument => {
        if (instrument === null) return res.status(404).send('instrument not found');
        req.instrument = instrument;
        next();
    }).catch(err => {
        return res.sendStatus(500);
    });
};

const checkUserRegistered: RequestHandler = async (req: ExchangeRequest, res, next) => {
    const userList = await UserList.findById(req.instrument.userList);
    if (userList === null) return res.sendStatus(500);
    if (req.user === undefined) return res.sendStatus(500);
    const id = new mongoose.Types.ObjectId(req.user.id)
    if (!userList.users.includes(id)) return res.status(403).send('user not allowed to use this instrument');
    next();
};

const getOrderBook: RequestHandler = (req: ExchangeRequest, res, next) => {
    if (orderbookMap.get(req.instrument.name) === undefined) {
        const orderbook = new OrderBook(req.instrument.name);
        orderbook.on(OrderBook.TRADE, (buyer, seller, price, volume) => {
            UserDetail.findOneAndUpdate(
                { userId: buyer._id, instrumentId: req.instrument._id },
                { $inc: { position: volume }}
            ).catch(err => console.log('error while updating position and volume of user ' + buyer.username))
            UserDetail.findOneAndUpdate(
                { userId: buyer._id, instrumentId: req.instrument._id },
                { $inc: { balance: -price * volume }}
            ).catch(err => console.log('error while updating position and volume of user ' + buyer.username))
            UserDetail.findOneAndUpdate(
                { userId: seller._id, instrumentId: req.instrument._id },
                { $inc: { position: -volume }}
            ).catch(err => console.log('error while updating position and volume of user ' + seller.username))
            UserDetail.findOneAndUpdate(
                { userId: seller._id, instrumentId: req.instrument._id },
                { $inc: { balance: price * volume }}
            ).catch(err => console.log('error while updating position and volume of user ' + seller.username))
        });
        orderbookMap.set(req.instrument.name, orderbook);
    }
    req.orderbook = orderbookMap.get(req.instrument.name);
    next();
};

router.use(getInstrument);

// user routes
router.use(checkAuth);
router.use(checkUserRegistered);

// make an order
router.post('/order', validateBodyOrder, getOrderBook, (req: ExchangeRequest, res) => {
    const { order: { isBuy, price, volume }, instrument } = req.body;
    const user = (req.user! as IUser);

    const order = new Order(isBuy, price, volume, user);
    const trades = req.orderbook!.addOrder(order);

    return res.status(200).json(trades);
});

router.get('/view', getOrderBook, (req: ExchangeRequest, res) => {
    return res.json({ ...req.orderbook!.getView(), ...req.orderbook!.getUserView(req.user!) })
});

router.get('/position', async (req: ExchangeRequest, res) => {
    if (req.user === undefined) return res.sendStatus(500);
    const userDetails = await UserDetail.findOne({ userId: req.user.id, instrumentId: req.instrument._id })
    if (userDetails === null) return res.status(500);
    return res.json({ position: userDetails.position });
});

router.get('/balance', async (req: ExchangeRequest, res) => {
    if (req.user === undefined) return res.sendStatus(500);
    const userDetails = await UserDetail.findOne({ userId: req.user.id, instrumentId: req.instrument._id })
    if (userDetails === null) return res.status(500);
    return res.json({ balance: userDetails.balance });
});

router.get('/profit', getOrderBook, async (req: ExchangeRequest, res) => {
    if (req.user === undefined) return res.sendStatus(500);
    const userDetails = await UserDetail.findOne({ userId: req.user.id, instrumentId: req.instrument._id })
    if (userDetails === null) return res.status(500);
    const { position, balance } = userDetails;
    const tradePrice = req.orderbook!.getLastPrice();
    const profit = position !== 0 && tradePrice === null ? null : (balance + (position === 0 ? 0 : position * tradePrice!));
    return res.json({ profit })
});

router.get('/user-details', getOrderBook, async (req: ExchangeRequest, res) => {
    if (req.user === undefined) return res.sendStatus(500);
    const userDetails = await UserDetail.findOne({ userId: req.user.id, instrumentId: req.instrument._id })
    if (userDetails === null) return res.status(500);
    const tradePrice = req.orderbook!.getLastPrice();
    const { position, balance } = userDetails;
    const profit = position !== 0 && tradePrice === null ? null : (balance + (position === 0 ? 0 : position * tradePrice!));
    return res.json({ position: userDetails.position, balance: userDetails.balance, profit });
});


export default router;