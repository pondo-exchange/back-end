# Tournament Backend API

## Functionality to supply (not syntactically identical):

```js
const userId = users.getUserId({ username: 'jslew' });

const myTournament = tournaments.getTournament({ tournamentId: 3 });
const instrumentOne = myTournament.getInstrument({ instrumentId: 1 });

const result = instrumentOne.order(
    new Order({
        userId: userId,
        isBuy: false,
        price: 120,
        volume: 11,
        type: Order.GFD,
    })
);

console.log(result.traded);
// [{ isBuy: false, volume: 1, price: 130 }] in this case they traded a volume 1 with a higher price

console.log(result.nonTraded);
// { isBuy: false, volume: 10, price: 120 } they are left with 10 volume left on the orderbook at their original price (120)

const myTrades = instrumentOne.getUserTrades({ userId: userId }); // [{isBuy: true, volume: 1, price: 120}, { isBuy: false, volume: 1, price: 130 }]
const myPosition = instrumentOne.getUserPosition({ userId: userId }) // 10
const myProfit = instrumentOne.getUserProfit({ userId: userId }); // -1
const myActiveOrders = instrumentOne.getUserActiveOrders({ userId: userId }); // [{ isBuy: false, volume: 10, price: 120 }]
```
