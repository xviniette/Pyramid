var Display = function(id, client){
	this.id = id;

	this.scene;
	this.camera;
	this.renderer;
	this.client = client;
	this.initDisplay();
}

Display.prototype.initDisplay = function(){
	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000 );
	this.renderer = new THREE.WebGLRenderer({canvas:document.getElementById(this.id)});
	this.renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(this.renderer.domElement);
}

Display.prototype.resize = function(){
	this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000 );
	this.renderer.setSize( window.innerWidth, window.innerHeight);
}

Display.prototype.initDrawing = function(){
	this.scene = new THREE.Scene();
	var blocs = this.client.game.map.blocs;
	for(var i in blocs){
		var geometry = new THREE.BoxGeometry(blocs[i].width, blocs[i].height, blocs[i].depth);
		for ( var j = 0; j < geometry.faces.length; j++ ) {
			geometry.faces[j].color.setHex( Math.random() * 0xffffff );
		}
		var material = new THREE.MeshBasicMaterial({color: 0xffffff, vertexColors:THREE.FaceColors});
		var b = new THREE.Mesh(geometry, material);

		b.position.x = blocs[i].x + blocs[i].width/2;
		b.position.y = blocs[i].y + blocs[i].height/2;
		b.position.z = blocs[i].z + blocs[i].depth/2;
		this.scene.add(b);
	}

	//Joueurs
	var players = this.client.game.players;
	for(var i in players){
		if(players[i].id != this.client.pID){
			var p = players[i];
			var geometry = new THREE.BoxGeometry(p.width, p.height, p.depth);
			var material = new THREE.MeshBasicMaterial({color:0xff0000, wireframe:true});
			p.mesh = new THREE.Mesh(geometry, material);
			p.mesh.position.x = p.x + p.width/2;
			p.mesh.position.y = p.y + p.height/2;
			p.mesh.position.z = p.z + p.depth/2;
			this.scene.add(p.mesh);
		}
	}
}

Display.prototype.addPlayer = function(p){
	var geometry = new THREE.BoxGeometry(p.width, p.height, p.depth);
	var material = new THREE.MeshBasicMaterial({color:0xff0000, wireframe:true});
	p.mesh = new THREE.Mesh(geometry, material);
	p.mesh.position.x = p.x + p.width/2;
	p.mesh.position.y = p.y + p.height/2;
	p.mesh.position.z = p.z + p.depth/2;
	this.scene.add(p.mesh);
}

Display.prototype.removePlayer = function(p){
	this.scene.remove(p.mesh);
}

Display.prototype.render = function(){
	var players = this.client.game.players;
	for(var i in players){
		var p = players[i];
		if(p.id == this.client.pID){
			this.camera.position.x = p.x + p.width/2;
			this.camera.position.y = p.y + p.height;
			this.camera.position.z = p.z + p.depth/2;


			this.camera.rotation.y = -degToRad(p.dirX + 90);
		}else{
			p.mesh.position.x = p.x + p.width/2;
			p.mesh.position.y = p.y + p.height/2;
			p.mesh.position.z = p.z + p.depth/2;
		}
	}

	this.renderer.render(this.scene, this.camera);
}