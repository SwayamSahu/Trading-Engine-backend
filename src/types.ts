// Shared type definitions
export enum OrderType {
    CREATE = 'CREATE',
    DELETE = 'DELETE',
  }
  
  export enum OrderSide {
    BUY = 'BUY',
    SELL = 'SELL',
  }
  
  export interface Order {
    type_op: OrderType;
    account_id: string;
    amount: string;
    order_id: string;
    pair: string;
    limit_price: string;
    side: OrderSide;
  }
  
  export interface OrderBookEntry {
    order_id: string;
    account_id: string;
    amount: number;
    limit_price: number;
    side: OrderSide;
    timestamp: number;
  }
  
  export interface Trade {
    trade_id: string;
    buy_order_id: string;
    sell_order_id: string;
    amount: number;
    price: number;
    timestamp: number;
  }
  
  export interface OrderBook {
    buys: OrderBookEntry[];
    sells: OrderBookEntry[];
  }
  
  export class TradingError extends Error {
    constructor(message: string, public readonly code: string) {
      super(message);
      this.name = 'TradingError';
    }
  }