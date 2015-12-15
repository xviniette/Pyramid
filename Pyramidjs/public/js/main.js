var client = null;
var socket;
var isServer = false;

var inputsKeyCode = {
	r:[39, 68],
	l:[37, 81],
	u:[38, 90],
	d:[40, 83],
	j:[32]
};

window.onload = function(){
	client = new Client();

	function update(){
		if(client.game){
			client.update();
		}
		requestAnimationFrame(update);
	}
	requestAnimationFrame(update);
	
	document.body.addEventListener("keydown", function(e) {
		for(var i in inputsKeyCode){
			for(var j in inputsKeyCode[i]){
				if(inputsKeyCode[i][j] == e.keyCode){
					client.keys[i] = true;
					return;
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
			p.dirX += movementX * p.sensivity;
			p.dirY -= movementY * p.sensivity;
		}
		
	}, false);

	function fullscreenChange() {
		if (document.webkitFullscreenElement === elem ||
			document.mozFullscreenElement === elem ||
			document.mozFullScreenElement === elem) { 
			elem.requestPointerLock = elem.requestPointerLock    ||
		elem.mozRequestPointerLock ||
		elem.webkitRequestPointerLock;
		elem.requestPointerLock();
	}
}

document.addEventListener('fullscreenchange', fullscreenChange, false);
document.addEventListener('mozfullscreenchange', fullscreenChange, false);
document.addEventListener('webkitfullscreenchange', fullscreenChange, false);




function lockPointer() {
	elem = document.getElementById("game");
	elem.requestFullscreen = elem.requestFullscreen    ||
	elem.mozRequestFullscreen ||
	elem.mozRequestFullScreen ||
	elem.webkitRequestFullscreen;
	elem.requestFullscreen();
}

document.getElementById("game").onclick = function(){
	lockPointer();
}

window.onresize = function(){
	if(client.display){
		client.display.resize();
	}
}
}

