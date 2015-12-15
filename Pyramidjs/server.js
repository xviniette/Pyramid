var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var uuid = require('node-uuid');
var fs = require('fs');
var crypto = require('crypto');

//Inclde files
eval(fs.readFileSync('./public/js/config.js')+'');
eval(fs.readFileSync('./public/js/common.js')+'');
eval(fs.readFileSync('./public/js/Game.js')+'');
eval(fs.readFileSync('./public/js/Player.js')+'');
eval(fs.readFileSync('./public/js/Map.js')+'');
eval(fs.readFileSync('./public/js/Bloc.js')+'');
eval(fs.readFileSync('./public/js/serverUtils.js')+'');
eval(fs.readFileSync('./public/js/UniqueNumber.js')+'');

server.listen(PORT);

app.get('/',function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

app.get( '/*' , function( req, res, next ) {
	var file = req.params[0];
	res.sendFile( __dirname + '/' + file );
});

var isServer = true;
var game = new Game();
var unUser = new UniqueNumber(1);
//physic game

setInterval(function(){
	game.update();
}, 1000/FPSNETWORK);

io.on('connection', function(socket){
	//On demande le pseudo au joueur
	socket.emit("playersStats", game.getNbPlayers());
	socket.emit("login", true);
	//Reponse du pseudo
	socket.on("login", function(data){
		Utils.onLogin(data, socket);
	});
    
    socket.on("position", function(data){
		Utils.onPosition(data, socket);
	});

	socket.on("tchat", function(data){
		Utils.onTchat(data, socket);
	});

	socket.on("disconnect", function(){
		Utils.onDisconnect(socket);
	});
});

