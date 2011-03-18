function Steeping(time, temp, timeLabel, tempLabel)
{
	if(time)
		this.time = time;
	else
		this.time = 150;
		
	if(temp)
		this.temp = temp;
	else
		this.temp = 195;
	
	
	if(timeLabel)
		this.timeLabel = timeLabel;
	else			
	 	this.timeLabel = "2:30";
	 	
	if(tempLabel)
		this.tempLabel = tempLabel
	else
		this.tempLabel = "195&deg;F";

		
	this.class = "Steeping";
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