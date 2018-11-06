import cryptoRandomString from 'crypto-random-string';

const generateRandNum = (min, max) => min + Math.floor(Math.random() * (max + 1 - min));

export interface PacketInterface {
  src: string;
  srcPort: number;
  dst: string;
  dstPort: number;
  msg: string;
  createdAt?: string;
  pad?: string;
}

//VPN-1
const generatePadding = (): string => {
  const PADMAX = 50;
  const PADMIN = 20;
  const sLen = generateRandNum(PADMIN, PADMAX);
  return cryptoRandomString(sLen);
};


const serverIP = '';
const serverPort = 1234;

const createVPNPacket = (packet: PacketInterface, vDst: string, vPort: number): PacketInterface => {
  const encryptedMsg =createVMsg({
    ...packet,
    pad: generatePadding(),
    createdAt: (new Date()).toString()
  });
  return {
    ...packet,
    dst: vDst,
    dstPort: vPort,
    msg: encryptedMsg
  };
};