import http from 'http';
import express from 'express';
import { smsRouter } from './routes/sms.router.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { modem, modemPort, modemOptions } from './config/modem.config.js';
import { logger } from './utils/logger.js';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  logger.info('--------------------------------');
  logger.info(`New request: ${req.body.recipient} - ${req.body.message}`);

  next();
});

app.use(smsRouter);
app.use(errorHandler);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.originalUrl} not found`);

  error.statusCode = 404;
  next(error);
});

const APP_PORT = process.env.APP_PORT || 3000;
const APP_HOST = process.env.APP_HOST || 'localhost';

const server = http.createServer(app);

function setupServer() {
  server.listen(APP_PORT, () => {
    logger.info(`Server started at ${APP_HOST}:${APP_PORT}`);
  });

  modem.open(modemPort, modemOptions, () => {
    modem.initializeModem((msg, err) => {
      if (err) {
        logger.error(`Error Initializing Modem - ${JSON.stringify(err)}`);
      } else {
        logger.info(`GSM-modem is initializied: ${JSON.stringify(msg)}`);
      }
    });

    modem.setModemMode((message, err) => {
      if (err) {
        logger.error(`Error Setting Modem Mode - ${JSON.stringify(err)}`);
      } else {
        logger.info(`Set Mode: ${JSON.stringify(message)}`);
      }
    }, process.env.MODEM_MODE);

    modem.getNetworkSignal((result, err) => {
      if (err) {
        logger.warn(
          `Error retrieving Signal Strength - ${JSON.stringify(err)}`
        );
      } else {
        logger.info(`Signal Strength: ${JSON.stringify(result)}`);
      }
    });
    logger.info('GSM-modem port opened');
  });

  modem.on('error', (err) => {
    logger.error(
      'Error occured while opening GSM-modem port:',
      JSON.stringify(err)
    );
  });
}

setupServer();

export { app };
