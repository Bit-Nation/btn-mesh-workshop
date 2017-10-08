'use strict';

const PeerInfo = require('peer-info');
const waterfall = require('async/waterfall');
const BtnLocalMesh = require('./BtnLocalMesh').default;

let node;

waterfall([
    (cb) => PeerInfo.create(cb),
    (peerInfo, cb) => {
        peerInfo.multiaddrs.add('/ip4/0.0.0.0/tcp/0');
        node = new BtnLocalMesh(peerInfo);
        node.start(cb)
    }
], (err) => {
    if (err) { throw err }

    node.on('peer:discovery', (peer) => {
        console.log('Discovered:', peer.id.toB58String());
        node.dial(peer, () => {})
    });

    node.on('peer:connect', (peer) => {
        console.log('Connection established to:', peer.id.toB58String())
    })
});
