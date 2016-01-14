var client = null;
var socket;
var isServer = false;
var canvasGame;

var inputsKeyCode = {
	r:[39, 68],
	l:[37, 81],
	u:[38, 90],
	d:[40, 83],
	j:[32],
	restart:[82],
	checkpoint:[67]
};

window.onload = function(){
	canvasGame = $("#game");
	webGLStart("game");
	client = new Client();

	function update(){
		if(client.game){
			client.update();
		}
		requestAnimationFrame(update);
	}
	requestAnimationFrame(update);
	
	document.body.addEventListener("keydown", function(e) {
		if($('input:focus').length == 0 ){
			if(e.keyCode == 13){
				$('#message').focus();
				e.preventDefault();
			}
			if(e.keyCode == inputsKeyCode["restart"]){
				client.respawn();
				return;
			}
			if(e.keyCode == inputsKeyCode["checkpoint"]){
				client.checkpoint();
			}
			for(var i in inputsKeyCode){
				for(var j in inputsKeyCode[i]){
					if(inputsKeyCode[i][j] == e.keyCode){
						client.keys[i] = true;
						return;
					}
				}
			}
		}
	});
	document.body.addEventListener("keyup", function(e) {
		for(var i in inputsKeyCode){
			for(var j in inputsKeyCode[i]){
				if(inputsKeyCode[i][j] == e.keyCode){
					client.keys[i] = false;
					return;
				}
			}
		}
	});


	document.addEventListener("mousemove", function(e) {
		 var canvas = canvasGame.get()[0];
		if (document.pointerLockElement === canvas ||
                document.mozPointerLockElement === canvas ||
                document.webkitPointerLockElement === canvas) {

		}else{
			return;
		}

		var movementX = e.movementX       ||
		e.mozMovementX    ||
		e.movementX ||
		0,
		movementY = e.movementY       ||
		e.mozMovementY    ||
		e.movementY ||
		0;
		
		var p = client.game.getPlayerById(client.pID);
		if(p){
			var sensi = localStorage.getItem("sensibility");
			if(sensi == null){
				sensi = 5;
			}
			p.sensivity = sensi/20;

			p.dirX += movementX * p.sensivity;
			p.dirY -= movementY * p.sensivity;
			if(p.dirY < -90){
				p.dirY = -90;
			}
			if(p.dirY > 90){
				p.dirY = 90;
			}
		}
		
	}, false);

	if (document.addEventListener) {
		document.addEventListener('contextmenu', function(e) {
			e.preventDefault();
		}, false);
	} else {
		document.attachEvent('oncontextmenu', function() {
			window.event.returnValue = false;
		});
	}

	$(document).mousedown(function(ev){
		if(ev.which == 3)
		{
			client.keys["j"] = true;
		}
	});

	$(document).mouseup(function(ev){
		if(ev.which == 3)
		{
			client.keys["j"] = false;
		}
	});

	function lockPointer() {
		var canvas = canvasGame.get()[0];
		canvas.requestPointerLock = canvas.requestPointerLock ||
		canvas.mozRequestPointerLock ||
		canvas.webkitRequestPointerLock;
		canvas.requestPointerLock();
	}

	document.getElementById("game").onclick = function(){
		lockPointer();
	}

	window.onresize = function(){
		if(client.display){
			client.display.resize();
		}
	}

	//récupération des maps
	$.get( "/maps.json", function( data ) {
		client.maps = data;
	});

	//MENU
	showHome();
	$("#home a").click(function(e){
		e.preventDefault();
		switch($(this).attr("action")){
			case "tuto":
			client.launchLocalGame(0);
			break;
			case "multi":
			var pseudo = prompt("Choisissez un pseudonyme");
			if(pseudo != null){
				socket.emit("login", {login:pseudo});
			}
			break;
			case "solo":
			showLevels();
			break;
		}
	});

	$("#tchatsend").submit(function(e){
		e.preventDefault();
		if($('#message').val().length > 0){
			socket.emit("tchat", $('#message').val());
		}
		$('#message').val("");
		$('#message').blur();
	});

	$("#menu a").click(function(e){
		e.preventDefault();
		switch($(this).attr("action")){
			case "home":
			if(socket){
				socket.emit("deconnexion");
			}
			showHome();
			break;
			case "config":
			$("#configs").show();
			break;
		}
	});

	$("#closeConfigs").click(function(e){
		e.preventDefault();
		$("#configs").hide();
	});

	var sensi = localStorage.getItem("sensibility");
	if(sensi == null){
		sensi = 5;
		localStorage.setItem("sensibility", sensi);
	}
	$("#sensibility").val(sensi);
	$("#sensibility").change(function(){
		localStorage.setItem("sensibility", $(this).val());
	});

}

playMap = function(id){
	client.launchLocalGame(id);
}
//EDITEUR



function deleteBloc(i){
	client.game.map.blocs.splice(i, 1);
	client.display.initDrawing();
}
function addBloc(){
	var p = client.game.getPlayerById(client.pID);
	client.game.map.blocs.push(new Bloc(parseInt(p.x), parseInt(p.y) - 100, parseInt(p.z), 100, 100, 100, 0, null));
	client.display.initDrawing();
}