var Bloc = function(x, y, z, w, h , d, type, description){
    this.type = type || 0;
    this.description = description || null;
	this.x = x;
	this.y = y;
	this.z = z;
	this.width = w;
	this.height = h;
	this.depth = d;
}

Bloc.prototype.init = function(json){
	for(var i in json){
		this[i] = json[i];
	}
}
