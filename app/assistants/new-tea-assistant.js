function NewTeaAssistant(tea) 
{
	if(!tea)
	{
        this.tea = {};
		this.title = '';
		this.group = 'type';
		this.notes = '';
		this.steepings = [];	
		this.steeped = 0;
		this.isNew = true;
	}
	else
	{
		this.tea = tea;
		this.title = tea.title;
		this.group = tea.group;
		this.notes = '';
		this.steepings = tea.steepings;	
		this.steeped = tea.steeped;
		this.isNew = false;
	}
}

NewTeaAssistant.prototype.setup = function()
{	
	this.controller.setupWidget("teaName", 
	{
		hintText : 'Name',
		autoFocus: true,
		autoReplace: true,
		textCase: Mojo.Widget.steModeTitleCase,
    	multiline: false,
    	enterSubmits: true
	}, this.nameModel = { value : this.title });
	
	
	this.controller.get('teaType').innerHTML = this.group;
	
	
	this.controller.get('steepings-list').innerHTML = "";
	
	for(var i = 0; i < this.steepings.length; i++)
	{
	    if(this.steepings[i].sec < 10)
			secLabel = '0' + this.steepings[i].sec;
		else
			secLabel = this.steepings[i].sec;
		
		this.controller.get('steepings-list').innerHTML += "<div class='palm-row' id='steeping-"+ i +"' x-mojo-touch-feedback='momentary'> <div class='palm-row-wrapper'> <div class='icon left teaIcon'></div> <div class='label'></div> <div class='title'>" + this.steepings[i].min + ":" + secLabel + " <span style='color:#666;'>@</span> " + this.steepings[i].temp + "&deg;F</div> </div> </div>";
	}
	
	this.controller.get('steepings-list').innerHTML += "<div class='palm-row last  add-item' id='new-steeping' x-mojo-touch-feedback='momentary'> <div class='palm-row-wrapper'> <div name='palm-add-item' class='list-item-add-button'> </div> <div name='palm-add-item' class='title' x-mojo-loc=''> New Steeping... </div> </div> </div>";
	
	this.controller.setupWidget("teaNotes",
        this.attributes = {
            hintText: 'Notes',
            multiline: true
         },
         this.notesModel = {
             value: this.notes
         }
    ); 
    
    this.appMenuModel = {
    	items: [
       		{label: "Delete Tea", command: 'delete-tea', disabled: this.isNew}
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

NewTeaAssistant.prototype.typeSelector = function(event) 
{
	this.controller.popupSubmenu(
	{
		onChoose: this.popupChoose,
		placeNear: event.target,
		items:[
            { label : 'Black', command: 'black' },
            { label : 'Green', command: 'green' },
            { label : 'White', command: 'white' },
            { label : 'Oolong', command: 'oolong' },
            { label : 'Roobios', command: 'roobios' },
            { label : 'Herbal', command: 'herbal' },
            { label : 'Mate', command: 'mate' }
		]
	});
};

NewTeaAssistant.prototype.popupChoose = function(command) 
{
	$('teaType').innerHTML = command;
	this.group = command;
};


NewTeaAssistant.prototype.newSteeping = function(event) 
{
	Mojo.Controller.stageController.pushScene("new-steeping");  
};

NewTeaAssistant.prototype.editSteeping = function(event, i) 
{
	Mojo.Controller.stageController.pushScene("new-steeping", this.steepings[i]); 
};


NewTeaAssistant.prototype.deleteTea = function(event) 
{
	if(event == "delete")
	{
        this.result = {kind:"delete", tea:this.tea};
		Mojo.Controller.stageController.popScenesTo("main", this.result);
	}
};

NewTeaAssistant.prototype.handleCommand = function(event) 
{
	this.title = this.nameModel.value;

    if(event.type == Mojo.Event.command) 
    {
        switch(event.command) 
        {
            case 'done':
            	if(!this.title)
            	{
            		Mojo.Controller.errorDialog("Your tea needs a name!");
            		break;
            	}
            	if(this.group == 'type' || !this.group)
            	{
            		Mojo.Controller.errorDialog("Your tea needs a type!");
            		break;
            	}
            	if(this.steepings.length == 0)
            	{
            		Mojo.Controller.errorDialog("Your tea needs some steepings!");
            		break;
            	}
            	
            	if(!this.tea.title)
            		this.kind = "new";
            	else
            		this.kind = "replace";
            	
				this.tea.title = this.title;
				this.tea.group = this.group;
				this.tea.steeped = this.steeped;
				this.tea.steepings = this.steepings;
				
            	this.result = {kind:this.kind, tea:this.tea};
			
				Mojo.Controller.stageController.popScenesTo("main", this.result);
					
                break;
			case 'delete-tea':
				this.controller.showAlertDialog({
    				onChoose: this.deleteTea.bindAsEventListener(this),
    				title: $L("Delete?"),
    				message: $L("Are you sure you want to delete this tea?"),
    				choices:[
    				    {label:$L("Delete Tea"), value:"delete", type:'negative'},    
    				    {label:$L("Cancel"), value:"cancel", type:'dismiss'}    
    				]
				}); 			
				break;
        }
    }
}; 

NewTeaAssistant.prototype.activate = function(event) 
{
	if(event)
	{
		if(event.kind == "new")
			this.steepings.push({ min : event.steeping.min, sec: event.steeping.sec, temp: event.steeping.temp });
		else if(event.kind == "delete")
		{
		    for(var i = 0; i < this.steepings.length; i++) 
		    {
            	if(this.steepings[i] == event.steeping) 
            	{
		    		this.steepings.splice(i, 1);
        			break;
		    	}
		    }
		}

		this.controller.get('steepings-list').innerHTML = "";
	
		for(var i = 0; i < this.steepings.length; i++)
		{
	    	if(this.steepings[i].sec < 10)
				secLabel = '0' + this.steepings[i].sec;
			else
				secLabel = this.steepings[i].sec;
		
			this.controller.get('steepings-list').innerHTML += "<div class='palm-row' id='steeping-"+i+"' x-mojo-touch-feedback='momentary'> <div class='palm-row-wrapper'> <div class='icon left teaIcon'></div> <div class='label'></div> <div class='title'>" + this.steepings[i].min + ":" + secLabel + " <span style='color:#666;'>@</span> " + this.steepings[i].temp + "&deg;F</div> </div> </div>";
		}
	
		this.controller.get('steepings-list').innerHTML += "<div class='palm-row last  add-item' id='new-steeping' x-mojo-touch-feedback='momentary'> <div class='palm-row-wrapper'> <div name='palm-add-item' class='list-item-add-button'> </div> <div name='palm-add-item' class='title' x-mojo-loc=''> New Steeping... </div> </div> </div>";
	}
			
	for(var i = 0; i < this.steepings.length; i++)
	{
		this.editSteepingHandler = this.editSteeping.bindAsEventListener(this, i);
		var id = "steeping-" + i;
		this.controller.get(id).observe(Mojo.Event.tap, this.editSteepingHandler );
	}
		
	this.typeSelectorHandler = this.typeSelector.bindAsEventListener(this);
	this.controller.get('tea-type-button').observe(Mojo.Event.tap, this.typeSelectorHandler );
	
	this.newSteepingHandler = this.newSteeping.bindAsEventListener(this);
	this.controller.get('new-steeping').observe(Mojo.Event.tap, this.newSteepingHandler );
};

NewTeaAssistant.prototype.deactivate = function(event) 
{
	this.controller.get('tea-type-button').stopObserving(Mojo.Event.tap, this.typeSelectorHandler);
	this.controller.get('new-steeping').stopObserving(Mojo.Event.tap, this.newSteepingHandler);
	
	for(var i = 0; i < this.steepings.length; i++)
	{
		var id = 'steeping-' + i;
		this.controller.get(id).stopObserving(Mojo.Event.tap, this.editSteepingHandler);
	}
};

NewTeaAssistant.prototype.cleanup = function(event) 
{
};
