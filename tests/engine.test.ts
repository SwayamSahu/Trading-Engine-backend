import { OrderProcessor } from '../src/orderProcessor';
import { OrderValidator } from '../src/validator';
import { Order, OrderType, OrderSide, TradingError } from '../src/types';

describe('OrderProcessor', () => {
  let processor: OrderProcessor;

  beforeEach(() => {
    processor = new OrderProcessor();
  });

  test('should match buy and sell orders at same price', () => {
    const orders: Order[] = [
      {
        type_op: OrderType.CREATE,
        account_id: '1',
        amount: '0.00230',
        order_id: '1',
        pair: 'BTC/USDC',
        limit_price: '63500.00',
        side: OrderSide.SELL,
      },
      {
        type_op: OrderType.CREATE,
        account_id: '2',
        amount: '0.00230',
        order_id: '2',
        pair: 'BTC/USDC',
        limit_price: '63500.00',
        side: OrderSide.BUY,
      },
    ];

    processor.processOrder(orders[0]);
    processor.processOrder(orders[1]);

    const trades = processor.getTrades();
    expect(trades).toHaveLength(1);
    expect(trades[0]).toMatchObject({
      buy_order_id: '2',
      sell_order_id: '1',
      amount: 0.0023,
      price: 63500.0,
    });

    const orderBook = processor.getOrderBook();
    expect(orderBook.buys).toHaveLength(0);
    expect(orderBook.sells).toHaveLength(0);
  });

  test('should handle partial order matching', () => {
    const orders: Order[] = [
      {
        type_op: OrderType.CREATE,
        account_id: '1',
        amount: '0.00500',
        order_id: '1',
        pair: 'BTC/USDC',
        limit_price: '63500.00',
        side: OrderSide.SELL,
      },
      {
        type_op: OrderType.CREATE,
        account_id: '2',
        amount: '0.00230',
        order_id: '2',
        pair: 'BTC/USDC',
        limit_price: '63500.00',
        side: OrderSide.BUY,
      },
    ];

    processor.processOrder(orders[0]);
    processor.processOrder(orders[1]);

    const trades = processor.getTrades();
    expect(trades).toHaveLength(1);
    expect(trades[0].amount).toBe(0.0023);

    const orderBook = processor.getOrderBook();
    expect(orderBook.sells).toHaveLength(1);
    expect(orderBook.sells[0].amount).toBeCloseTo(0.0027);
  });

  test('should delete existing order', () => {
    const orders: Order[] = [
      {
        type_op: OrderType.CREATE,
        account_id: '1',
        amount: '0.00230',
        order_id: '1',
        pair: 'BTC/USDC',
        limit_price: '63500.00',
        side: OrderSide.SELL,
      },
      {
        type_op: OrderType.DELETE,
        account_id: '1',
        amount: '0.00230',
        order_id: '1',
        pair: 'BTC/USDC',
        limit_price: '63500.00',
        side: OrderSide.SELL,
      },
    ];

    processor.processOrder(orders[0]);
    processor.processOrder(orders[1]);

    const orderBook = processor.getOrderBook();
    expect(orderBook.sells).toHaveLength(0);
  });
});

describe('OrderValidator', () => {
  const validator = new OrderValidator();

  test('should validate valid order', () => {
    const order: Order = {
      type_op: OrderType.CREATE,
      account_id: '1',
      amount: '0.00230',
      order_id: '1',
      pair: 'BTC/USDC',
      limit_price: '63500.00',
      side: OrderSide.SELL,
    };
    expect(() => validator.validateOrder(order)).not.toThrow();
  });

  test('should throw on invalid amount', () => {
    const order: Order = {
      type_op: OrderType.CREATE,
      account_id: '1',
      amount: '-0.00230',
      order_id: '1',
      pair: 'BTC/USDC',
      limit_price: '63500.00',
      side: OrderSide.SELL,
    };
    expect(() => validator.validateOrder(order)).toThrow(TradingError);
  });

  test('should throw on invalid trading pair', () => {
    const order: Order = {
      type_op: OrderType.CREATE,
      account_id: '1',
      amount: '0.00230',
      order_id: '1',
      pair: 'ETH/USDC',
      limit_price: '63500.00',
      side: OrderSide.SELL,
    };
    expect(() => validator.validateOrder(order)).toThrow(TradingError);
  });
});