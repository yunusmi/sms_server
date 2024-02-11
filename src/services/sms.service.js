import * as dotenv from 'dotenv';
import { modem } from '../config/modem.config.js';
import { logger } from '../utils/logger.js';

dotenv.config();

export class SmsService {
  async sendSms(recipient, message) {
    const timeoutPeriod = process.env.TIMEOUT || 30000;

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        const timeoutError = new Error(
          `Timeout error occurred while sending SMS to ${recipient}`
        );
        logger.error(timeoutError.message);
        reject(timeoutError);
      }, timeoutPeriod);
    });

    const result = await Promise.race([
      modem.sendSMS(recipient, message, process.env.SMS_TYPE || false),
      timeoutPromise,
    ]);

    logger.info(`Start sending SMS to ${recipient}`);

    if (result.status === 'fail' || result.status !== 'success') {
      logger.error(
        `Error occurred while sending SMS to ${recipient} - ${JSON.stringify(
          result
        )}`
      );

      const error = new Error(
        `Error occurred while sending SMS to ${recipient}`
      );

      throw error;
    }

    logger.info(`Message successfully has sent to ${recipient}`);

    return `Message successfully has sent to ${recipient}`;
  }
}
