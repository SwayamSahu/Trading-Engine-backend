# Trading Engine Backend

The Trading Engine Backend is a robust, TypeScript-based application designed to process trading orders for the BTC/USDC trading pair. It reads orders from `orders.json`, matches buy and sell orders, and generates `orderbook.json` (current order book state) and `trades.json` (executed trades). The system is built with best practices in mind, emphasizing modularity, error handling, type safety, testability, and code quality.

This documentation provides a comprehensive guide to setting up, running, testing, and extending the trading engine backend.

---

## Table of Contents
1. [Features](#features)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Project Structure](#project-structure)
7. [Testing](#testing)
8. [Logging](#logging)
9. [Output Files](#output-files)

---

## Features

- **Order Processing**: Supports `CREATE` and `DELETE` orders for the BTC/USDC trading pair.
- **Order Matching**: Matches buy and sell orders based on price and amount, supporting full and partial matches.
- **Structured Logging**: Generates detailed logs in `trading.log` with `INFO`, `WARN`, and `ERROR` levels.
- **Output Generation**: Produces `orderbook.json` (current order book) and `trades.json` (executed trades).
- **Type Safety**: Leverages TypeScript for strict typing and robust error handling.
- **Testing**: Includes comprehensive unit tests using Jest to verify order processing and validation.
- **Code Quality**: Enforces consistent style and best practices with ESLint for TypeScript.
- **Extensibility**: Designed for easy addition of new order types, trading pairs, or features.

---

## Architecture

The trading engine backend is built with a modular architecture, separating concerns into distinct components:

- **TradingEngine**: Orchestrates the order processing workflow, coordinating file I/O, validation, and order matching.
- **OrderProcessor**: Handles order matching logic, maintaining the order book and generating trades.
- **FileIO**: Manages reading from `orders.json` and writing to `orderbook.json` and `trades.json`.
- **Logger**: Provides structured logging to `trading.log` and console output.
- **OrderValidator**: Ensures orders meet validation criteria (e.g., valid amount, price, trading pair).
- **Types**: Defines shared TypeScript interfaces and enums for type safety.
- **Config**: Centralizes configuration constants (e.g., file paths, trading pair).

This modular design enhances maintainability, testability, and extensibility, with each component adhering to the single responsibility principle.

---

## Prerequisites

Before setting up the project, ensure you have the following installed:
- **Node.js**: Version 16 or higher (`node -v` to check).
- **npm**: Version 8 or higher (`npm -v` to check).
- **TypeScript**: Installed globally or via project dependencies.
- **Git**: For cloning the repository (optional).

---

## Installation

1. **Clone the Repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd trading-engine/backend
   ```

2. **Install Dependencies**:
   Navigate to the `backend/` directory and install the required packages:
   ```bash
   cd C:\project_swayam\backend_ORO
   npm install
   ```

3. **Prepare Input File**:
   Ensure `orders.json` is present in the `backend/` directory. A sample `orders.json` is provided with the project.

---

## Usage

1. **Build the Project**:
   Compile TypeScript files to JavaScript in the `dist/` directory:
   ```bash
   npm run build
   ```

2. **Process Orders**:
   Run the trading engine to process orders from `orders.json`:
   ```bash
   npm start
   ```
   This generates `orderbook.json`, `trades.json`, and logs to `trading.log`.

3. **Run Tests**:
   Execute the unit test suite to verify functionality:
   ```bash
   npm test
   ```

---

## Project Structure

The backend is organized as follows:

```
backend/
├── src/                    # Source code
│   ├── config.ts           # Configuration constants (file paths, trading pair)
│   ├── engine.ts           # Main engine orchestration
│   ├── fileIO.ts           # File input/output operations
│   ├── logger.ts           # Structured logging utility
│   ├── orderProcessor.ts   # Order processing and matching logic
│   ├── types.ts            # Shared TypeScript type definitions
│   ├── validator.ts        # Order validation logic
├── tests/                  # Unit tests
│   ├── engine.test.ts      # Tests for order processing and validation
├── orders.json             # Input file with trading orders
├── jest.config.js          # Jest configuration for testing
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

---

## Testing

The project includes a comprehensive test suite using Jest, located in `tests/engine.test.ts`. The tests cover:
- **Order Matching**: Full and partial matching of buy and sell orders.
- **Order Deletion**: Correct removal of orders from the order book.
- **Validation**: Ensuring orders meet criteria (e.g., positive amount, valid trading pair).

To run tests:
```bash
npm test
```

Example output:
```
PASS  tests/engine.test.ts
  OrderProcessor
    ✓ should match buy and sell orders at same price (Xms)
    ✓ should handle partial order matching (Xms)
    ✓ should delete existing order (Xms)
  OrderValidator
    ✓ should validate valid order (Xms)
    ✓ should throw on invalid amount (Xms)
    ✓ should throw on invalid trading pair (Xms)
```

To run tests with coverage:
```bash
npm test -- --coverage
```

---

## Linting

ESLint enforces code quality and consistency across the TypeScript codebase. The `.eslintrc.json` configuration includes:
- TypeScript-specific rules via `@typescript-eslint`.
- Consistent style (2-space indentation, single quotes, semicolons, Windows linebreaks).
- Checks for unused variables and explicit `any` types.

To lint the code:
```bash
npm run lint
```

To fix linting issues automatically:
```bash
npm run lint -- --fix
```

If linting reports errors, review the output and address issues manually or share the errors for assistance.

---

## Logging

The `Logger` class generates structured logs in `trading.log` and outputs them to the console. Log levels include:
- **INFO**: Successful operations (e.g., order processing, trade execution).
- **WARN**: Non-critical issues (e.g., attempting to delete a non-existent order).
- **ERROR**: Critical failures (e.g., validation errors, file I/O issues).

Example log entry:
```
2025-04-17T12:34:56.789Z [INFO] Processed CREATE order 1: 1 trades executed
```

Logs are written to `backend/trading.log` and can be extended to support external logging services if needed.

---

## Output Files

The trading engine produces two output files:
- **orderbook.json**: Represents the current state of the order book, with `buys` and `sells` arrays containing open orders.
  ```json
  {
    "buys": [
      {
        "order_id": "7",
        "account_id": "1",
        "amount": 0.2,
        "limit_price": 50500,
        "side": "BUY",
        "timestamp": 1742301234567
      }
    ],
    "sells": [
      {
        "order_id": "6",
        "account_id": "1",
        "amount": 0.2,
        "limit_price": 47500,
        "side": "SELL",
        "timestamp": 1742301234568
      }
    ]
  }
  ```
- **trades.json**: Lists executed trades with details (trade ID, order IDs, amount, price, timestamp).
  ```json
  [
    {
      "trade_id": "T1",
      "buy_order_id": "2",
      "sell_order_id": "1",
      "amount": 0.0023,
      "price": 63500,
      "timestamp": 1742301234569
    }
  ]
  ```

These files are written to the `backend/` directory after running `npm start`.
