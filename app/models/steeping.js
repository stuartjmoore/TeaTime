function Steeping(steeping)
{
	if(steeping)
		this.time = steeping.time;
	else
		this.time = 150;
		
	if(steeping)
		this.temp = steeping.temp;
	else
		this.temp = 195;
	
	
	if(steeping)
		this.timeLabel = steeping.timeLabel;
	else			
	 	this.timeLabel = "2:30";
	 	
	if(steeping)
		this.tempLabel = steeping.tempLabel
	else
		this.tempLabel = "195&deg;F";
}

Steeping.prototype.setTime = function(time) 
{
	this.time = time;

	sec = this.time % 60;
	min = (this.time - sec) / 60;
					
	if(sec < 10)
		this.timeLabel = min + ":0" + sec;
	else
		this.timeLabel = min + ":" + sec;
};

Steeping.prototype.setTemp = function(temp) 
{
	this.temp = temp;
	this.tempLabel = this.temp + "&deg;F";
};