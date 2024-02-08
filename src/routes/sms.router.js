import { Router } from 'express';
import { SmsController } from '../controllers/sms.controller.js';
import { SmsService } from '../services/sms.service.js';

const smsService = new SmsService();
const smsController = new SmsController(smsService);

const smsRouter = Router();

smsRouter.post('/send-sms', smsController.sendSms.bind(smsController));

export { smsRouter };
