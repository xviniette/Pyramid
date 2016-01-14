var gl;
var shaderProgram;
var textures = {};
var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();
var elementindex = 1;
var elements = [];
var camera;
var light = {
	lightingDirection:[-0.25,-0.25,-1.0],
	colorDirection:{
		r:0.0,
		g:0.0,
		b:0.0
	},
	colorAmbient:{
		r:1.0,
		g:1.0,
		b:1.0
	}
}

function initGL(canvas) {
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry :-(");
	}
}

function getShader(gl, id) {
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}

	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}

	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

function initShaders() {
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}

	gl.useProgram(shaderProgram);

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	/*shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
	gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);*/

	shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
	gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
	shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
	/*shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
	shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
	shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
	shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");*/
}

function handleLoadedTexture(textures) {
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

	for(var i in textures){
		gl.bindTexture(gl.TEXTURE_2D, textures[i]);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textures[i].image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	}

	gl.bindTexture(gl.TEXTURE_2D, null);
}

function initTexture(sources){
	textures = {};
	var nbSources = 0;
	for(var i in sources){
		nbSources++;
	}

	for(var i in sources){
		var t = gl.createTexture();
		t.image = new Image();
		textures[i] = t;

		t.image.onload = function(){
			nbSources--;
			if(nbSources == 0){
				handleLoadedTexture(textures);
			}
		}
		t.image.src = sources[i];
	}
}

function mvPushMatrix() {
	var copy = mat4.create();
	mat4.set(mvMatrix, copy);
	mvMatrixStack.push(copy);
}

