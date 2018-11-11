# ZombieVPNService
This is a simple VPN service for Wall Inc. Secret message channel for the just and brave.

## Client and Server
There are site-to-site and server-client vpn. In this example it is server-client VPN since it allows the client to access more destinations. The traffic from client to server is encrypted. The traffic coming out of the tunnel is of course not encrypted any more. But the original source has been hidden. 

The **client** simulate local tun/tap interface that the user send packet into. The packet is then encapsulated and encrypted and sent over to the server.

The **server** then decrypt the packet and forward it to its true destination.

You can run server and client inside Docker container so you don't need to install anything.

## Running

To run the tests

```bash
npm test
```

To start the client. The client will run on port 3001. You can modify this in clientConfig.json.
If you run it inside the docker, the port is 5555.
```bash
npm run start-client
#Or run in Docker
docker-compose -f docker-compose-client.yml up
```
To start the server. The server will run on port 3002. You can modify this in serverConfig.json.
If you run it inside the docker, the port is 6666.
```bash
npm run start-client
#Or run in Docker
docker-compose -f docker-compose-server.yml up
```

## Notes
Put the client's private key in id_zvpn. This one the client keeps secret.
The client's public key is in id_zvpn.pub. This one the server needs access.

**VPN-1**

Add random padding to confuse the attacker about the size of the packet

**VPN-2**

Public IP of the VPN server. Receiver Bob may send response back to this address. In this app it is not really used since the receiver can just get it from layer 3.

**VPN-3**

This will confuse the attacker a bit more. Packets are sent with random delays. Thus may change their ordering. But is bad for time critical application. In this vpn app security is the first priority so I put this here. TCP, or the application layer can take care of reordering packets at the end.

**VPN-4**

Real receiver address and port. After the packet arrived at the VPN terminal(the server). The inner packet will be decrypted and forwarded to the real recipient. This is not implemented here. So we don't really need this address. For this demo app we consider it success if the message reached the server and can be verified.