
function Tea(tea)
{
	if(tea)
		this.title = tea.title;
	else
		this.title = "";
		
	if(tea)
		this.group = tea.group;
	else
		this.group = "type";
	
	if(tea)
		this.notes = tea.notes;
	else
		this.notes = "";
	
	if(tea)
		this.steepings = tea.steepings;
	else
		this.steepings = [];	
	
	if(tea)
		this.steeped = tea.steeped;
	else
		this.steeped = 0;

	
	if(tea)
		this.timeLabel = tea.timeLabel;
	else
		this.timeLabel = "0:00";
	
	if(tea)
		this.tempLabel = tea.tempLabel;
	else
		this.tempLabel = "0&deg;F";
		
	if(tea)
		this.steepingsLabel = tea.steepingsLabel;
	else
		this.steepingsLabel = "";
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
