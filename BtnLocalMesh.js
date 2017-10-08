const libp2p = require('libp2p');
const TCP = require('libp2p-tcp');
const MulticastDNS = require('libp2p-mdns');
const Multiplex = require('libp2p-multiplex');
const SECIO = require('libp2p-secio');
const WS = require('libp2p-websockets');

/**
 * Local Bitnation mesh network
 */
class BtnLocalMesh extends libp2p {
    constructor(peerInfo) {

        const modules = {
            transport: [new TCP(), new WS()],
            connection: {
                muxer: [Multiplex],
                crypto: [SECIO]
            },
            discovery: [new MulticastDNS(peerInfo)]
        };
        super(modules, peerInfo)
    }
}

module.exports.default = BtnLocalMesh;
