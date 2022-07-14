import { Queue } from '@datastructures-js/queue';
import { OrderedList } from './custom-ds';
import { EventEmitter } from 'events';
import mongoose, { ObjectId } from 'mongoose';

const { ObjectId } = mongoose.Types;

type UserPerms = {
    admin?: boolean;
}

class User {
    _id: ObjectId;
    username: string;
    perms?: UserPerms;

    constructor(id: ObjectId, username: string, perms: UserPerms = {}) {
        this._id = id; // _id for compatibility reasons
        this.username = username;
        this.perms = perms;
    }
};


class Order {
    isBuy: boolean;
    price: number;
    volume: number;
    user: User;

    constructor(isBuy: boolean, price: number, volume: number, user: User) {
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


class PriceLevelQueue {
    priceLevel: number;
    queue: Queue<Order>;

    constructor(priceLevel: number) {
        this.priceLevel = priceLevel;
        this.queue = new Queue<Order>();
    }

    front() {
        return this.queue.front();
    }

    pop() {
        return this.queue.pop();
    }

    back() {
        return this.queue.back();
    }

    size() {
        return this.queue.size();
    }

    addOrder(order: Order) {
        this.queue.enqueue(order);
    }

    removeFromUser(user: User) {
        this.queue = Queue.fromArray(this.queue.toArray().filter(order => order.user._id !== user._id));
    }

    filterUser(user: User) {
        const newPLQ = new PriceLevelQueue(this.priceLevel);
        newPLQ.queue = Queue.fromArray(this.queue.toArray().filter(order => order.user._id.toString() === user._id.toString()));
        return newPLQ;
    }

    getVolume() {
        return this.queue.toArray().reduce((prev, order) => prev + order.volume, 0);
    }

    getPrice() {
        return this.priceLevel;
    }
}


class OrderBook extends EventEmitter {
    static TRADE = 'trade'; // on (buyer: User, seller: User, price, volume): void
    name: string;
    bids: OrderedList<PriceLevelQueue>; // TODO: change to template
    asks: OrderedList<PriceLevelQueue>;
    lastPrice: number;

    constructor(name) {
        super();

        this.name = name;

        // OrderedList<PriceLevelQueue>
        this.bids = new OrderedList((a, b) => a.priceLevel - b.priceLevel); // largest at the end
        this.asks = new OrderedList((a, b) => b.priceLevel - a.priceLevel); // smallest at the end

        this.lastPrice = null;
        this.on(OrderBook.TRADE, (buyer, seller, price, volume) => {
            this.lastPrice = price;
        });
    }


    addOrder(order: Order) {
        // trade while can trade
        const opposing = order.isBuy ? this.asks : this.bids;
        const isCrossing = order.isBuy ? (price => price <= order.price) : (price => order.price <= price);
        const trades = [];

        let nextPLQ = opposing.get();
        while (order.volume > 0 && nextPLQ !== undefined && isCrossing(nextPLQ.getPrice())) {
            while (order.volume > 0 && nextPLQ.size() > 0) {
                const opposingOrder = nextPLQ.front();
                const tradeVol = Order.trade(opposingOrder, order);

                trades.push({ price: nextPLQ.getPrice(), volume: tradeVol });

                const [buyer, seller] = order.isBuy ? [order.user, opposingOrder.user] : [opposingOrder.user, order.user];

                // emit trade event
                this.emit(OrderBook.TRADE, buyer, seller, nextPLQ.getPrice(), tradeVol);

                if (opposingOrder.volume == 0) nextPLQ.pop();
            }

            if (nextPLQ.size() == 0) opposing.pop();
            nextPLQ = opposing.get();
        }

        // add order
        if (order.volume > 0) {
            const plqOL = order.isBuy ? this.bids : this.asks;

            if (plqOL.find(plq => plq.getPrice() === order.price) === undefined) {
                plqOL.push(new PriceLevelQueue(order.price));
            }

            const plq = plqOL.find(plq => plq.getPrice() === order.price);
            plq.addOrder(order);
        }

        return trades;
    }

    getView() {
        return ({ 
            bids: this.bids.toArray().map(plq => ({ price: plq.getPrice(), volume: plq.getVolume() })),
            asks: this.asks.toArray().map(plq => ({ price: plq.getPrice(), volume: plq.getVolume() })),
        });
    }

    getUserView(user: User) {
        const userBids = this.bids.toArray().map(plq => plq.filterUser(user));
        const userAsks = this.asks.toArray().map(plq => plq.filterUser(user));

        return ({ 
            userBids: userBids
                .filter(plq => plq.getVolume() > 0)
                .map(plq => ({ price: plq.getPrice(), volume: plq.getVolume() })),
            userAsks: userAsks
                .filter(plq => plq.getVolume() > 0)
                .map(plq => ({ price: plq.getPrice(), volume: plq.getVolume() })),
        });
    }

    getLastPrice() {
        return this.lastPrice;
    }

    getBidPrice() {
        // get what items are being bought for
        if (this.bids.size() > 0) return this.bids.get().getPrice();
        return this.lastPrice;
    }

    getAskPrice() {
        // get what items are being sold for
        if (this.asks.size() > 0) return this.asks.get().getPrice();
        return this.lastPrice;
    }
};


export { Order, OrderBook, User, PriceLevelQueue };