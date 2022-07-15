import { Queue } from '@datastructures-js/queue';
import { Order } from './exchange-types';
import { EventEmitter } from 'events';
import { IUser } from './types';

type Comparison<Type> = (a: Type, b: Type) => number;

export class OrderedList<Type> {

    comp: Comparison<Type>;
    arr: Array<Type>;

    constructor(comp: Comparison<Type>) {
        this.comp = comp;
        this.arr = [];
    }

    static fromArray<Type>(arr: Array<Type>, comp: Comparison<Type>) {
        let output = new OrderedList(comp);
        for (let x of arr) {
            output.push(x);
        }
        return output;
    }

    toArray() {
        return [...(this.arr)];
    }

    size() {
        return this.arr.length;
    }

    get(k?: number): Type | undefined {
        if (k === undefined) k = this.size() - 1;

        if (!(0 <= k && k < this.arr.length)) {
            return undefined;
        }

        return this.arr[k];
    }

    pop(k?: number): void {
        if (k === undefined) k = this.size() - 1;

        if (!(0 <= k && k < this.size())) {
            throw new RangeError();
        }

        this.arr.splice(k, 1);
    }

    push(item: Type) {
        // find the last index that we should be inserted
        let ind = this.size();

        for (let i=0; i<this.size(); ++i) {
            if (this.comp(item, this.arr[i]) < 0) {
                ind = i;
                break;
            }
        }

        this.arr.splice(ind, 0, item);
    }

    find(comp: (x: Type) => boolean) {
        return this.arr.find(comp);
    }
}


export class PriceLevelQueue {
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

    removeFromUser(user: IUser) {
        this.queue = Queue.fromArray(this.queue.toArray().filter(order => order.user.id !== user.id));
    }

    filterUser(user: IUser) {
        const newPLQ = new PriceLevelQueue(this.priceLevel);
        newPLQ.queue = Queue.fromArray(this.queue.toArray().filter(order => order.user.id.toString() === user.id.toString()));
        return newPLQ;
    }

    getVolume() {
        return this.queue.toArray().reduce((prev, order) => prev + order.volume, 0);
    }

    getPrice() {
        return this.priceLevel;
    }
};


export class OrderBook extends EventEmitter {
    static TRADE = 'trade'; // on (buyer: User, seller: User, price, volume): void
    name: string;
    bids: OrderedList<PriceLevelQueue>; // TODO: change to template
    asks: OrderedList<PriceLevelQueue>;
    lastPrice: number | null;

    constructor(name: string) {
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
        const isCrossing = order.isBuy ? ((price: number) => price <= order.price) : ((price: number) => order.price <= price);
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
            plq!.addOrder(order);
        }

        return trades;
    }

    getView() {
        return ({ 
            bids: this.bids.toArray().map(plq => ({ price: plq.getPrice(), volume: plq.getVolume() })),
            asks: this.asks.toArray().map(plq => ({ price: plq.getPrice(), volume: plq.getVolume() })),
        });
    }

    getUserView(user: IUser) {
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
        if (this.bids.size() > 0) {
            const bestPLQ = this.bids.get();
            if (bestPLQ === undefined) return this.lastPrice;
            bestPLQ.getPrice();
        }
        return this.lastPrice;
    }

    getAskPrice() {
        // get what items are being sold for
        if (this.asks.size() > 0) {
            const bestPLQ = this.asks.get();
            if (bestPLQ === undefined) return this.lastPrice;
            bestPLQ.getPrice();
        }
        return this.lastPrice;
    }
};
