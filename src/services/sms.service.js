import * as dotenv from 'dotenv';
import { modem } from '../config/modem.config.js';
import { logger } from '../utils/logger.js';

dotenv.config();

export class SmsService {
  async sendSms(recipient, message) {
    logger.info(`Start sending SMS to ${recipient}`);

    const timeoutPeriod = parseInt(process.env.TIMEOUT) || 30000;

    let timeoutId;

    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        const timeoutError = new Error(
          `Timeout error occurred while sending SMS to ${recipient}`
        );
        logger.error(timeoutError);
        reject(timeoutError);
      }, timeoutPeriod);
    });

    const sendSMSPromise = new Promise((resolve, reject) => {
      modem
        .sendSMS(recipient, message, JSON.parse(process.env.SMS_TYPE) || false)
        .then((result) => {
          clearTimeout(timeoutId);

          if (result.status === 'fail' || result.status !== 'success') {
            logger.error(
              `Error occurred while sending SMS to ${recipient} - ${JSON.stringify(
                result
              )}`
            );

            const error = new Error(
              `Error occurred while sending SMS to ${recipient}`
            );

            reject(error);
          }

          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });

    return Promise.race([sendSMSPromise, timeoutPromise])
      .then((_result) => {
        logger.info(`Message successfully has sent to ${recipient}`);

        return `Message successfully has sent to ${recipient}`;
      })
      .catch((error) => {
        throw error;
      });
  }
}
