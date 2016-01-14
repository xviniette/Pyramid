var Display = function(id, client){
	this.id = id;

	this.client = client;
	this.initDisplay();

	this.canvas;


	this.skybox = [];
}

Display.prototype.initDisplay = function(){
	var window_w = $(window).width();
	var window_h = $(window).height();
	$("#game").width(window_w);
	$("#game").height(window_h);
	$("#game").clientWidth = window_w;
	$("#game").clientHeight = window_h;
	clearElements();
	var cameraInfos = {
		fov:75, 
		ratio:window_w/window_h,
		near:0.1,
		far:100000
	};
	camera.init(cameraInfos);
}

Display.prototype.resize = function(){
	camera.ratio = $(window).width()/$(window).height();
	$("#game").width($(window).width());
	$("#game").height($(window).height());
}

Display.prototype.initDrawing = function(){
	clearElements();
	this.skybox = [];
	var skyboxData = new generateSkybox(-5000, -5000, -5000, 10000, 10000, 10000);
	for(var i in skyboxData){
		skyboxData[i].texture = i;
		var e = new Element(skyboxData[i]);
		e.initBuffers();
		addElement(e);
		this.skybox.push(e);
	}
	
	var blocs = this.client.game.map.blocs;
	for(var i in blocs){
		var data = generateCube(blocs[i].x, blocs[i].y, blocs[i].z, blocs[i].width, blocs[i].height, blocs[i].depth);
		data.texture = blocs[i].type;
		var e = new Element(data);
		e.initBuffers();
		addElement(e);
	}

	var players = this.client.game.players;
	for(var i in players){
		if(players[i].id != this.client.pID){
			this.addPlayer(players[i]);
		}
	}
	this.blocsInfos();
	drawScene();
}

Display.prototype.render = function(){
	var players = this.client.game.players;
	for(var i in players){
		var p = players[i];
		if(p.id == this.client.pID){
			if(p.msg != null){
				$('#infobulle').html(p.msg);
			}else{
				$('#infobulle').html("");
			}
			if(p.startTimer == null){
				$('#timer').text("Pressez R pour redémarrer");
			}else{
				$('#timer').text(timeDisplay(Date.now() - p.startTimer));
			}
			camera.x = p.x + p.width/2;
			camera.y = p.y + p.height;
			camera.z = p.z + p.depth/2;


			camera.ry = -p.dirX - 90;
			camera.rx = p.dirY;

			/*for(var i in this.skybox){
				this.skybox[i].toPosition(camera.x, camera.y, camera.z);
				this.skybox[i].initBuffers();
			}*/

		}else{
			if(p.meshs){
				for(var k in p.meshs){
					p.meshs[k].toRotate(-p.dirX + 90);
					p.meshs[k].toPosition(p.x + p.width/2, p.y + p.height/2, p.z + p.depth/2);
					p.meshs[k].initBuffers(true);
				}
			}
		}
	}
	if(this.client.game.endTime != null){
		$("#timeleft").html(timeDisplay(this.client.game.endTime - Date.now(), true));
	}
	drawScene();
}

Display.prototype.addPlayer = function(p){
	/*var data = generateCube(-p.width/2, -p.height/2, -p.depth/2, p.width, p.height, p.depth);
	data.texture = 0;
	var e = new Element(data);
	p.mesh = e;
	//p.mesh.toRotate(0);
	p.mesh.toPosition(p.x + p.width/2, p.y + p.height/2, p.z + p.depth/2);
	p.mesh.initBuffers();
	addElement(e);*/

	p.meshs = [];
	var data = generatePlayer(-p.width/2, -p.height/2, -p.depth/2, p.width, p.height, p.depth);
	for(var i in data){
		data[i].texture = i;
		var e = new Element(data[i]);
		e.toPosition(p.x + p.width/2, p.y + p.height/2, p.z + p.depth/2);
		e.initBuffers();
		addElement(e);
		p.meshs.push(e);
	}
}

Display.prototype.removePlayer = function(p){
	for(var i in p.meshs){
		removeElement(p.meshs[i]);
	}
}

Display.prototype.updatePlayersList = function(){
	var html = '';
	if(this.client && this.client.game){
		for(var i in this.client.game.players){
			html += '<li>'+this.client.game.players[i].pseudo+'</li>';
		}
	}
	$("#players").html(html);
}

Display.prototype.showTimes = function(){
	var html = '';
	if(this.client && this.client.game){
		for(var i in this.client.game.map.times){
			html += '<li><img src="img/medailles/'+i+'.png" height="20px"> '+timeDisplay(this.client.game.map.times[i])+'</li>';
		}
	}
	$("#times").html(html);
}

Display.prototype.showBest = function(){
	if(this.client && this.client.game){
		if(localStorage.getItem(this.client.game.map.id)){
			$("#record").html("Best : "+timeDisplay(localStorage.getItem(this.client.game.map.id)));
		}
	}
}

Display.prototype.blocsInfos = function(){
	var html = "";
	for(var i in this.client.game.map.blocs){
		var b = this.client.game.map.blocs[i];
		html += "--------------<br/>";
		html += 'Type : <input type="number" i="'+i+'" att="type" min="0" max="5" value="'+b.type+'"><br/>';
		html += 'desc : <input type="text" i="'+i+'" att="description" value="'+b.description+'"><br/>';
		html += 'x : <input type="number" i="'+i+'" att="x" value="'+b.x+'" step="10"><br/>';
		html += 'y : <input type="number" i="'+i+'" att="y" value="'+b.y+'" step="10"><br/>';
		html += 'z : <input type="number" i="'+i+'" att="z" value="'+b.z+'" step="10"><br/>';
		html += 'w : <input type="number" i="'+i+'" att="width" value="'+b.width+'" step="10"><br/>';
		html += 'h : <input type="number" i="'+i+'" att="height" value="'+b.height+'" step="10"><br/>';
		html += 'd : <input type="number" i="'+i+'" att="depth" value="'+b.depth+'" step="10"><br/>';
		html += '<button onclick="deleteBloc('+i+')">Delete</button><br/>'
	}
	html += '<button onclick="addBloc()">Add</button>';
	$("#blocs").html(html);

	var inputs = document.getElementById('blocs').getElementsByTagName('input');
	for(var i in inputs){
		var inp = inputs[i]
		inp.onchange = function(){
			var index = this.getAttribute("i");
			var type = this.getAttribute("att");
			var value = this.value;
			if(type != "description"){
				value = parseInt(value);
			}
			client.game.map.blocs[index][type] = value;
			client.display.initDrawing();
		}
	}
}

Display.prototype.displayLevel = function(){
	var html = '';
	for(var i in this.client.maps){
		var m = this.client.maps[i];
		html += '<li onclick="playMap('+m.id+')"><h2>'+m.name+'</h2>Meilleur temps : ';
		var temps = 99999999999;
		if(localStorage.getItem(m.id)){
			temps = localStorage.getItem(m.id);
			html += timeDisplay(localStorage.getItem(m.id));
		}else{
			html += "Aucun"
		}
		html += "<h2>Médaille</h2>"
		var urlImageBase = "img/medailles/";
		var imgBase = "noob.png";
		for(var j in m.times){
			if(temps <= m.times[j]){
				imgBase = j+".png";
				break;
			}
		}
		html += '<img src="'+(urlImageBase+imgBase)+'">';
		html += '</li>';
	}
	$("#maps").html(html);
}