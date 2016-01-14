var Element = function(json){
	this.index;
	this.lastPosition = {
		x:0,
		y:0,
		z:0
	}

	this.position = {
		x:0,
		y:0,
		z:0
	}

	this.lastRotation = {
		x:0,
		y:0,
		z:0
	}

	this.rotation = {
		x:0,
		y:0,
		z:0
	}

	this.lastScale = {
		x:1,
		y:1,
		z:1
	}

	this.scale = {
		x:1,
		y:1,
		z:1
	}

	this.texture = null;

	this.vertices = [];
	this.indices = [];
	this.colors = [];
	this.textures = [];

	this.load = false;

	this.vertexPositionBuffer;
	this.vertexTextureCoordBuffer;
	this.vertexColorBuffer;
	this.vertexIndexBuffer;
	this.vertexNormalBuffer;

	this.init(json)
}

Element.prototype.init = function(json){
	for(var i in json){
		this[i] = json[i];
	}
}

Element.prototype.toScale = function(x, y, z){
	this.scale = {
		x:x,
		y:y,
		z:z
	}

	for(var i = 0; i < this.vertices.length; i++){
		switch (i%3){
			case 0:
			this.vertices[i]*=this.scale.x;
			break;
			case 1:
			this.vertices[i]*=this.scale.y;
			break;
			case 1:
			this.vertices[i]*=this.scale.z;
			break;
		}
	}
}

Element.prototype.toPosition = function(x, y, z){
	this.lastPosition = JSON.parse(JSON.stringify(this.position));
	this.position = {
		x:x,
		y:y,
		z:z
	}

	for(var i = 0; i < this.vertices.length; i++){
		switch (i%3){
			case 0:
			this.vertices[i]+=this.position.x-this.lastPosition.x;
			break;
			case 1:
			this.vertices[i]+=this.position.y-this.lastPosition.y;
			break;
			case 2:
			this.vertices[i]+=this.position.z-this.lastPosition.z;
			break;
		}
	}
}

function rotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}


Element.prototype.toRotate = function(y){
	var deltay = y - this.lastRotation.y;
	this.toPosition(0, 0, 0);
	var x1 = 0;
	var y1 = 0;
	for(var i = 0; i < this.vertices.length; i++){
		switch (i%3){
			case 0:
			x1 = this.vertices[i];
			y1 = this.vertices[i+2];
			this.vertices[i] = x1 * Math.cos(degToRad(deltay)) + y1 * Math.sin(degToRad(deltay));
			break;
			case 2:
			this.vertices[i] = y1 * Math.cos(degToRad(deltay)) - x1 * Math.sin(degToRad(deltay));
			break;
		}
	}
	this.toPosition(this.lastPosition.x, this.lastPosition.y, this.lastPosition.z);
	this.lastRotation.y = y;
}

Element.prototype.initBuffers = function(onlyvertices){
	//chargement vertices
	this.vertexPositionBuffer  = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	this.vertexPositionBuffer.itemSize = 3;
	this.vertexPositionBuffer.numItems = this.vertices.length/this.vertexPositionBuffer.itemSize;
	if(onlyvertices){
		return;
	}

	//chargement indices
	this.vertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
	this.vertexIndexBuffer.itemSize = 1;
	this.vertexIndexBuffer.numItems = this.indices.length;

	//chargement normales
	if(this.normales.length > 0){
		this.vertexNormalBuffer = gl.createBuffer(); 
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer); 
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normales), gl.STATIC_DRAW); 
		this.vertexNormalBuffer.itemSize = 3; 
		this.vertexNormalBuffer.numItems = this.normales.length/this.vertexNormalBuffer.itemSize;
	}

	//chargement couleurs
	if(this.colors.length > 0){
		this.vertexColorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
		this.vertexColorBuffer.itemSize = 4;
		this.vertexColorBuffer.numItems = this.colors.length/this.vertexColorBuffer.itemSize;
	}

	//chargement textures
	if(this.textures.length > 0){
		this.vertexTextureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textures), gl.STATIC_DRAW);
		this.vertexTextureCoordBuffer.itemSize = 2;
		this.vertexTextureCoordBuffer.numItems = this.textures.length/this.vertexTextureCoordBuffer.itemSize;
	}
	this.load = true;
}
