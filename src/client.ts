import udpReq from 'udp-request';
import {createVPNPacket, delayRandom, PacketInterface, readKeyFromFile, sendPacket} from './vpnUtils'

const clientConfig = require('./clientConfig');
const {serverAddr, serverPort, clientPort, clientCert: keyPath} = clientConfig;
const socket = udpReq({timeout: 6000});

const readCertificate = (): string => {
  try {
    return readKeyFromFile(keyPath);
  } catch(e) {
    console.log(e);
    throw new Error('Cannot read client cert');
  }
};

const handlePacket = async (packet: PacketInterface, key: string) => {
  console.log('Preparing to send packet');
  try {
    const vPacket = createVPNPacket(packet, serverAddr, serverPort, key);
    await delayRandom();
    return sendPacket(socket, vPacket);
  } catch (e) {
    console.log(e);
    console.log('Cannot send packet to server');
  }

};

const startClient = () => {
  try {
    const clientCrt = readCertificate();
    socket.listen(clientPort, (err) => {
      if (err) {
        throw new Error(`Cannot listen on port ${clientPort}`);
      }
      console.log(`client is listening on ${clientPort}`);
      socket.on('request', (request, peer) => {
        const packet: PacketInterface = JSON.parse(request.toString());
        return handlePacket(packet, clientCrt);
      });
    });
  } catch (e) {
    console.log(e);
    throw new Error('Cannot start client');
  }
};

// Start the client
try {
  startClient();
} catch (e) {
  console.log(e);
  process.exit(1);
}