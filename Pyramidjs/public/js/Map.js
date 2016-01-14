var Map = function(json){
    this.id = 0;
    this.name = "";
    this.difficulty = 0
    this.times = {
        gold:0,
        silver:0,
        bronze:0
    }
	this.blocs = [];

    this.rotation = {
        x:0,
        y:0
    }
    
    this.spawnPosition = {};
    
    this.init(json);
}

Map.prototype.init = function(json){
	for(var i in json){
		this[i] = json[i];
	}
}

Map.prototype.getInitInfos = function(){
    return {
        id:this.id,
        name:this.name,
        difficulty:this.difficulty,
        times:this.times,
        blocs:this.blocs,
        spawnPosition:this.spawnPosition,
        rotation:this.rotation
    };
}