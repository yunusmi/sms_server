import pino from 'pino';
import winston from 'winston';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getFormattedDate } from './formatDate.js';

export const logger = {
  info: function (message) {
    pinoLogger.info(message);
    winstonLogger.info(message);
  },

  error: function (message) {
    pinoLogger.error(message);
    winstonLogger.error(message);
  },

  warn: function (message) {
    pinoLogger.warn(message);
    winstonLogger.warn(message);
  },
};

const formattedDate = getFormattedDate();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logDirectory = join(__dirname, '..', 'logs');

const logFileName = `${formattedDate}_log.txt`;

const winstonLogger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: join(logDirectory, logFileName) }),
  ],
});

const pinoLogger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});