function mvPopMatrix() {
	if (mvMatrixStack.length == 0) {
		throw "Invalid popMatrix!";
	}
	mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms() {
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

	var normalMatrix = mat3.create();
	mat4.toInverseMat3(mvMatrix, normalMatrix);
	mat3.transpose(normalMatrix);
	gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
}

function degToRad(degrees) {
	return degrees * Math.PI / 180;
}

function drawScene() {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	mat4.perspective(camera.fov, camera.ratio, camera.near, camera.far, pMatrix);

	mat4.identity(mvMatrix);

	mat4.rotate(mvMatrix, degToRad(-camera.rx), [1, 0, 0]);
	mat4.rotate(mvMatrix, degToRad(-camera.ry), [0, 1, 0]);
	mat4.translate(mvMatrix, [-camera.x, -camera.y, -camera.z]);

	for(var i in elements){
		gl.bindBuffer(gl.ARRAY_BUFFER, elements[i].vertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, elements[i].vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

		/*gl.bindBuffer(gl.ARRAY_BUFFER, elements[i].vertexNormalBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, elements[i].vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
*/
		gl.bindBuffer(gl.ARRAY_BUFFER, elements[i].vertexTextureCoordBuffer);
		gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, elements[i].vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, textures[elements[i].texture]);
		gl.uniform1i(shaderProgram.samplerUniform, 0);
/*
		gl.uniform1i(shaderProgram.useLightingUniform, true);
		gl.uniform3f(
			shaderProgram.ambientColorUniform, light.colorAmbient.r, light.colorAmbient.g, light.colorAmbient.b);
		var adjustedLD = vec3.create();
		vec3.normalize(light.lightingDirection, adjustedLD);
		vec3.scale(adjustedLD, -1);
		gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);
		gl.uniform3f(shaderProgram.directionalColorUniform, light.colorDirection.r, light.colorDirection.g, light.colorDirection.b);

*/
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elements[i].vertexIndexBuffer);
		setMatrixUniforms();
		gl.drawElements(gl.TRIANGLES, elements[i].vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	}
}

var generateCube = function(x, y, z, w, h, d){
	return {
		vertices:[
		x, y, z, 
		x + w, y, z, 
		x + w, y + h, z, 
		x, y + h, z, 

		x, y, z + d, 
		x + w, y, z + d, 
		x + w, y + h, z + d, 
		x, y + h, z + d, 

		x, y, z, 
		x, y, z + d, 
		x, y + h, z + d, 
		x, y + h, z, 

		x + w, y, z, 
		x + w, y, z + d, 
		x + w, y + h, z + d, 
		x + w, y + h, z, 

		x, y, z, 
		x + w, y, z, 
		x + w, y, z + d, 
		x, y, z + d, 

		x, y + h, z, 
		x + w, y + h, z, 
		x + w, y + h, z + d, 
		x, y + h, z + d],
		textures:[
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,

		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,

		0.0, 1.0,
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,

		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,
		1.0, 0.0,

		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,

		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		],
		indices:[
		0, 1, 2,      0, 2, 3,   
		4, 5, 6,      4, 6, 7,  
		8, 9, 10,     8, 10, 11,  
		12, 13, 14,   12, 14, 15, 
		16, 17, 18,   16, 18, 19, 
		20, 21, 22,   20, 22, 23  
		],
		normales:[ 
		0.0,  0.0,  1.0, 
		0.0,  0.0,  1.0, 
		0.0,  0.0,  1.0, 
		0.0,  0.0,  1.0, 

		0.0,  0.0, -1.0, 
		0.0,  0.0, -1.0, 
		0.0,  0.0, -1.0, 
		0.0,  0.0, -1.0, 

		0.0,  1.0,  0.0, 
		0.0,  1.0,  0.0, 
		0.0,  1.0,  0.0, 
		0.0,  1.0,  0.0, 

		0.0, -1.0,  0.0, 
		0.0, -1.0,  0.0, 
		0.0, -1.0,  0.0, 
		0.0, -1.0,  0.0, 

		1.0,  0.0,  0.0, 
		1.0,  0.0,  0.0, 
		1.0,  0.0,  0.0, 
		1.0,  0.0,  0.0, 

		-1.0,  0.0,  0.0, 
		-1.0,  0.0,  0.0, 
		-1.0,  0.0,  0.0, 
		-1.0,  0.0,  0.0, 
		]
	};
}


var generateSkybox = function(x, y, z, w, h, d){
	var faces = {
		"south":{}, 
		"north":{},
		"east":{}, 
		"west":{}, 
		"down":{}, 
		"up":{}, 
	};
	var box = generateCube(x, y, z, w, h, d);
	var nb = 0;
	for(var i in faces){
		faces[i].vertices = box.vertices.slice(nb*12, nb*12+12);
		faces[i].textures = box.textures.slice(0, 8);
		faces[i].indices = box.indices.slice(0, 6);
		faces[i].normales = box.normales.slice(nb*12, nb*12+12);
		nb++;
	}
	return faces;
}

var generatePlayer = function(x, y, z, w, h, d){
	var faces = {
		"back":{}, 
		"face":{},
		"sider":{}, 
		"sidel":{}, 
		"top":{}, 
		"bottom":{}, 
	};
	var box = generateCube(x, y, z, w, h, d);
	var nb = 0;
	for(var i in faces){
		faces[i].vertices = box.vertices.slice(nb*12, nb*12+12);
		faces[i].textures = box.textures.slice(0, 8);
		faces[i].indices = box.indices.slice(0, 6);
		faces[i].normales = box.normales.slice(nb*12, nb*12+12);
		nb++;
	}
	return faces;
}

function webGLStart(id) {
	var canvas = document.getElementById(id);
	initGL(canvas);
	initShaders();
	initTexture(textures_sources);
	camera = new Camera();
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	/*var request = new XMLHttpRequest();
	request.open("GET", "Teapot.json");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			var d = JSON.parse(request.responseText);
			d.texture = 0;
			var e = new Element(d);
			e.toPosition(20, 2, 2);
			e.toScale(1, 1, 1);
			e.toRotate(0);
			e.initBuffers();
			elements.push(e);
		}
	}
	request.send();*/
}

//ELEMENTS
function addElement(e){
	e.id = elementindex;
	elementindex++;
	elements.push(e);
}

function removeElement(e){
	for(var i in elements){
		if(elements[i].id == e.id){
			elements.splice(i, 1);
			break;
		}
	}
}

function clearElements(){
	elements = [];
	elementindex = 1;
}


//MAP EDITOR FAST
