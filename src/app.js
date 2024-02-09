import http from 'http';
import express from 'express';
import { smsRouter } from './routes/sms.router.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { modem, modemPort, modemOptions } from './config/modem.config.js';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  console.log('---------------------------------------------------');
  console.log(`New request: ${req.body.recipient} - ${req.body.message}`);

  next();
});

app.use(smsRouter);
app.use(errorHandler);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.originalUrl} not found`);

  error.statusCode = 404;
  next(error);
});

const APP_PORT = process.env.PORT || 3001;
const APP_HOST = process.env.HOST || 'localhost';

const server = http.createServer(app);

function setupServer() {
  server.listen(APP_PORT, () => {
    console.log(`Server started at ${APP_HOST}:${APP_PORT}`);
  });

  modem.open(modemPort, modemOptions, () => {
    modem.initializeModem((msg, err) => {
      if (err) {
        console.log(`Error Initializing Modem - ${JSON.stringify(err)}`);
      } else {
        console.log(`GSM-modem is initializied: ${JSON.stringify(msg)}`);
      }
    });

    modem.setModemMode((message, err) => {
      if (err) {
        console.log(`Error Setting Modem Mode - ${err}`);
      } else {
        console.log(`Set Mode: ${JSON.stringify(message)}`);
      }
    }, 'PDU');

    modem.getNetworkSignal((result, err) => {
      if (err) {
        console.log(
          `Error retrieving Signal Strength - ${JSON.stringify(err)}`
        );
      } else {
        console.log(`Signal Strength: ${JSON.stringify(result)}`);
      }
    });
    console.log('GSM-modem port opened');
  });

  modem.on('error', (err) => {
    console.log('Error occured while opening GSM-modem port:', err);
  });
}

setupServer();

console.log(process.env.MODEM_PORT);

export { app };
