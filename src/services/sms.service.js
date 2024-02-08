import { modem } from '../config/modem.config.js';

export class SmsService {
  async sendSms(recipient, message) {
    const result = await modem.sendSMS(recipient, message, false);

    if (!result || result.status !== 'success') {
      const err = new Error('Error occurred while sending SMS to recipient');
      throw err;
    }

    return `Message successfully has been sent to recipient ${result.data.recipient}`;
  }
}
