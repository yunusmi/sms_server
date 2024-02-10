import { modem } from '../config/modem.config.js';
import { logger } from '../utils/logger.js';

export class SmsService {
  async sendSms(recipient, message) {
    const result = await modem.sendSMS(recipient, message, false);

    logger.info(`Start sending message to recipient ${recipient}`);

    if (result.status !== 'success') {
      logger.error(
        `Error occurred while sending SMS to recipient: ${recipient} - ${JSON.stringify(
          result
        )}`
      );

      const err = new Error(
        `Error occurred while sending SMS to recipient ${recipient}`
      );

      throw err;
    }

    logger.info(`Message successfully has been sent to recipient ${recipient}`);

    return `Message successfully has been sent to recipient ${recipient}`;
  }
}
