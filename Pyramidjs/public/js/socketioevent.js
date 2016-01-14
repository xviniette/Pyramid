$(function(){
	socket = io();
	socket.on("login", function(data){
		if(client){
			client.pID = null;
		}
	});

	socket.on("loginProblem", function(data){
		var pseudo = prompt(data+"\nChoisissez un autre pseudonyme");
		if(pseudo != null){
			socket.emit("login", {login:pseudo});
		}
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
		$("#nbOnline").text('('+data+')');
	});

	socket.on("tchat", function(data){
		$("#messages").append("<li>"+data.pseudo+" : "+htmlEntities(data.message)+"</li>");
	});

	socket.on("information", function(data){
		var html = "<li class='information'>"+data.pseudo+" - "+timeDisplay(data.temps);
		if(data.record){
			html += " RECORD PERSONNEL !"
		}
		html += "</li>";
		$("#messages").append(html);
	});
});