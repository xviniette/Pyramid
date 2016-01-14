var Client = function(){
	this.pID = 0;
	this.display = new Display("game", this);
    this.game = new Game({client:this});

    this.maps;

	this.keys = [];

	this.fps = FPS;
	this.deltaTime = 1/this.fps;
	this.lastFrame = Date.now();
}

Client.prototype.respawn = function(){
    if(this.game){
        for(var i in this.game.players){
            if(this.game.players[i].id == this.pID){
                this.game.players[i].spawn(this.game.map);
                break;
            }
        }
    }
}

Client.prototype.checkpoint = function(){
    if(this.game){
        for(var i in this.game.players){
            if(this.game.players[i].id == this.pID){
                this.game.players[i].respawn();
                break;
            }
        }
    }
}

Client.prototype.launchLocalGame = function(id){
    showGame();
    for(var i in this.maps){
        if(this.maps[i].id == id){
            this.game = new Game();
            this.game.client = this;
            this.pID = 0;
            this.game.map = new Map(this.maps[i]);
            var p = new Player();
            p.spawn(this.game.map);
            this.game.players = {};
            this.game.addPlayer(p);
            this.display.showTimes();
            this.display.showBest();
            this.display.initDrawing();
            break;
        }
    }
}

Client.prototype.update = function(){
	var now = Date.now();
	var d = this.deltaTime * 1000;
    var i = 0;
	while(now - this.lastFrame >= d){
        this.game.update();
        if(i < 2){
            this.display.render();
        }
        i++;
		this.lastFrame += d;
	}
}

Client.prototype.onInit = function(data){
    this.game.map = new Map(data.map);
    this.game = new Game(data);
    this.game.online = true;
    this.game.client = this;
    this.game.players = {};
    for(var i in data.players){
        this.game.players[data.players[i].id] = new Player(data.players[i]);
        if(data.players[i].id == this.pID){
            data.players[i].dirX = data.map.rotation.x;
            data.players[i].dirY = data.map.rotation.y;
        }
        this.game.players[data.players[i].id].spawn(this.game.map);
    }
    if(data.timeLeft){
        this.game.endTime = Date.now() + data.timeLeft;
    }else{
        this.game.endTime = null;
    }
    showGame();
    this.display.initDrawing();
    this.display.showTimes();
    this.display.showBest();
    this.display.updatePlayersList();
}

Client.prototype.onSnapshot = function(data){
    var now = Date.now();
    var data = data.players;
    for(var i in data){
        for(var j in this.game.players){
            if(this.game.players[j].id == data[i].id && data[i].id != this.pID){
                data[i].t = now;
                this.game.players[j].positions.push(data[i]);
            }
        }
    }
}

Client.prototype.addPlayer = function(p){
    client.game.addPlayer(p);
    this.display.addPlayer(p);
    this.display.updatePlayersList();
}

Client.prototype.deletePlayer = function(p){
    for(var i in this.game.players){
        if(this.game.players[i].id == p.id){
            this.display.removePlayer(this.game.players[i]);
        }
    }
    client.game.deletePlayer(p);
    this.display.updatePlayersList();
}