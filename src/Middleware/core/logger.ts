import { Request, Response, NextFunction } from 'express';
import { createLogger, transports, format } from 'winston';
import fs from 'fs';
import path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';
import { environment, logDirectory } from '../../config';
interface CustomRequest extends Request {
  source?: string;
}
let dir = logDirectory;
if (!dir) dir = path.resolve('logs');

// create directory if it is not present
if (!fs.existsSync(dir)) {
  // Create the directory if it does not exist
  fs.mkdirSync(dir);
}

const logLevel = environment === 'development' ? 'debug' : 'info';

const dailyRotateFile = new DailyRotateFile({
  level: logLevel,
  filename: dir + '/%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  handleExceptions: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp(),
    format.json(),
  ),
});

const logger = createLogger({
  transports: [
    new transports.Console({
      level: logLevel,
      format: format.combine(
        format.errors({ stack: true }),
        format.timestamp(),
        format.colorize(),
        format.printf(({ level, message, timestamp, stack, ...metadata }) => {
          let msg = `${timestamp} [${level}] : ${stack || message}`;
          if (Object.keys(metadata).length > 0) {
            msg += JSON.stringify(metadata);
          }
          return msg;
        }),
      ),
    }),
    dailyRotateFile,
  ],
  exceptionHandlers: [dailyRotateFile],
  exitOnError: false,
});

// Middleware to log API hits and response times
export const apiLogger = (
  req: CustomRequest, // Use the extended CustomRequest type
  res: Response, 
  next: NextFunction
) => {
  const startTime = Date.now();
  const { method, url } = req;
  
  res.on('finish', () => {
    const endTime = Date.now();
    const elapsedTime = (endTime - startTime) / 1000; // Response time in seconds
    const status = res.statusCode;
    const source = req.source;
    
    if (status !== 200) {
      logger.error(`API Hit: ${method} ${url}, Source: ${source}, Response Status: ${status}, Response Time: ${elapsedTime.toFixed(2)}s`);
    } else {
      logger.info(`API Hit: ${method} ${url}, Source: ${source}, Response Status: ${status}, Response Time: ${elapsedTime.toFixed(2)}s`);
    }
  });

  next();
};
export default logger;
