var Player = function(json){
	this.id = 0;
	this.pseudo = "";
	this.socket;

	this.x = 0;
	this.y = 500;
	this.z = 0;

	this.positions = [];

	this.checkpoint = {
		x:0,
		y:0,
		z:0
	}

	this.startTimer = 0;

	this.width = 40;
	this.height = 80;
	this.depth = 40;

	this.velX = 0;
	this.velY = 0;
	this.velZ = 0;

	this.dirX = 270;
	this.dirY = 0;
	this.sensivity = 0.2;

	this.speed = 5;
	this.gravity = -0.7;
	this.maxGravity = -8;
	this.jump = 16;

	this.boostSpeed = 0;
	this.maxBoostSpeed = 5;
	this.deltaBoostSpeed = 0.5;

	this.onGround = false;
	this.precOnGround = false;

	this.mesh;

	this.msg = null;

	this.inputs = {};

	this.init(json);
}

Player.prototype.init = function(json){
	for(var i in json){
		this[i] = json[i];
	}
}

Player.prototype.spawn = function(map){
	this.x = map.spawnPosition.x;
	this.y = map.spawnPosition.y;
	this.z = map.spawnPosition.z;

	this.checkpoint.x = map.spawnPosition.x;
	this.checkpoint.y = map.spawnPosition.y;
	this.checkpoint.z = map.spawnPosition.z;

	this.velX = 0;
	this.velY = 0;
	this.velZ = 0;

	this.dirX = map.rotation.x;
	this.dirY = map.rotation.y;

	this.startTimer = Date.now();
	this.boostSpeed = 0;
}

Player.prototype.respawn = function(){
	this.velX = 0;
	this.velY = 0;
	this.velZ = 0;

	this.boostSpeed = 0;

	this.x = this.checkpoint.x;
	this.y = this.checkpoint.y;
	this.z = this.checkpoint.z;
}

Player.prototype.interpolate = function(tps){
	var interptime = tps - INTERPOLATION;
	for(var i = 0; i < this.positions.length - 1; i++){
		if(this.positions[i].t <= interptime && this.positions[i + 1].t >= interptime){
			var ratio = (interptime - this.positions[i].t)/(this.positions[i + 1].t - this.positions[i].t);
			var x = Math.round(this.positions[i].x + ratio * (this.positions[i + 1].x - this.positions[i].x));
			var y = Math.round(this.positions[i].y + ratio * (this.positions[i + 1].y - this.positions[i].y));
			var z = Math.round(this.positions[i].z + ratio * (this.positions[i + 1].z - this.positions[i].z));
			var dirX = Math.round(this.positions[i].dirX + ratio * (this.positions[i + 1].dirX - this.positions[i].dirX));

			this.x = x;
			this.y = y;
			this.z = z;
			this.dirX = dirX;
			this.positions.splice(0, i - 1);
			break;
		}
	}
}

