var Utils = {};

//Réactions au événemments

Utils.onLogin = function(data, socket){
	var valid = true;
	if(data.login && data.login.length >= 2 && data.login.length <= 20 && isValidPseudo(data.login)){
		for(var i in game.players){
			if(game.players[i].pseudo.toLowerCase() == data.login.toLowerCase()){
				var valid = false;
				socket.emit("loginProblem", "Déjà utilisé");
				break;
			}
		}
	}else{
		valid = false;
		socket.emit("loginProblem", "Entre 2 et 20 caractères alphanumériques");
	}

	if(valid){
		var p = new Player({id:unUser.get(), pseudo:data.login, socket:socket.id});
		socket.emit("playerID", p.id);
		game.addPlayer(p);
	}
}

Utils.onPosition = function(data, socket){
	var p = game.getPlayerBySocket(socket.id);
	if(!p){return;}
    p.x = data.x;
    p.y = data.y;
    p.z = data.z;
    p.dirX = data.dirX;
}

Utils.onTchat = function(data, socket){
	var p = game.getPlayerBySocket(socket.id);
	if(!p){return;}
	for(var i in game.players){
		Utils.messageTo(game.players[i].socket, "tchat", {pseudo:p.pseudo, message:data});
	}
}

Utils.onTime = function(data, socket){
	var p = game.getPlayerBySocket(socket.id);
	if(!p){return;}
	for(var i in game.players){
		Utils.messageTo(game.players[i].socket, "information", {pseudo:p.pseudo, temps:data.temps, record:data.record});
	}
}

Utils.onDisconnect = function(socket){
	var p = game.getPlayerBySocket(socket.id);
	if(!p){return;}
	game.deletePlayer(p);
    unUser.free(p.id);
}

Utils.messageTo = function(socket, type, message){
	if(io.sockets.connected[socket]){
		io.sockets.connected[socket].emit(type, message);
	}
}