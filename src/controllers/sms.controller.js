import { SmsService } from '../services/sms.service.js';
import { logger } from '../utils/logger.js';

export class SmsController {
  constructor() {
    this.smsService = new SmsService();
  }

  async sendSms(req, res, next) {
    try {
      const recipient = req.body.recipient;
      const message = req.body.message;

      const result = await this.smsService.sendSms(recipient, message);
      res.status(200).json({
        success: true,
        message: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });

      next(error);
    }
  }

  async testSmsSendingSpeed(req, res, next) {
    const smsCount = req.body.count;
    const smsMessage = req.body.message;
    const recipient = req.body.recipient;

    logger.info(`Start testing`);
    logger.info(
      `Count of SMS: ${smsCount}, message: ${smsMessage}, recipient number: ${recipient}`
    );

    const startTime = Date.now();
    const messages = Array(smsCount).fill(`${smsMessage}`);
    const toNumbers = Array(smsCount).fill(`${recipient}`);

    let sentCount = 0;
    let successCount = 0;
    let failureCount = 0;

    for (const [index, message] of messages.entries()) {
      try {
        await this.smsService.sendSms(toNumbers[index], message);
        successCount++;
      } catch (error) {
        failureCount++;
      }

      sentCount++;

      if (sentCount === messages.length) {
        const endTime = Date.now();
        const elapsedTime = endTime - startTime;
        const speed = Math.round(sentCount / (elapsedTime / 1000));

        logger.info(`Test completed successfully`);
        logger.info(`Sent ${sentCount} SMS messages in ${elapsedTime} ms`);
        logger.info(`Speed: ${speed} SMS/s`);
        logger.info(`Success: ${successCount}`);
        logger.warn(`Failure: ${failureCount}`);

        res.status(200).json({
          success: true,
          message: 'Test completed successfully',
          data: {
            speed,
            successCount,
            failureCount,
          },
        });
      }
    }
  }
}
