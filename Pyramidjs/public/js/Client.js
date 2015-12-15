var Client = function(){
	this.pID = 0;
	this.display = new Display("game", this);
    this.game = new Game({client:this});

	this.keys = [];

	this.fps = FPS;
	this.deltaTime = 1/this.fps;
	this.lastFrame = Date.now();
}

Client.prototype.update = function(){
	var now = Date.now();
	var d = this.deltaTime * 1000;
	while(now - this.lastFrame >= d){
        this.game.update();
        this.display.render();
		this.lastFrame += d;
	}
}

Client.prototype.onInit = function(data){
    this.game = new Game(data);
    this.game.client = this;
    this.game.players = {};
    for(var i in data.players){
        this.game.players[data.players[i].id] = new Player(data.players[i]);
    }
    this.game.map = new Map(data.map);
    if(data.timeLeft){
        this.game.endTime = Date.now() + data.timeLeft;
    }else{
        this.game.endTime = null;
    }
    this.display.initDrawing();
}

Client.prototype.onSnapshot = function(data){
    var data = data.players;
    for(var i in data){
        for(var j in this.game.players){
            if(this.game.players[j].id == data[i].id && data[i].id != this.pID){
                this.game.players[j].init(data[i]);
            }
        }
    }
}

Client.prototype.addPlayer = function(p){
    client.game.addPlayer(p);
    this.display.addPlayer(p);
}

Client.prototype.deletePlayer = function(p){
    client.game.deletePlayer(p);
    this.display.removePlayer(p);
}