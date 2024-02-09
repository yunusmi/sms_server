import serialportgsm from 'serialport-gsm';
import * as dotenv from 'dotenv';
dotenv.config();

export const modem = serialportgsm.Modem();
export const modemPort = process.env.MODEM_PORT;

export const modemOptions = {
  baudRate: 115200,
  dataBits: 8,
  stopBits: 1,
  parity: 'none',
  rtscts: false,
  xon: false,
  xoff: false,
  xany: false,
  autoDeleteOnReceive: true,
  enableConcatenation: true,
  incomingCallIndication: false,
  incomingSMSIndication: false,
  pin: '',
  customInitCommand: '',
  cnmiCommand: 'AT+CNMI=2,1,0,2,1',
  logger: console,
};
