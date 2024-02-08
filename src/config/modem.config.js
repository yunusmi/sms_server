import serialportgsm from 'serialport-gsm';

export const modem = serialportgsm.Modem();
export const modemPort = '/dev/ttyUSB0';

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
