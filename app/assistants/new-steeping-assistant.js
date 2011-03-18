
function NewSteepingAssistant(steeping) 
{
	if(!steeping)
	{
		this.steeping = new Steeping();	
		this.min = 2;
		this.sec = 30;
		this.isNew = true;
	}
	else
	{
		this.steeping = steeping;	
		this.sec = steeping.time % 60;
		this.min = (steeping.time - this.sec) / 60;
		this.isNew = false;
	}
}

NewSteepingAssistant.prototype.setup = function() 
{
	this.controller.setupWidget("minPicker",
		{
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
		{
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
		{
			label: 'temp',
        	modelProperty: 'value',
        	labelPlacement: Mojo.Widget.labelPlacementLeft,
        	min: 150,
        	max: 212
    	},
    	this.tempModel = {
        	value: this.steeping.temp
    	}
	); 
	    

	this.controller.setupWidget(Mojo.Menu.commandMenu, 
		undefined, 
		this.cmdMenuModel = {
    		visible: this.isNew,
    		items: [
        		{ items:[{ label:$L('Done'), command:'done' }] }
    		]
		}
	);
};

NewSteepingAssistant.prototype.updateMin = function(event) 
{
	this.min = event.value;
	this.steeping.setTime(this.sec + 60*this.min);
};
NewSteepingAssistant.prototype.updateSec = function(event) 
{
	this.sec = event.value;
	this.steeping.setTime(this.sec + 60*this.min);
	
};
NewSteepingAssistant.prototype.updateTemp = function(event) 
{
	this.steeping.setTemp(event.value);
}

NewSteepingAssistant.prototype.handleCommand = function(event) 
{
	if(event.type == Mojo.Event.command)
    {
        switch(event.command) 
        {
            case 'done':
            	this.result = { kind:"new", steeping:this.steeping };
				Mojo.Controller.stageController.popScenesTo("new-tea", this.result);
                break;
        }
    }
};

NewSteepingAssistant.prototype.activate = function(event) 
{
	this.updateMinHandler = this.updateMin.bindAsEventListener(this); 
	this.controller.listen(this.controller.get("minPicker"), Mojo.Event.propertyChange, this.updateMinHandler); 
	
	this.updateSecHandler = this.updateSec.bindAsEventListener(this); 
	this.controller.listen(this.controller.get("secPicker"), Mojo.Event.propertyChange, this.updateSecHandler); 
	
	this.updateTempHandler = this.updateTemp.bindAsEventListener(this); 
	this.controller.listen(this.controller.get("tempPicker"), Mojo.Event.propertyChange, this.updateTempHandler); 
};

NewSteepingAssistant.prototype.deactivate = function(event) 
{
	this.controller.stopListening("minPicker", Mojo.Event.propertyChange, this.updateMinHandler);
	this.controller.stopListening("secPicker", Mojo.Event.propertyChange, this.updateSecHandler);
	this.controller.stopListening("tempPicker", Mojo.Event.propertyChange, this.updateTempHandler);
};

NewSteepingAssistant.prototype.cleanup = function(event) 
{
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
