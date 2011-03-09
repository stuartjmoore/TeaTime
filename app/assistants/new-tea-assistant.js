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
	
	
	this.steepingAttr = {  
        listTemplate: "new-tea/steeping-list-temp",
		itemTemplate: "new-tea/steeping-row-temp", 
        addItemLabel: "New Steeping...",
		swipeToDelete: true,
		reorderable: true,
		renderLimit: 20
	};  
	this.steepingModel = { listTitle : $L("Steepings"), items : this.steepings };
	this.controller.setupWidget("steeping-list", this.steepingAttr, this.steepingModel);  
	
	
	this.controller.setupWidget("teaNotes",
		{
            hintText: 'Notes',
            multiline: true
		},
		this.notesModel = {
			value: this.notes
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

NewTeaAssistant.prototype.reorderSteeping = function(event) 
{
	temp = this.steepings[event.fromIndex];
	this.steepings.splice(event.fromIndex, 1);
	this.steepings.splice(event.toIndex, 0, temp);
};

NewTeaAssistant.prototype.deleteSteeping = function(event) 
{
	this.steepings.splice(event.index, 1);
};

NewTeaAssistant.prototype.editSteeping = function(event) 
{
	Mojo.Controller.stageController.pushScene("new-steeping", event.item); 
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
        }
    }
}; 

NewTeaAssistant.prototype.activate = function(event) 
{
	if(event)
	{
		if(event.kind == "new")
		{
			if(event.steeping.sec < 10)
	    		secLabel = '0' + event.steeping.sec;
	   		else
	    		secLabel = event.steeping.sec;
	    	
			this.steepings.push({ min : event.steeping.min, sec: event.steeping.sec, temp: event.steeping.temp });
		}
		
		//this needs to change
		for(var i = 0; i < this.steepingModel.items.length; i++)
		{	
			if(this.steepingModel.items[i].sec < 10)
	    		this.steepingModel.items[i].secLabel = '0' + this.steepingModel.items[i].sec;
	    	else
	    		this.steepingModel.items[i].secLabel = this.steepingModel.items[i].sec;
		}
		
		this.controller.modelChanged(this.steepingModel);
	}
			
		
	this.typeSelectorHandler = this.typeSelector.bindAsEventListener(this);
	this.controller.get('tea-type-button').observe(Mojo.Event.tap, this.typeSelectorHandler );
	
	this.newSteepingHandler = this.newSteeping.bindAsEventListener(this);
	this.controller.get('steeping-list').observe(Mojo.Event.listAdd, this.newSteepingHandler );
	
	this.deleteSteepingHandler = this.deleteSteeping.bindAsEventListener(this);
	this.controller.get('steeping-list').observe(Mojo.Event.listDelete, this.deleteSteepingHandler );
	
	this.reorderSteepingHandler = this.reorderSteeping.bindAsEventListener(this);
	this.controller.get('steeping-list').observe(Mojo.Event.listReorder, this.reorderSteepingHandler );
	
	this.editSteepingHandler = this.editSteeping.bindAsEventListener(this);
	this.controller.get('steeping-list').observe(Mojo.Event.listTap, this.editSteepingHandler );
};

NewTeaAssistant.prototype.deactivate = function(event) 
{
	this.controller.get('tea-type-button').stopObserving(Mojo.Event.tap, this.typeSelectorHandler);
	
	this.controller.get('steeping-list').stopObserving(Mojo.Event.listAdd, this.newSteepingHandler);
	
	this.controller.get('steeping-list').stopObserving(Mojo.Event.listDelete, this.deleteSteepingHandler);
	
	this.controller.get('steeping-list').stopObserving(Mojo.Event.listReorder, this.reorderSteepingHandler);
	
	this.controller.get('steeping-list').stopObserving(Mojo.Event.listTap, this.editSteepingHandler);
};

NewTeaAssistant.prototype.cleanup = function(event) 
{
};
