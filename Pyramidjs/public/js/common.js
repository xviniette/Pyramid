var isValidPseudo = function(pseudo){
	if (pseudo.length <= 20 && /^([a-zA-Z0-9]+)$/.test(pseudo)){
		return true;
	}
	return false;
}

var orderBy = function(t, val, desc){
	var t = t.slice();
	var asc = desc == null || desc == false;
	var tab = [];
	var tot = t.length;
	for(var i = 0; i < tot; i++){
		var index = 0;
		var temp = t[index];
		for(var j = 1; j < t.length; j++){
			if(t[j][val] != undefined && ((asc && t[j][val] <= temp[val]) || (!asc && t[j][val] >= temp[val]))){
				index = j;
				temp = t[j];
			}
		}
		tab.push(temp);
		t.splice(index, 1);
	}
	return tab;
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

var distance = function(x1, y1, x2, y2){
	return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}

var random = function(min, max){
	return Math.round(Math.random() * (max - min) + min);
}

var degToRad = function(deg){
	return deg * Math.PI/180;
}

var RadToDeg = function(radians) {
	return radians * 180 / Math.PI;
};

var timeDisplay = function(time, noms){
	var minutes = Math.floor((time/1000)/60);
	var secondes = Math.floor(time/1000 - minutes*60);
	var ms = time - ((minutes*60*1000) + secondes*1000);
	var html = (minutes < 10) ? "0"+minutes:minutes;
	html += ':';
	html += (secondes < 10) ? "0"+secondes:secondes;
	if(noms != true){
		html += '.';
		if(ms < 10){
			html += "00";
		}else if(ms < 100){
			html += "0";
		}
		html += ms;
	}
	return html;
}


var showHome = function(){
	$("#home").show();
	$("#timer").hide();
	$("#infobulle").hide();
	$("#solo").hide();
	$("#tchat").hide();
	$("#game").hide();
	$("#times").hide();
	$("#record").hide();
	$("#timeleft").hide();
}

var showGame = function(){
	$("#game").show();
	$("#timer").show();
	$("#infobulle").show();
	$("#solo").hide();
	$("#home").hide();
	$("#times").show();
	$("#record").show();
	$("#timeleft").show();
	if(client.game.online){
		$("#tchat").show();
		$("#players").show();
	}
}

var showLevels = function(){
	$("#solo").show();
	$("#home").hide();
	$("#timer").hide();
	$("#infobulle").hide();
	$("#tchat").hide();
	$("#game").hide();
	$("#times").hide();
	$("#record").hide();
	$("#timeleft").hide();

	client.display.displayLevel();
}