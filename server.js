const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));

const PeerInfo = require('peer-info');
const waterfall = require('async/waterfall');
const BtnLocalMesh = require('./BtnLocalMesh').default;
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', function(socket){
    console.log('a user connected');
});

let node;

waterfall([
    (cb) => PeerInfo.create(cb),
    (peerInfo, cb) => {
        peerInfo.multiaddrs.add('/ip4/0.0.0.0/tcp/0');
        node = new BtnLocalMesh(peerInfo);
        node.start(cb);
    }
], (err) => {

    if(err){
        throw err;
    }

    //Discover peer
    node.on('peer:discovery', (peer) => {
        io.emit('discoverd', peer.id.toB58String());
        node.dial(peer, () => {})
    });

    //Connect to peer
    node.on('peer:connect', (peer) => {
        io.emit('connected', peer.id.toB58String());
    })

});

app.get('/', function (req, res) {

    res.sendFile(path.join(__dirname + '/pub/index.html'));

});

http.listen(3000, function () {

    console.log("App running on: http://127.0.0.1:3000");

});
