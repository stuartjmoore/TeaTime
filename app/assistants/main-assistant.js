
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
	
	this.teaModel.items.sort(function(a,b) { return a.group < b.group ? -1 : (a.group > b.group ? 1 : 0); });
	
	for(var i = 0; i < this.teaModel.items.length; i++)
	{	
	    this.teaModel.items[i].min = this.teaModel.items[i].steepings[this.teaModel.items[i].steeped].min;
	    this.teaModel.items[i].temp = this.teaModel.items[i].steepings[this.teaModel.items[i].steeped].temp;
	
	    if(this.teaModel.items[i].steepings[this.teaModel.items[i].steeped].sec < 10)
	    	this.teaModel.items[i].secLabel = '0' + this.teaModel.items[i].steepings[this.teaModel.items[i].steeped].sec;
	    else
	    	this.teaModel.items[i].secLabel = this.teaModel.items[i].steepings[this.teaModel.items[i].steeped].sec;
	    	
	    if(this.teaModel.items[i].steeped > 1)
	    	this.teaModel.items[i].steepedLabel = " - " + this.teaModel.items[i].steeped + " steepings";
	    else if(this.teaModel.items[i].steeped == 1)
	    	this.teaModel.items[i].steepedLabel = " - 1 steeping";
	    else
	    	this.teaModel.items[i].steepedLabel = "";
	}
	
	this.controller.modelChanged(this.teaModel);
};
  
MainAssistant.prototype.dbFailed = function(transaction, result)
{
	Mojo.Controller.errorDialog("Database failed.");
};  
MainAssistant.prototype.dbSuccess = function()
{
	//Mojo.Controller.errorDialog("Database success.");
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
			Mojo.Controller.getAppController().playSoundNotification("vibrate", "");
			Mojo.Controller.getAppController().playSoundNotification("vibrate", "");
			//this.controller.stageController.deactivate();
		}
		if(event == "timer reset")
		{
		}
		else
		{
			if(event.kind == "new")
				this.teaModel.items.push(event.tea);
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
			
			this.teaModel.items.sort(function(a,b) { return a.group < b.group ? -1 : (a.group > b.group ? 1 : 0); });
		}
		
		this.db.add("teas", this.teaModel.items, this.dbSuccess.bind(this), this.dbFailed.bind(this));
	}
	
	for(var i = 0; i < this.teaModel.items.length; i++)
	{	
	    this.teaModel.items[i].min = this.teaModel.items[i].steepings[this.teaModel.items[i].steeped].min;
	    this.teaModel.items[i].temp = this.teaModel.items[i].steepings[this.teaModel.items[i].steeped].temp;
	
	    if(this.teaModel.items[i].steepings[this.teaModel.items[i].steeped].sec < 10)
	    	this.teaModel.items[i].secLabel = '0' + this.teaModel.items[i].steepings[this.teaModel.items[i].steeped].sec;
	    else
	    	this.teaModel.items[i].secLabel = this.teaModel.items[i].steepings[this.teaModel.items[i].steeped].sec;
	    	
	    if(this.teaModel.items[i].steeped > 1)
	    	this.teaModel.items[i].steepedLabel = " - " + this.teaModel.items[i].steeped + " steepings";
	    else if(this.teaModel.items[i].steeped == 1)
	    	this.teaModel.items[i].steepedLabel = " - 1 steeping";
	    else
	    	this.teaModel.items[i].steepedLabel = "";
	}
	
	this.controller.modelChanged(this.teaModel);


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
