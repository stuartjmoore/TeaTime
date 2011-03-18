
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
        Mojo.Log.info("Updating database times.");
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
		this.teaModel.items.sort(function(a,b){ a = a.group+a.title; b = b.group+b.title; return a==b ? 0 : (a < b ? -1 : 1) });
		this.db.add("teas", this.teaModel.items, this.dbSuccess.bind(this), this.dbFailed.bind(this));
	}
	
	if(this.teaModel.items.length > 0 && this.teaModel.items[0].class != "Tea") // Update db to Tea model.
	{
        Mojo.Log.info("Updating database tea models.");
		for(var i = 0; i < this.teaModel.items.length; i++)
		{ 
			this.teaModel.items[i] = new Tea(this.teaModel.items[i].title, 
											 this.teaModel.items[i].group, 
											 this.teaModel.items[i].notes, 
											 this.teaModel.items[i].steepings, 
											 this.teaModel.items[i].steeped, 
											 this.teaModel.items[i].timeLabel, 
											 this.teaModel.items[i].tempLabel, 
											 this.teaModel.items[i].steepingsLabel);
		}
		this.teaModel.items.sort(function(a,b){ a = a.group+a.title; b = b.group+b.title; return a==b ? 0 : (a < b ? -1 : 1) });
		this.db.add("teas", this.teaModel.items, this.dbSuccess.bind(this), this.dbFailed.bind(this));
	}
	
	if(this.teaModel.items.length > 0 && this.teaModel.items[0].steepings[0].class != "Steeping") // Update db to Steeping model.
	{
        Mojo.Log.info("Updating database steeping models.");
		for(var i = 0; i < this.teaModel.items.length; i++)
		{ 
			for(var j = 0; j < this.teaModel.items.steepings.length; j++)
			{
				this.teaModel.items[i].steepings[j] = new Steeping(this.teaModel.items[i].steepings[j].time,
																   this.teaModel.items[i].steepings[j].temp,
																   this.teaModel.items[i].steepings[j].timeLabel,
																   this.teaModel.items[i].steepings[j].tempLabel);
			}
		}
		this.teaModel.items.sort(function(a,b){ a = a.group+a.title; b = b.group+b.title; return a==b ? 0 : (a < b ? -1 : 1) });
		this.db.add("teas", this.teaModel.items, this.dbSuccess.bind(this), this.dbFailed.bind(this));
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
				added = false;
				for(var i = 0; i < this.teaModel.items.length; i++) 
				{
        			if(this.teaModel.items[i].group+this.teaModel.items[i].title > event.tea.group+event.tea.title) 
        			{
						this.teaModel.items.splice(i, 0, event.tea);
						added = true;
            			break;
					}
				}
				if(!added)
					this.teaModel.items.push(event.tea);
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
		
	}
	this.controller.modelChanged(this.teaModel);
	
	if(this.teaModel.items.length > 0)
		this.db.add("teas", this.teaModel.items, this.dbSuccess.bind(this), this.dbFailed.bind(this));


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
