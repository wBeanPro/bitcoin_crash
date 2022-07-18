//Required Libs
var compression = require('compression');
var _       = require('lodash');
var express = require('express');
var fs = require('fs');
var server  = express();
var options = {
  key: fs.readFileSync('privkey.pem'),
  cert: fs.readFileSync('fullchain.pem')
};
var app     = require('https').createServer(options, server);
var io      = module.exports.io = require('socket.io')(app);
var Chat    = require("./models/Chat");
var Play    = require("./Play");
var config  = require('./config');
var User    = require('./models/User');
var AutoPayment   = require('./Game/Wallet/AutoPaymentUpdate');

//Secure Socket
var Crypt = require('g-crypt');
var passphrase = 'node_modules/express/index.js', // Passport !
    crypter = Crypt(passphrase);

//Players Object
var player = [];
var player_playing = [];

//Compress All Responses
server.use(compression());

//Auth Middleware
var auth = require('./Auth');
server.use('/auth', auth);

server.get('/', function (req, res) {
    res.send("Api is Work");
});

//Socket Connections
io.on('connection', function(socket){

    //Get Current Client
    var currentClient = socket.id;

    //Auth and Join new User
    socket.on('auth', function(data){
        var user = socket;
        user.id = data.uid;
        user.uid = data.uid;
        user.username = data.name;
        user.name = data.name;
        user.cash = data.credit;
        user.credit = data.credit;
        player.push(user);
    });

    //Disconnect User
    socket.on('disconnect', function(){});

    //Get Game Status after a page was loaded
    socket.on('game_status', function(){
        gameStatus(currentClient);
    });

    //Game Handler
    socket.on('message', function(data){
        require('./Handler')(crypter.decrypt(data), socket, io, crypter);
    });

    //User Credit
    socket.on('credit', function(uid){
        User.getUserBits(uid, (result) => {
            io.sockets.to(currentClient).emit('credit', crypter.encrypt({credit: result, uid: uid}));
        });
    });

    //Play User
    socket.on('play', function(data){
        var dd = crypter.decrypt(data);
        handleNextRound(dd.uid, dd.amount, dd.cashout, currentClient)
    });

    //Remove User
    socket.on('cancel', function(data){
        var dd = crypter.decrypt(data);
        handleRemoveNextRound(dd.uid)
    });

    //Cahout User
    socket.on('finish', function(data){
        var dd = crypter.decrypt(data);
        handleCashout(dd.uid)
    });

    //Get All Chat
    socket.on('all_chat', function(room){
        Chat.getAllChats(room, (chats) => {
            socket.emit('all_chat', crypter.encrypt(_.reverse(chats)));
        });
    });

    //Check for Muted User
    socket.on('is_muted', function(uid){
        var dd = crypter.decrypt(uid);
        User.checkForMuted(dd, (result) => {
            socket.emit('is_muted', crypter.encrypt({ status: result }));
        });
    });

    //Get LeaderBoard
    socket.on('leader', function(){
        User.getLeaderboard((result) => {
            result = sortByBits(result);
            socket.emit('leader', crypter.encrypt({ data: _.reverse(result) }));
        });
    });

    //Get Stats
    socket.on('game_stats', function(){
        User.getBets((result) => {
            console.log(result)
        });
    });
});

function sortByBits(input) {
    function r(c) {
        return c.cash ? - c.cash : null;
    }
    return _.sortBy(input, r);
}

//Play Game Functions
const {
    Idle,
    gameStatus,
    handleCashout,
    handleNextRound,
    handleRemoveNextRound
} = Play(player, player_playing);

//Start Game
Idle();

//Auto Update Users Payments
AutoPayment.update(io);

app.listen(config.socket.port, function(){
    console.log('listening on *:' + config.socket.port);
});