import { User, Order, OrderBook } from "#common/types.js";

const orderbook = new OrderBook();

const usera = new User(1, 'a');
const userb = new User(2, 'b');
const userc = new User(3, 'c');
const userd = new User(4, 'd');

orderbook.on(OrderBook.TRADE, (buyer, seller, price, volume) => {
    console.log('Trade occured');
    console.log(buyer);
    console.log(seller);
    console.log(price);
    console.log(volume);
});

orderbook.addOrder(new Order(true, 10, 1, usera));
orderbook.addOrder(new Order(false, 9, 1, userb));

orderbook.addOrder(new Order(false, 9, 1, userb));
orderbook.addOrder(new Order(true, 10, 1, usera));

orderbook.addOrder(new Order(false, 10, 1, userb));
orderbook.addOrder(new Order(true, 9, 1, usera));

