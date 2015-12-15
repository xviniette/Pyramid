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