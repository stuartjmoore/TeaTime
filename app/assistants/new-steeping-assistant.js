
function NewSteepingAssistant(steeping) 
{
	if(steeping)
	{
		this.steeping = steeping;	
		this.sec = steeping.time % 60;
		this.min = (steeping.time - this.sec) / 60;
		this.temp = steeping.temp;
		this.isNew = false;
	}
	else
	{
		this.steeping = {};	
		this.min = 2;
		this.sec = 30;
		this.temp = 195;
		this.isNew = true;
	}
}

NewSteepingAssistant.prototype.setup = function() 
{
	this.controller.setupWidget("minPicker",
		this.attributes = {
			label: 'time',
        	modelProperty: 'value',
        	labelPlacement: Mojo.Widget.labelPlacementLeft,
        	min: 0,
        	max: 10
    	},
    	this.minModel = {
        	value: this.min
    	}
	); 
	this.controller.setupWidget("secPicker",
		this.attributes = {
			label: '\0',
        	modelProperty: 'value',
        	labelPlacement: Mojo.Widget.labelPlacementLeft,
        	min: 0,
        	max: 59,
        	padNumbers: true
    	},
    	this.secModel = {
        	value: this.sec
    	}
	); 
	
	this.controller.setupWidget("tempPicker",
		this.attributes = {
			label: 'temp',
        	modelProperty: 'value',
        	labelPlacement: Mojo.Widget.labelPlacementLeft,
        	min: 150,
        	max: 212
    	},
    	this.tempModel = {
        	value: this.temp
    	}
	); 
	    
	this.cmdMenuModel = 
	{
    	visible: true,
    	items: 
    	[
        	{ items:[{ label:$L('Done'), command:'done' }] }
    	]
	};
	this.controller.setupWidget(Mojo.Menu.commandMenu, undefined, this.cmdMenuModel);
};


NewSteepingAssistant.prototype.handleCommand = function(event) 
{
	this.min = this.minModel.value;
	this.sec = this.secModel.value;
	this.temp = this.tempModel.value;

    if(event.type == Mojo.Event.command)
    {
        switch(event.command) 
        {
            case 'done':
            	if(!this.steeping.time)
            		this.kind = "new";
            	else
            		this.kind = "replace";
            	
				this.steeping.time = this.sec + 60*this.min;
				this.steeping.temp = this.temp;
				
			
		   		if(this.sec < 10)
		    		this.steeping.timeLabel = this.min + ":" + '0' + this.sec;
		    	else
		    		this.steeping.timeLabel = this.min + ":" + this.sec;
		    		
				this.steeping.tempLabel = this.temp + "&deg;F";
				
				
            	this.result = {kind:this.kind, steeping:this.steeping};
				
				Mojo.Controller.stageController.popScenesTo("new-tea", this.result);
                break;
        }
    }
};

NewSteepingAssistant.prototype.activate = function(event) 
{
};

NewSteepingAssistant.prototype.deactivate = function(event) 
{
};

NewSteepingAssistant.prototype.cleanup = function(event) 
{
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
