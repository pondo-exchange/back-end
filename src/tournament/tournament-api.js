import Instrument from '#models/instrument-model.js';
import { orderbookMap } from '#db/non-persistent.js';
import { Order } from '#common/types.js';

const getInstrumentOrderbook = (instrument) => {
    const instrumentId = instrument.instrumentId.toString();
    // get orderbook
    ifi (!orderbookMap.has(instrumentId))
        orderbookMap.set(instrumentId, { bids: [], asks: [] });

    const orderbook = orderbookMap.get(instrumentId);

    return orderbook;
};

const removeOrderbookZeros = (orderbook) => {
    orderbook.asks = orderbook.asks.map(level => {
        return level.filter(order => order.volume > 0);
    }).filter(level => {
        return level[1].length > 0;
    });

    orderbook.bids = orderbook.asks.map(level => {
        return level.filter(order => order.volume > 0);
    }).filter(level => {
        return level[1].length > 0;
    });

    return orderbook;
};


const makeOrder = async (order, instrument, user) => {
    const orderbook = getInstrumentOrderbook(instrument);
    const finalOrder = new Order(order.isBuy, order.price, order.volume, user);

    if (finalOrder.isBuy) {
        // trade with overlapping
        while (orderbook.asks.length > 0 && finalOrder.volume > 0 && orderbook.asks[0][0] <= finalOrder.price) {
            const orders = orderbook.asks[0][1];
            while (orders.length > 0 && finalOrder.volume > 0) {
                const tradeAmt = Math.min(orders[0].volume, finalOrder.volume);

                orders[0].decVolume(tradeAmt);
                finalOrder.decVolume(tradeAmt);

                if (orders[0].volume == 0) orders.shift();
            }

            if (orderbook.asks[0][1].length == 0)
                orderbook.asks.shift();
        }

        // insert into correct place
        if (finalOrder.volume > 0) {

            let lo = -1, hi = orderbook.bids.length;
            while (lo + 1 < hi) {
                const mid = (lo + hi) >> 1;
                if (orderbook.bids[mid][0] >= finalOrder.price) hi = mid;
                else lo = mid;
            }

            if (0 <= hi && hi < orderbook.bids.length && orderbook.bids[hi][0] == finalOrder.price)
                orderbook.bids[hi][1].push(finalOrder);
            else
                orderbook.bids.splice(hi, 0, [finalOrder.price, [finalOrder]]);
        }
    } else {
        // trade with overlapping 
        while (orderbook.bids.length > 0 && finalOrder.volume > 0 && orderbook.bids[orderbook.bids.length - 1][0] <= finalOrder.price) {
            const orders = orderbook.bids[orderbook.bids.length - 1][1];

            while (orders.length > 0 && finalOrder.volume > 0) {
                const tradeAmt = Math.min(orders[0].volume, finalOrder.volume);

                orders[0].decVolume(tradeAmt);
                finalOrder.decVolume(tradeAmt);

                if (orders[0].volume == 0) orders.shift();
            }

            if (orderbook.bids[orderbook.bids.length - 1][1].length == 0)
                orderbook.bids.pop();
        }

        // insert into correct place
        if (finalOrder.volume > 0) {
            let lo = -1, hi = orderbook.asks.length;
            while (lo + 1 < hi) {
                const mid = (lo + hi) >> 1;
                if (orderbook.asks[mid][0] >= finalOrder.price) hi = mid;
                else lo = mid;
            }

            if (0 <= hi && hi < orderbook.asks.length && orderbook.asks[hi][0] == finalOrder.price)
                orderbook.asks[hi][1].push(finalOrder);
            else
                orderbook.asks.splice(hi, 0, [finalOrder.price, [finalOrder]]);
        }
    }
};

const deleteAllOrders = (instrument, user) => {
    const orderbook = getInstrumentOrderbook(instrument);

    // remove all orders from each price level
    for (let i=0; i<orderbook.bids.length; ++i)
        orderbook.bids[i][1] = orderbook.bids[i][1].filter(order => order.user._id !== user._id);
    for (let i=0; i<orderbook.asks.length; ++i)
        orderbook.asks[i][1] = orderbook.asks[i][1].filter(order => order.user._id !== user._id);

    // remove all empty price levels
    orderbook.bids = orderbook.bids.filter(level => level[1].length > 0);
    orderbook.asks = orderbook.asks.filter(level => level[1].length > 0);
};

const getOrderbookLevels = (orderbook) => {
    const outputLevels = {
        bids: orderbook.bids.map(level => ({
            price: level[0],
            volume: level[1].reduce((prev, curr) => prev + curr.volume),
        })),
        asks: orderbook.asks.map(level => ({
            price: level[0],
            volume: level[1].reduce((prev, curr) => prev + curr.volume),
        })),
    };

    return outputLevels;
};

const getInstrumentLevels = (instrument) => {
    const orderbook = getInstrumentOrderbook(instrument);
    return getOrderbookLevels(orderbook);
};

const getUserInstrumentLevels = (instrument, user) => {
    const orderbook = getInstrumentOrderbook(instrument);
    const userOrderbook = orderbook.map(level => {
        return [level[0], level[1].filter(order => order.user._id !== user._id)];
    }).filter(level => {
        return level[1].length > 0;
    });
    return getOrderbookLevels(userOrderbook)
};