var Map = function(json){
    this.name = "";
    this.difficulty = 0
    this.times = {
        gold:0,
        silver:0,
        bronze:0
    }
	this.blocs = [];
    
    this.spawnPosition = {};
    
    this.init(json);
}

Map.prototype.init = function(json){
	for(var i in json){
		this[i] = json[i];
	}
}


Map.prototype.generateMap = function(){
    this.name = "test";
    this.difficulty = 5;
    
    this.blocs.push(new Bloc(0, 200, 0, 1000, 50, 1000));
	this.blocs.push(new Bloc(300, 250, 0, 200, 100, 300));
	this.blocs.push(new Bloc(400, 450, 300, 100, 50, 50));
	this.blocs.push(new Bloc(600, 250, 500, 100, 300, 100));
	this.blocs.push(new Bloc(800, 250, 800, 200, 500, 200));
	this.blocs.push(new Bloc(0, 600, 800, 200, 20, 200));
	this.blocs.push(new Bloc(300, 500, 600, 100, 30, 100));
    
    this.spawnPosition = {
        x:0,
        y:500,
        z:0
    }
}

Map.prototype.getInitInfos = function(){
    return {
        name:this.name,
        difficulty:this.difficulty,
        times:this.times,
        blocs:this.blocs
    };
}