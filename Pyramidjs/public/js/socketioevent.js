$(function(){
	socket = io();
	socket.on("login", function(data){
		client.pID = null;
		socket.emit("login", {login:"Joueur"+random(0, 1000)});
	});

	socket.on("playerID", function(data){
		client.pID = data;
	});

	socket.on("init", function(data){
		client.onInit(data);
	});

	socket.on("snapshot", function(data){
		client.onSnapshot(data);
	});

	socket.on("newPlayer", function(data){
		client.addPlayer(new Player(data));
	});

	socket.on("deletePlayer", function(data){
		client.deletePlayer(new Player(data));
	});

	socket.on("playersStats", function(data){
	});

});