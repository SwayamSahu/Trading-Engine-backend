import * as fs from 'fs/promises';
import * as path from 'path';
import { CONFIG } from './config';

// Simple logging utility for structured logging
export class Logger {
  private async appendLog(message: string, level: 'INFO' | 'WARN' | 'ERROR'): Promise<void> {
    const logEntry = `${new Date().toISOString()} [${level}] ${message}\n`;
    try {
      await fs.appendFile(path.join(__dirname, '..', CONFIG.LOG_FILE), logEntry);
    } catch (error) {
      console.error(`Failed to write to log file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  info(message: string): void {
    this.appendLog(message, 'INFO');
    console.log(`[INFO] ${message}`);
  }

  warn(message: string): void {
    this.appendLog(message, 'WARN');
    console.warn(`[WARN] ${message}`);
  }

  error(message: string): void {
    this.appendLog(message, 'ERROR');
    console.error(`[ERROR] ${message}`);
  }
}