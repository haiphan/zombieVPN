import cryptoRandomString from 'crypto-random-string';
import BPromise from 'bluebird';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

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
export const generatePadding = (): string => {
  const PADMAX = 50;
  const PADMIN = 20;
  const sLen = generateRandNum(PADMIN, PADMAX);
  return cryptoRandomString(sLen);
};

const createVMsg = (packet: PacketInterface, key: string) => {
  try {
    const text = JSON.stringify(packet);
    return encryptWithKey(text, key, true);
  }
  catch(e) {
    console.log(e);
    throw new Error('Cannot createVMsg');
  }
};

// Server uses public key, client uses private key
const encryptWithKey = (text: string, key: string, isPrivate: boolean):string => {
  try {
    const buffer = new Buffer(text, 'base64');
    const cipher = isPrivate ? crypto.privateEncrypt(key, buffer) :
      crypto.publicEncrypt(key, buffer);
    return cipher.toString('utf8');
  } catch(e) {
    const mode = isPrivate ? 'private' : 'public';
    throw new Error(`Cannot encrypt text with ${mode} key`);
  }
};

const decryptWithKey = (cipher: string, key: string, isPrivate: boolean):string => {
  try {
    const buffer = new Buffer(cipher, 'base64');
    const text = isPrivate ? crypto.privateDecrypt(key, buffer) :
      crypto.publicDecrypt(key, buffer);
    return text.toString('utf8');
  } catch(e) {
    const mode = isPrivate ? 'private' : 'public';
    throw new Error(`Cannot decrypt text with ${mode} key`);
  }
};

export const readKeyFromFile = (kPath: string): string => {
  try {
    const aPath = path.resolve(kPath);
    return fs.readFileSync(aPath).toString();
  } catch(e) {
    throw new Error(`Cannot read from path ${kPath}`);
  }
};


export const createVPNPacket = (packet: PacketInterface, vDst: string, vPort: number, key: string): PacketInterface => {
  const encryptedMsg =createVMsg({
    ...packet,
    pad: generatePadding(),
    createdAt: (new Date()).toString()
  }, key);
  return {
    ...packet,
    dst: vDst,
    dstPort: vPort,
    msg: encryptedMsg
  };
};

export const sendPacket = (socket, packet: PacketInterface) => {
  const {dst, dstPort} = packet;
  const msg = JSON.stringify(packet);
  socket.request(msg, {host: dst, port: dstPort}, (err, res) => {
    const errMsg = err ?
      (err.timeout ? 'Request timeout': 'Request failed') : null;
    err && console.log(errMsg);
    !err && console.log('Packet is received');
  });
};

// VPN-3
export const delayRandom = async () => {
  const randomMs = generateRandNum(10, 500);
  return BPromise.delay(randomMs);
};