var Player = function(json){
    this.id;
	this.pseudo;
	this.socket;
    
	this.x = 0;
	this.y = 500;
	this.z = 0;

	this.width = 40;
	this.height = 80;
	this.depth = 40;

	this.velX = 0;
	this.velY = 0;
	this.velZ = 0;

	this.dirX = 270;
	this.dirY = 0;
	this.sensivity = 0.2;

	this.speed = 10;
	this.gravity = -1;
	this.maxGravity = -10;
	this.jump = 20;

	this.onGround = false;

	this.mesh;

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
    
    this.velX = 0;
    this.velY = 0;
    this.velZ = 0;
}

Player.prototype.update = function(){
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
		this.velX += Math.cos(rad) * this.speed;
		this.velZ += Math.sin(rad) * this.speed;
	}


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
			switch(min.coord) {
				case "x":
				this.x += min.value;
				break;
				case "y":
				this.y += min.value;
				this.velY = 0;
				this.onGround = true;
				break;
				case "z":
				this.z += min.value;
				break;
			}
		}
	}
	
	if(this.inputs.j && this.onGround){
		this.velY += this.jump;
	}

	this.x += this.velX;
	this.y += this.velY;
	this.z += this.velZ;

	this.x = Number((this.x).toFixed(3)); 
	this.y = Number((this.y).toFixed(3)); 
	this.z = Number((this.z).toFixed(3)); 

//	console.log(this.x+"/"+this.y+"/"+this.z);

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
        x:this.x,
	    y:this.y,
	    z:this.z,
	    dirX:this.dirX
    }
}