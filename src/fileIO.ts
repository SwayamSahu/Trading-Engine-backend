import * as fs from 'fs/promises';
import * as path from 'path';
import { CONFIG } from './config';
import { Order, OrderBook, Trade } from './types';
import { TradingError } from './types';

// Handles all file I/O operations
export class FileIO {
  async readOrders(): Promise<Order[]> {
    try {
      const data = await fs.readFile(path.join(__dirname, '..', CONFIG.ORDER_FILE), 'utf-8');
      return JSON.parse(data) as Order[];
    } catch (error) {
      throw new TradingError(
        `Failed to read orders from ${CONFIG.ORDER_FILE}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'FileReadError'
      );
    }
  }

  async writeOrderBook(orderBook: OrderBook): Promise<void> {
    try {
      await fs.writeFile(
        path.join(__dirname, '..', CONFIG.ORDERBOOK_FILE),
        JSON.stringify(orderBook, null, 2)
      );
    } catch (error) {
      throw new TradingError(
        `Failed to write order book to ${CONFIG.ORDERBOOK_FILE}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'FileWriteError'
      );
    }
  }

  async writeTrades(trades: Trade[]): Promise<void> {
    try {
      await fs.writeFile(
        path.join(__dirname, '..', CONFIG.TRADES_FILE),
        JSON.stringify(trades, null, 2)
      );
    } catch (error) {
      throw new TradingError(
        `Failed to write trades to ${CONFIG.TRADES_FILE}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'FileWriteError'
      );
    }
  }
}