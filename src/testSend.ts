import udpReq from 'udp-request';
import {PacketInterface} from "./vpnUtils";
const clientConfig = require('./clientConfig');

const {clientPort} = clientConfig;
//This is the local tun/tap interface
const clientAddr = 'localhost';
const socket = udpReq();

const messages = [
  'attack on the left',
  'send reinforcement to the wall',
  'surprise attack tomorrow morning',
  'their weakness is pizza',
  'we have lost 200 troops'
];

const generatePacket = (msg: string): PacketInterface => ({
  src: 'aa.aa.aa.aa',
  srcPort: 1234,
  dst: 'bb.bb.bb.bb', //VPN-4
  dstPort: 80,
  msg
});


//Send the messages
messages
  .map(m => JSON.stringify(generatePacket(m)))
  .map(p =>
    socket.request(p, {port: clientPort, host: clientAddr}));
socket.destroy();