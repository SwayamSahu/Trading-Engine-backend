import { Order, OrderBookEntry, Trade, OrderBook, OrderType, OrderSide } from './types';
import { OrderValidator } from './validator';
import { Logger } from './logger';
import { TradingError } from './types';

// Handles order processing and matching logic
export class OrderProcessor {
  private orderBook: OrderBook = { buys: [], sells: [] };
  private trades: Trade[] = [];
  private tradeCounter = 1;
  private validator: OrderValidator;
  private logger: Logger;

  constructor() {
    this.validator = new OrderValidator();
    this.logger = new Logger();
  }

  processOrder(order: Order): void {
    this.validator.validateOrder(order);
    if (order.type_op === OrderType.CREATE) {
      this.handleCreateOrder(order);
    } else if (order.type_op === OrderType.DELETE) {
      this.handleDeleteOrder(order);
    }
  }

  private handleCreateOrder(order: Order): void {
    const parsedOrder: OrderBookEntry = {
      order_id: order.order_id,
      account_id: order.account_id,
      amount: parseFloat(order.amount),
      limit_price: parseFloat(order.limit_price),
      side: order.side,
      timestamp: Date.now(),
    };

    const targetBook = order.side === OrderSide.BUY ? this.orderBook.buys : this.orderBook.sells;
    const oppositeBook = order.side === OrderSide.BUY ? this.orderBook.sells : this.orderBook.buys;

    const matchedTrades = this.matchOrder(parsedOrder, oppositeBook);

    if (parsedOrder.amount > 0) {
      targetBook.push(parsedOrder);
      this.sortOrderBook();
    }

    this.trades.push(...matchedTrades);
    this.logger.info(`Processed CREATE order ${order.order_id}: ${matchedTrades.length} trades executed`);
  }

  private matchOrder(order: OrderBookEntry, oppositeBook: OrderBookEntry[]): Trade[] {
    const trades: Trade[] = [];
    let remainingAmount = order.amount;

    for (let i = 0; i < oppositeBook.length && remainingAmount > 0; i++) {
      const oppositeOrder = oppositeBook[i];

      if (
        (order.side === OrderSide.BUY && order.limit_price >= oppositeOrder.limit_price) ||
        (order.side === OrderSide.SELL && order.limit_price <= oppositeOrder.limit_price)
      ) {
        const tradeAmount = Math.min(remainingAmount, oppositeOrder.amount);
        const tradePrice = oppositeOrder.limit_price;

        trades.push({
          trade_id: `T${this.tradeCounter++}`,
          buy_order_id: order.side === OrderSide.BUY ? order.order_id : oppositeOrder.order_id,
          sell_order_id: order.side === OrderSide.SELL ? order.order_id : oppositeOrder.order_id,
          amount: tradeAmount,
          price: tradePrice,
          timestamp: Date.now(),
        });

        remainingAmount -= tradeAmount;
        oppositeOrder.amount -= tradeAmount;

        order.amount = remainingAmount;
      }
    }

    oppositeBook = oppositeBook.filter(o => o.amount > 0);
    if (order.side === OrderSide.BUY) {
      this.orderBook.sells = oppositeBook;
    } else {
      this.orderBook.buys = oppositeBook;
    }

    return trades;
  }

  private handleDeleteOrder(order: Order): void {
    const targetBook = order.side === OrderSide.BUY ? this.orderBook.buys : this.orderBook.sells;
    const index = targetBook.findIndex(o => o.order_id === order.order_id);
    if (index === -1) {
      this.logger.warn(`Attempted to delete non-existent order ${order.order_id}`);
      return;
    }
    targetBook.splice(index, 1);
    this.logger.info(`Deleted order ${order.order_id}`);
  }

  private sortOrderBook(): void {
    this.orderBook.buys.sort((a, b) => b.limit_price - a.limit_price || a.timestamp - b.timestamp);
    this.orderBook.sells.sort((a, b) => a.limit_price - b.limit_price || a.timestamp - b.timestamp);
  }

  getOrderBook(): OrderBook {
    return this.orderBook;
  }

  getTrades(): Trade[] {
    return this.trades;
  }
}