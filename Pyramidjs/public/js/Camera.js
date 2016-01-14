var Camera = function(json){
	this.x = 0;
	this.y = 600;
	this.z = 0;
	this.rx = 0;
	this.ry = 200;
	this.rz = 0;

	this.fov = 75;
	this.ratio = $(window).width()/$(window).height();
	this.near = 0.1;
	this.far = 10000.0;

	this.init(json)
}

Camera.prototype.init = function(json){
	for(var i in json){
		this[i] = json[i];
	}
}