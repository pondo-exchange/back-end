import express from 'express';
import Instrument from '#models/instrument-model.js';
import { validateBodyOrder } from '#validators/order-validator.js';
import checkAuth from '#utils/check-auth.js';
import { Order, OrderBook } from '#common/types.js';
import { orderbookMap } from '#db/non-persistent.js';
import UserList from '#models/user-list-model.js';
import UserDetail from '#models/user-detail-model.js';

const router = express.Router({ mergeParams: true });

const getInstrument = (req, res, next) => {
    Instrument.findOne({ name: req.params.instrumentName }).then(instrument => {
        if (instrument === null) return res.status(404).send('instrument not found');
        req.instrument = instrument;
        next();
    }).catch(err => {
        return res.sendStatus(500);
    });
};

const checkUserRegistered = async (req, res, next) => {
    const userList = await UserList.findById(req.instrument.userList);
    if (!userList.users.includes(req.user._id)) return res.status(403).send('user not allowed to use this instrument');
    next();
};

const getOrderBook = (req, res, next) => {
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
router.post('/order', validateBodyOrder, getOrderBook, (req, res) => {
    const { order: { isBuy, price, volume }, instrument } = req.body;
    const user = req.user;

    const order = new Order(isBuy, price, volume, user);
    const trades = req.orderbook.addOrder(order);

    return res.status(200).json(trades);
});

router.get('/view', getOrderBook, (req, res) => {
    return res.json({ ...req.orderbook.getView(), ...req.orderbook.getUserView(req.user) })
});

router.get('/position', async (req, res) => {
    const userDetails = await UserDetail.findOne({ userId: req.user._id, instrumentId: req.instrument._id })
    return res.json({ position: userDetails.position });
});

router.get('/balance', async (req, res) => {
    const userDetails = await UserDetail.findOne({ userId: req.user._id, instrumentId: req.instrument._id })
    return res.json({ balance: userDetails.balance });
});

router.get('/profit', getOrderBook, async (req, res) => {
    const userDetails = await UserDetail.findOne({ userId: req.user._id, instrumentId: req.instrument._id })
    const { position, balance } = userDetails;
    const tradePrice = req.orderbook.getLastPrice();
    const profit = position !== 0 && tradePrice === null ? null : (balance + (position == 0 ? 0 : position * tradePrice));
    return res.json({ profit })
});

router.get('/user-details', getOrderBook, async (req, res) => {
    const userDetails = await UserDetail.findOne({ userId: req.user._id, instrumentId: req.instrument._id })
    const tradePrice = req.orderbook.getLastPrice();
    const profit = position !== 0 && tradePrice === null ? null : (balance + (position == 0 ? 0 : position * tradePrice));
    return res.json({ position: userDetails.position, balance: userDetails.balance, profit });
});


export default router;