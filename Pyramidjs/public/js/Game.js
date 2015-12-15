var Game = function(json){
	this.client;
	this.players = {};
	this.map = new Map();
	this.map.generateMap();
    
    this.endTime = null;

    this.init(json);
}

Game.prototype.init = function(json){
	for(var i in json){
		this[i] = json[i];
	}
}

Game.prototype.start = function(){
	this.endTime = Date.now() + 5 * 60 * 1000;
}

Game.prototype.update = function(){
    if(isServer){
        //En ligne
        var snapshot = this.getSnapshot();
        for(var i in this.players){
            Utils.messageTo(this.players[i].socket, "snapshot", snapshot);
        }
    }else{
        //Client
        for(var i in this.players){
            if(this.players[i].id == this.client.pID){
            	//moi
            	this.players[i].inputs = this.client.keys;
            	this.players[i].update();
            	socket.emit("position", this.players[i].getSnapshotInfo());
            }
        }
    }
   
}

Game.prototype.addPlayer = function(p){
    var toAdd = true;
	for(var i in this.players){
		if(this.players[i].id == p.id){
			toAdd = false;
			break;
		}
	}
	if(isServer){
		if(toAdd){
			for(var i in this.players){
				Utils.messageTo(this.players[i].socket, "newPlayer", p.getInitInfo());
			}
            p.spawn(this.map);
            this.players[p.socket] = p;
			Utils.messageTo(p.socket, "init", this.getInit());
		}
	}else{
		if(toAdd){
            this.players[p.id] = p;
		}
	}
}

Game.prototype.deletePlayer = function(p){
    var del = false;
	for(var i in this.players){
		if(this.players[i].id == p.id){
			del = true;
            if(isServer){
                delete this.players[p.socket];
            }else{
                delete this.players[p.id];
            }
		}
	}
	if(isServer){
		if(del){
			for(var i in this.players){
				Utils.messageTo(this.players[i].socket, "deletePlayer", {id:p.id});
			}
		}
	}
	return del;
}

Game.prototype.getPlayerBySocket = function(socket){
	if(this.players[socket]){
		return this.players[socket];
	}
	return null;
}

Game.prototype.getPlayerById = function(id){
	for(var i in this.players){
		if(this.players[i].id == id){
			return this.players[i];
		}
	}
	return null;
}

Game.prototype.getNbPlayers = function(){
	return Object.keys(this.players).length;
}

Game.prototype.getSnapshot = function(){
    var data = {};
    data.players = [];
    for(var i in this.players){
        data.players.push(this.players[i].getSnapshotInfo());
    }
    return data;
}

Game.prototype.getInit = function(){
    var data = {};
    data.timeLeft = this.endTime - Date.now();
    data.map = this.map.getInitInfos();
    data.players = [];
    for(var i in this.players){
        data.players.push(this.players[i].getInitInfo());
    }
    return data;
}