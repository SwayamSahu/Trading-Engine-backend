import { OrderProcessor } from './orderProcessor';
import { FileIO } from './fileIO';
import { Logger } from './logger';
import { Order } from './types';

// Main engine class orchestrating order processing
class TradingEngine {
  private orderProcessor: OrderProcessor;
  private fileIO: FileIO;
  private logger: Logger;

  constructor() {
    this.orderProcessor = new OrderProcessor();
    this.fileIO = new FileIO();
    this.logger = new Logger();
  }

  async processOrders(): Promise<void> {
    try {
      const orders = await this.fileIO.readOrders();
      for (const order of orders) {
        try {
          this.orderProcessor.processOrder(order);
        } catch (error) {
          this.logger.error(`Error processing order ${order.order_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
      await this.fileIO.writeOrderBook(this.orderProcessor.getOrderBook());
      await this.fileIO.writeTrades(this.orderProcessor.getTrades());
      this.logger.info('Order processing completed successfully.');
    } catch (error) {
      this.logger.error(`Failed to process orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
}

async function main() {
  const engine = new TradingEngine();
  await engine.processOrders();
}

if (require.main === module) {
  main().catch(error => console.error(`Main execution failed: ${error.message}`));
}

export { TradingEngine };