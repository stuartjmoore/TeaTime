
function TimerAssistant(tea) 
{  
	this.tea = tea;
	
	this.time = tea.steepings[tea.steeped].time;
	this.timeleft = this.time;
	
	this.pause = false;
    
	this.start_date = new Date();
	this.timer = setInterval(this.updateTimer.bind(this), 1000);
}

TimerAssistant.prototype.setup = function() 
{
	this.controller.get('title').innerHTML = this.tea.title;
	this.controller.get('timer').innerHTML = secToString(this.time);
	
 
	this.controller.setupWidget(Mojo.Menu.commandMenu,
		undefined, 
		this.cmdMenuModel = {
    		visible: true,
    		items: 
    		[
        		{ items:[] },
        		{ items:[] },
        		{ items:[{ label:$L('Edit'), command:'edit' },{ label:$L('Reset Steepings'), command:'reset' }] }
    		]
		}
	);
};

TimerAssistant.prototype.updateTimer = function() 
{ 
	cur = new Date();
	this.timeleft = this.time - ((cur.getTime() - this.start_date.getTime()) / 1000).toFixed(0);
	
	this.controller.get('timer').innerHTML = secToString(this.timeleft);

	if(this.timeleft <= 0)
	{	
		Mojo.Controller.getAppController().playSoundNotification("vibrate", "");
		clearInterval(this.timer);
		Mojo.Controller.getAppController().playSoundNotification("vibrate", "");
		
		this.tea.steeped += 1;
		
		if(this.tea.steeped == this.tea.steepings.length)
		    this.tea.steeped = 0;
		
		this.tea.setTimeLabel();
		this.tea.setTempLabel();
		this.tea.setSteepingLabel();
		
		Mojo.Controller.stageController.popScene("timer done");
	}
};

TimerAssistant.prototype.pauseTimer = function(event) 
{
	this.pause = !this.pause;
	
	if(this.pause)
	{
		this.time = this.timeleft;
		clearInterval(this.timer);
		window.clearTimeout(this.delay);
		this.controller.get('timer-pause').innerHTML = '<div class="palm-button-wrapper">Continue</div>';
	}
	else
	{
        this.start_date = new Date();
		this.timer = setInterval(this.updateTimer.bind(this), 1000);
		this.delay = this.finishTimer.bind(this).delay(this.time);
		this.controller.get('timer-pause').innerHTML = '<div class="palm-button-wrapper">Pause</div>';
	}
};

TimerAssistant.prototype.handleCommand = function(event) 
{
	if(event.type == Mojo.Event.command) 
    {
        switch(event.command) 
        {
            case 'edit':  
				Mojo.Controller.stageController.swapScene("new-tea", this.tea);
                break;
            case 'reset': 
            	this.tea.steeped = 0;
            	
				this.tea.setTimeLabel();
				this.tea.setTempLabel();
				this.tea.setSteepingLabel();
				
				Mojo.Controller.stageController.popScene("steepings reset");
                break; 
        }
    }
}; 

TimerAssistant.prototype.activate = function(event) 
{
	this.pauseTimerHandler = this.pauseTimer.bindAsEventListener(this);
	this.controller.get('timer-pause').observe(Mojo.Event.tap, this.pauseTimerHandler );
};

TimerAssistant.prototype.deactivate = function(event)
{
	this.controller.get('timer-pause').stopObserving(Mojo.Event.tap, this.pauseTimerHandler);
	
	clearInterval(this.timer);
	window.clearTimeout(this.delay);
};

TimerAssistant.prototype.cleanup = function(event) 
{
};


/*
 * From: http://code.google.com/p/webos-teatimer/
 */
function secToString(seconds) 
{
	sec = seconds % 60;
	min = (seconds - sec) / 60;
	
	string = min + ":";
	if (sec < 10)
		string += "0";
	string += sec;
	return string;
}