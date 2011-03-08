
function NewSteepingAssistant(steeping) 
{
	if(steeping)
	{
		this.steeping = steeping;	
		this.min = steeping.min;
		this.sec = steeping.sec;
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
	
	
    this.appMenuModel = {
    	items: [
       		{label: "Delete Steeping", command: 'delete-steeping', disabled: this.isNew}
    	]
	};
	this.controller.setupWidget(Mojo.Menu.appMenu, {}, this.appMenuModel); 
    
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
            	if(!this.steeping.min)
            		this.kind = "new";
            	else
            		this.kind = "replace";
            		
				this.steeping.min = this.min;
				this.steeping.sec = this.sec;
				this.steeping.temp = this.temp;
				
            	this.result = {kind:this.kind, steeping:this.steeping};
				
				Mojo.Controller.stageController.popScenesTo("new-tea", this.result);
                break;
        	case 'delete-steeping':
				this.controller.showAlertDialog({
			    	onChoose: this.deleteSteeping.bindAsEventListener(this),
			    	title: $L("Delete?"),
			    	message: $L("Are you sure you want to delete this steeping?"),
			    	choices:[
			    	    {label:$L("Delete Steeping"), value:"delete", type:'negative'},    
			    	    {label:$L("Cancel"), value:"cancel", type:'dismiss'}    
			    	]
				}); 
        		break;
        }
    }
};

NewSteepingAssistant.prototype.deleteSteeping = function(event) 
{
	if(event == "delete")
	{
        this.result = {kind:"delete", steeping:this.steeping};
		Mojo.Controller.stageController.popScenesTo("new-tea", this.result);
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
