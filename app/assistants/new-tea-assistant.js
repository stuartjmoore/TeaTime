
function NewTeaAssistant(tea) 
{
	if(!tea)
	{
        this.tea = new Tea();
		this.isNew = true;
	}
	else
	{
		this.tea = tea;
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
		}, 
		this.nameModel = {
			value : this.tea.title
		}
	);
	
	this.controller.get('teaType').innerHTML = this.tea.group;
	

	this.controller.setupWidget("steeping-list",
		{  
        	listTemplate: "new-tea/steeping-list-temp",
			itemTemplate: "new-tea/steeping-row-temp", 
        	addItemLabel: "New Steeping...",
			swipeToDelete: true,
			reorderable: true,
			renderLimit: 20
		},
		this.steepingModel = {
			listTitle : $L("Steepings"), 
			items : this.tea.steepings 
		}
	);  
	
	
	/*this.controller.setupWidget("teaNotes",
		{
            hintText: 'Notes',
            multiline: true
		},
		this.notesModel = {
			value: this.tea.notes
		}
    );*/
    

	this.controller.setupWidget(Mojo.Menu.appMenu, 
		{}, 
		this.appMenuModel = {
    		items: [
       			{label: "Delete Tea", command: 'delete-tea', disabled: this.isNew}
    		]
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

NewTeaAssistant.prototype.typeSelector = function(event) 
{
	this.controller.popupSubmenu(
	{
		onChoose: this.updateType,
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

NewTeaAssistant.prototype.updateType = function(command) 
{
	if(command)
	{
		$("teaType").innerHTML = command;
		this.tea.group = command;
	}
};

NewTeaAssistant.prototype.updateTitle = function(event)
{	
	this.tea.title = event.value;
}


NewTeaAssistant.prototype.newSteeping = function(event) 
{
	Mojo.Controller.stageController.pushScene("new-steeping");  
};
NewTeaAssistant.prototype.reorderSteeping = function(event) 
{
	temp = this.tea.steepings[event.fromIndex];
	this.tea.steepings.splice(event.fromIndex, 1);
	this.tea.steepings.splice(event.toIndex, 0, temp);
};
NewTeaAssistant.prototype.deleteSteeping = function(event) 
{
	this.tea.steepings.splice(event.index, 1);
};
NewTeaAssistant.prototype.editSteeping = function(event) 
{
	Mojo.Controller.stageController.pushScene("new-steeping", event.item); 
};


NewTeaAssistant.prototype.deleteTea = function(event) 
{
	if(event == "delete")
	{
        this.result = { kind:"delete", tea:this.tea };
		Mojo.Controller.stageController.popScenesTo("main", this.result);
	}
};

NewTeaAssistant.prototype.handleCommand = function(event) 
{
    if(event.type == Mojo.Event.command) 
    {
        switch(event.command) 
        {
            case 'done':
            	if(!this.tea.title)
            	{
            		Mojo.Controller.errorDialog("Your tea needs a name!");
            		break;
            	}
            	if(this.tea.group == 'type' || !this.tea.group)
            	{
            		Mojo.Controller.errorDialog("Your tea needs a type!");
            		break;
            	}
            	if(this.tea.steepings.length == 0)
            	{
            		Mojo.Controller.errorDialog("Your tea needs some steepings!");
            		break;
            	}
            	
            	this.tea.setTimeLabel();
            	this.tea.setTempLabel();
				this.tea.setSteepingLabel();
				
            	this.result = { kind:"new", tea:this.tea };
				Mojo.Controller.stageController.popScenesTo("main", this.result);
					
                break;
        	case 'delete-tea':
				this.controller.showAlertDialog({
			    	onChoose: this.deleteTea.bindAsEventListener(this),
			    	title: $L("Delete?"),
			    	message: $L("Are you sure you want to delete this tea?"),
			    	choices:[
			    	    { label:$L("Delete Tea"), value:"delete", type:"negative" },    
			    	    { label:$L("Cancel"), value:"cancel", type:"dismiss" }    
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
			this.tea.steepings.push(event.steeping);
	}
	
	this.tea.setTimeLabel();
	this.tea.setTempLabel();
	this.tea.setSteepingLabel();
	
	this.controller.modelChanged(this.steepingModel);
	
	
	
	this.updateTitleHandler = this.updateTitle.bindAsEventListener(this); 
	Mojo.Event.listen(this.controller.get("teaName"), Mojo.Event.propertyChange, this.updateTitleHandler);
	
		
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
	this.controller.stopListening("teaName", Mojo.Event.propertyChange, this.updateTitleHandler);

	this.controller.get('tea-type-button').stopObserving(Mojo.Event.tap, this.typeSelectorHandler);
	
	this.controller.get('steeping-list').stopObserving(Mojo.Event.listAdd, this.newSteepingHandler);
	this.controller.get('steeping-list').stopObserving(Mojo.Event.listDelete, this.deleteSteepingHandler);
	this.controller.get('steeping-list').stopObserving(Mojo.Event.listReorder, this.reorderSteepingHandler);
	this.controller.get('steeping-list').stopObserving(Mojo.Event.listTap, this.editSteepingHandler);
};

NewTeaAssistant.prototype.cleanup = function(event) 
{
};
