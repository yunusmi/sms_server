import { SmsService } from '../services/sms.service.js';

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
}
