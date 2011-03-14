
function MainAssistant() 
{
	this.teaModel = {items : []};
	this.db = new Mojo.Depot({name:"teaList", version:1, replace:false}, this.dbOpened.bind(this), this.dbFailed.bind(this));
}

MainAssistant.prototype.setup = function() 
{
	this.listAttr = {  
		itemTemplate: "main/item-template", 
		dividerTemplate: "main/divider-template", 
    	dividerFunction: this.whatPosition, 
		renderLimit: 20,  
	};  
  
	this.controller.setupWidget("tea-list", this.listAttr, this.teaModel);  
	
	
	this.cmdMenuModel = 
	{
    	visible: true,
    	items: 
    	[
        	{ items:[{ label:$L('New'), icon:'new', command:'new' }] }
    	]
	};
 
	this.controller.setupWidget(Mojo.Menu.commandMenu, undefined, this.cmdMenuModel);
};  


MainAssistant.prototype.dbOpened = function()
{
	this.db.get("teas", this.dbTeasGot.bind(this), this.dbFailed.bind(this));
};

MainAssistant.prototype.dbTeasGot = function(teas)
{
	if(teas)
		this.teaModel.items = teas;
	
	if(this.teaModel.items.length > 0 && !this.teaModel.items[0].timeLabel) // Change db.
	{
		for(var i = 0; i < this.teaModel.items.length; i++)
		{ 
		    if(this.teaModel.items[i].steeped > 1)
		    	this.teaModel.items[i].steepingsLabel = " - " + this.teaModel.items[i].steeped + " steepings";
		    else if(this.teaModel.items[i].steeped == 1)
		    	this.teaModel.items[i].steepingsLabel = " - 1 steeping";
		
			for(var j = 0; j < this.teaModel.items[i].steepings.length; j++)
			{
				min = this.teaModel.items[i].steepings[j].min;
				sec = this.teaModel.items[i].steepings[j].sec;
				temp = this.teaModel.items[i].steepings[j].temp;
			
				this.teaModel.items[i].steepings[j].time = sec + 60*min;
				
		   		if(this.teaModel.items[i].steepings[j].sec < 10)
		    		this.teaModel.items[i].steepings[j].timeLabel = min + ":0" + sec;
		    	else
		    		this.teaModel.items[i].steepings[j].timeLabel = min + ":" + sec;
		    		
				this.teaModel.items[i].steepings[j].tempLabel = temp + "&deg;F";
				
				if(j == this.teaModel.items[i].steeped)
				{
		   			if(sec < 10)
		    			this.teaModel.items[i].timeLabel = min + ":0" + sec;
		    		else
		    			this.teaModel.items[i].timeLabel = min + ":" + sec;
		    			
					this.teaModel.items[i].tempLabel = temp + "&deg;F";
				}
			}
		}	
	}
	
	this.controller.modelChanged(this.teaModel);
};
  
MainAssistant.prototype.dbFailed = function(transaction, result)
{
	Mojo.Controller.errorDialog("Database failed.");
};  
MainAssistant.prototype.dbSuccess = function()
{
};  


MainAssistant.prototype.whatPosition = function(listitem)
{ 
    return listitem.group;  
};  
  
MainAssistant.prototype.loadTimer = function(event) 
{
	Mojo.Controller.stageController.pushScene("timer", event.item);  
};

MainAssistant.prototype.handleCommand = function(event) 
{
	if(event.type == Mojo.Event.command) 
	{
		switch(event.command) 
		{
			case 'new':
				Mojo.Controller.stageController.pushScene("new-tea");  
				break;
		}
	}
};

MainAssistant.prototype.activate = function(event) 
{  
	if(event)
	{
		if(event == "timer done")
		{
			Mojo.Controller.getAppController().playSoundNotification("vibrate", "");
			//this.controller.stageController.deactivate();
		}
		if(event == "steepings reset")
		{
		}
		else
		{
			if(event.kind == "new")
			{
				this.teaModel.items.push(event.tea);
				this.teaModel.items.sort(function(a,b){ return a.group < b.group ? -1 : (a.group > b.group ?  1 : 0); });
			}
			else if(event.kind == "delete")
			{
				for(var i = 0; i < this.teaModel.items.length; i++) 
				{
        			if(this.teaModel.items[i] == event.tea) 
        			{
						this.teaModel.items.splice(i, 1);
            			break;
					}
				}
			}
		}
		
		this.controller.modelChanged(this.teaModel);
		this.db.add("teas", this.teaModel.items, this.dbSuccess.bind(this), this.dbFailed.bind(this));
	}

	this.loadTimerHandler = this.loadTimer.bindAsEventListener(this);  
	Mojo.Event.listen(this.controller.get('tea-list'), Mojo.Event.listTap, this.loadTimerHandler);   
};  

MainAssistant.prototype.deactivate = function(event)
{
	Mojo.Event.stopListening(this.controller.get('tea-list'), Mojo.Event.listTap, this.loadTimerHandler); 
};

MainAssistant.prototype.cleanup = function(event) 
{
};
