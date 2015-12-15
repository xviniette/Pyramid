var UniqueNumber = function(min){
	this.min = min;
	this.usedNumbers = {};
}

UniqueNumber.prototype.get = function(){
	for(var i = this.min; i < Object.keys(this.usedNumbers).length+1; i++){
		if(this.usedNumbers[i] == undefined || this.usedNumbers[i] == false){
			this.usedNumbers[i] = true;
			return i;
		}
	}
	this.usedNumbers[i] = true;
	return i;
}

UniqueNumber.prototype.free = function(i){
	this.usedNumbers[i] = false;
}