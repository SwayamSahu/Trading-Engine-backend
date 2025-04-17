import { Order, OrderType, OrderSide, TradingError } from './types';
import { CONFIG } from './config';

// Validates order data before processing
export class OrderValidator {
  validateOrder(order: Order): void {
    if (!order.order_id || typeof order.order_id !== 'string') {
      throw new TradingError('Order ID must be a non-empty string', 'InvalidOrderId');
    }
    if (!order.account_id || typeof order.account_id !== 'string') {
      throw new TradingError('Account ID must be a non-empty string', 'InvalidAccountId');
    }
    if (!Object.values(OrderType).includes(order.type_op)) {
      throw new TradingError(`Invalid order type: ${order.type_op}`, 'InvalidOrderType');
    }
    if (!Object.values(OrderSide).includes(order.side)) {
      throw new TradingError(`Invalid order side: ${order.side}`, 'InvalidOrderSide');
    }
    if (order.pair !== CONFIG.TRADING_PAIR) {
      throw new TradingError(`Invalid trading pair: ${order.pair}`, 'InvalidTradingPair');
    }

    const amount = parseFloat(order.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new TradingError(`Invalid amount: ${order.amount}`, 'InvalidAmount');
    }

    const price = parseFloat(order.limit_price);
    if (isNaN(price) || price <= 0) {
      throw new TradingError(`Invalid limit price: ${order.limit_price}`, 'InvalidPrice');
    }
  }
}