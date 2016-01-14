var FPS = 60;
var FPSNETWORK = 20;
var INTERPOLATION = 100;

var PORT = 1326;
var IP = "127.0.0.1";

var BLOC_TYPE = {
	CLASSIC:0,
	BOUNCE:1,
	CHECKPOINT:2,
	DEAD:3,
	FINISH:4,
	INFORMATION:5
}


var textures_sources = {
	0:"img/sand.jpg",
	2:"img/checkpoint.jpg",
	3:"img/lava.jpg",
	4:"img/finish.jpg",
	5:"img/information.jpg",
	"up":"img/sahara_up.jpg",
	"down":"img/sahara_down.jpg",
	"west":"img/sahara_west.jpg",
	"east":"img/sahara_east.jpg",
	"north":"img/sahara_north.jpg",
	"south":"img/sahara_south.jpg",
	"back":"img/back.png",
	"bottom":"img/bottom.png",
	"face":"img/face.png",
	"sider":"img/sider.png",
	"sidel":"img/sidel.png",
	"top":"img/top.png",
}