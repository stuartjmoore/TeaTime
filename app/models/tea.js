function Tea(title, group, notes, steepings, steeped, timeLabel, tempLabel, steepingsLabel)
{
	if(title)
		this.title = title;
	else
		this.title = "";
		
	if(group)
		this.group = group;
	else
		this.group = "type";
	
	if(notes)
		this.notes = notes;
	else
		this.notes = "";
	
	if(steepings)
		this.steepings = steepings;
	else
		this.steepings = [];	
	
	if(steeped)
		this.steeped = steeped;
	else
		this.steeped = 0;

	
	if(timeLabel)
		this.timeLabel = timeLabel;
	else
		this.timeLabel = "0:00";
	
	if(tempLabel)
		this.tempLabel = tempLabel
	else
		this.tempLabel = "0&deg;F";
		
	if(steepingsLabel)
		this.steepingsLabel = steepingsLabel;
	else
		this.steepingsLabel = "";
		
	this.class = "Tea";
}

Tea.prototype.setTimeLabel = function() 
{	
	if(this.steepings.length > 0)
	{
		sec = this.steepings[this.steeped].time % 60;
		min = (this.steepings[this.steeped].time - sec) / 60;
					
		if(sec < 10)
			this.timeLabel = min + ":0" + sec;
		else
			this.timeLabel = min + ":" + sec;
	}
};

Tea.prototype.setTempLabel = function() 
{
	if(this.steepings.length > 0)
	{
		this.tempLabel = this.steepings[this.steeped].temp + "&deg;F";
	}
};

Tea.prototype.setSteepingLabel = function() 
{
	if(this.steepings.length > 0)
	{
		if(this.steeped > 1)
			this.steepingsLabel = " - " + this.steeped + " steepings";
		else if(this.steeped == 1)
			this.steepingsLabel = " - 1 steeping";
		else
			this.steepingsLabel = "";
	}
};