Player.prototype.update = function(){
	this.msg = null;
	this.onGround = false;
	this.velX = 0;
	this.velZ = 0;
	this.velY += this.gravity;
	if(this.velY < this.maxGravity){
		this.velY = this.maxGravity;
	}

	var deplacementVector = {f:0, l:0};
	var nbElements = 0;

	if(this.inputs.u){
		deplacementVector.f += 1;
	}
	if(this.inputs.d){
		deplacementVector.f -= 1;
	}

	if(this.inputs.l){
		deplacementVector.l -= 1;
	}
	if(this.inputs.r){
		deplacementVector.l += 1;
	}
	
	if(deplacementVector.f != 0 || deplacementVector.l != 0){
		var angle = this.dirX + RadToDeg(Math.atan2(deplacementVector.l, deplacementVector.f));
		var rad = degToRad(angle);
		this.velX += Math.cos(rad) * (this.speed + this.boostSpeed);
		this.velZ += Math.sin(rad) * (this.speed + this.boostSpeed);
	}

	this.x += this.velX;
	this.y += this.velY;
	this.z += this.velZ;


	blocs = client.game.map.blocs;
	var min = null;
	for(var i in blocs){
		min = null
		if(this.hasCollision(blocs[i])){
			var deltas = this.getDeltaCollision(blocs[i]);
			for(var j in deltas){
				if(min == null || Math.abs(deltas[j]) < Math.abs(min.value)){
					min = {coord:j, value:deltas[j]};
				}
			}
			//Quel type de bloc
			switch(blocs[i].type) {
				case BLOC_TYPE.BOUNCE:

				break;
				case BLOC_TYPE.CHECKPOINT:
				if(min.coord = "y"){
					this.checkpoint = {
						x:Math.floor(blocs[i].x + blocs[i].width/2 - this.width/2),
						y:this.y,
						z:Math.floor(blocs[i].z + blocs[i].depth/2 - this.depth/2)
					}
				}
				break;
				case BLOC_TYPE.DEAD:
				this.respawn();
				break;
				case BLOC_TYPE.FINISH:
				if(this.startTimer != null){
					var tempus = Date.now() - this.startTimer;
					var oldTime = localStorage.getItem(client.game.map.id);
					var newRecord = false;
					if(!oldTime || tempus < oldTime){
						var newRecord = true;
						localStorage.setItem(client.game.map.id, tempus);
						client.display.showBest();
					}
					var html = "Temps effectué : "+timeDisplay(tempus);
					if(newRecord){
						html += "<br/> Nouveau record ! ";
					}
					socket.emit("time", {temps:tempus, record:newRecord});
					this.startTimer = null;

					$("#endRace").html(html);
					setTimeout(function(){
						$("#endRace").html("");
					}, 5000);
				}
				break;		
				case BLOC_TYPE.INFORMATION:
				this.msg = blocs[i].description;
				break;	
			}

			switch(min.coord) {
				case "x":
				this.x += min.value;
				this.boostSpeed = 0;
				break;
				case "y":
				this.y += min.value;
				if(this.velY < 0){
					this.onGround = true;
				}
				this.velY = 0;
				break;
				case "z":
				this.z += min.value;
				this.boostSpeed = 0;
				break;
			}
		}
	}
	
	if(this.inputs.j && this.onGround){
		this.velY += this.jump;
		if(!this.precOnGround){
			this.boostSpeed += this.deltaBoostSpeed;
			if(this.boostSpeed > this.maxBoostSpeed){
				this.boostSpeed = this.maxBoostSpeed;
			}
		}
	}
	if(this.onGround && this.precOnGround){
		this.boostSpeed = 0;
	}

	this.precOnGround = this.onGround;

	if(this.y < 0){
		this.respawn();
	}

	this.x = Number((this.x).toFixed(3)); 
	this.y = Number((this.y).toFixed(3)); 
	this.z = Number((this.z).toFixed(3)); 
}

Player.prototype.hasCollision = function(b){
	return (this.x <= b.x + b.width && this.x + this.width >= b.x && this.y <= b.y + b.height && this.y + this.height >= b.y && this.z <= b.z + b.depth && this.z + this.depth >= b.z);
}

Player.prototype.getDeltaCollision = function(b){
	var data = {};
	if(this.x <= b.x){
		data["x"] = -(this.x + this.width - b.x);
	}else{
		data["x"] = b.x + b.width - this.x;
	}

	if(this.y <= b.y){
		data["y"] = -(this.y + this.height - b.y);
	}else{
		data["y"] = b.y + b.height - this.y;
	}

	if(this.z <= b.z){
		data["z"] = -(this.z + this.depth - b.z);
	}else{
		data["z"] = b.z + b.depth - this.z;
	}
	return data;
}

Player.prototype.getInitInfo = function(){
	return {
		id:this.id,
		pseudo:this.pseudo,
		x:this.x,
		y:this.y,
		z:this.z,
		width:this.width,
		height:this.height,
		depth:this.depth
	};
}

Player.prototype.getSnapshotInfo = function(){
	return {
		id:this.id,
		x:Math.floor(this.x),
		y:Math.floor(this.y),
		z:Math.floor(this.z),
		dirX:Math.floor(this.dirX)
	}
}