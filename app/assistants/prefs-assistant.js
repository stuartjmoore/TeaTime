function PrefsAssistant() 
{
}

PrefsAssistant.prototype.setup = function() 
{
	this.controller.setupWidget("toggleTemp",
	    {
	        trueValue: "fahrenheit",
	        trueLabel: "Fahrenheit",
	        falseValue: "celsius",
	        falseLabel: "Celsius"
	    },
	    this.toggleModel = {
	        value: "fahrenheit",
	        disabled: false
	    }
	);
	
	this.controller.setupWidget("types-list",
		{  
        	listTemplate: "prefs/types-list-temp",
			itemTemplate: "prefs/types-row-temp", 
        	addItemLabel: "New Type...",
			swipeToDelete: true,
			reorderable: false,
			renderLimit: 20
		},
		this.typesModel = {
			listTitle : $L("Types"), 
			items : TeaTypes 
		}
	);

	this.typesNameModel = [];
	
	for(var i = 0; i < TeaTypes.length; i++)
	{
		this.typesNameModel.push({ value : TeaTypes[i].label });
		
		this.controller.setupWidget("type-" + TeaTypes[i].id, 
			{
				hintText : "Name",
				autoReplace: false,
				textCase: Mojo.Widget.steModeTitleCase,
	    		multiline: false,
	    		enterSubmits: true
			}, 
			this.typesNameModel[i]
		);
	}
	
};

PrefsAssistant.prototype.updateType = function(event, i) 
{		
	TeaTypes[i].label = event.value;
	TeaTypes[i].command = event.value.toLowerCase();
	
	db.add("types", TeaTypes, function(){}, function(){Mojo.Log.info("Prefs DB failure");});
};

PrefsAssistant.prototype.newType = function(event) 
{
	TeaTypes.push({ id:TeaTypes.length, label:"", command:""});
	this.typesNameModel.push({ value : "" });
	
	
	this.controller.setupWidget("type-" + TeaTypes[TeaTypes.length-1].id, 
		{
			hintText : "Name",
			autoReplace: false,
			textCase: Mojo.Widget.steModeTitleCase,
	   		multiline: false,
	   		enterSubmits: true
		}, 
		this.typesNameModel[TeaTypes.length-1]
	);
	
	
	this.controller.modelChanged(this.typesModel);

	for(var i = 0; i < TeaTypes.length; i++)
	{
		this.controller.setWidgetModel("type-" + TeaTypes[i].id, this.typesNameModel[i]);
		
		this.updateTypeHandler = this.updateType.bindAsEventListener(this, i); 
		this.controller.get("type-" + TeaTypes[i].id).observe(Mojo.Event.propertyChange, this.updateTypeHandler);
	}
};

PrefsAssistant.prototype.deleteType = function(event) 
{
	TeaTypes.splice(event.index, 1);
	db.add("types", TeaTypes, function(){}, function(){Mojo.Log.info("Prefs DB failure");});
};

PrefsAssistant.prototype.activate = function(event) 
{
	for(var i = 0; i < TeaTypes.length; i++)
	{
		this.controller.setWidgetModel("type-" + TeaTypes[i].id, this.typesNameModel[i]);
		
		this.updateTypeHandler = this.updateType.bindAsEventListener(this, i); 
		this.controller.get("type-" + TeaTypes[i].id).observe(Mojo.Event.propertyChange, this.updateTypeHandler);
	}
	
	this.newTypeHandler = this.newType.bindAsEventListener(this);
	this.controller.get('types-list').observe(Mojo.Event.listAdd, this.newTypeHandler);
	this.deleteTypeHandler = this.deleteType.bindAsEventListener(this);
	this.controller.get('types-list').observe(Mojo.Event.listDelete, this.deleteTypeHandler);
};

PrefsAssistant.prototype.deactivate = function(event) 
{
	for(var i = 0; i < TeaTypes.length; i++)
		this.controller.get("type-" + TeaTypes[i].id).stopObserving(Mojo.Event.propertyChange, this.updateTypeHandler);
	
	this.controller.get('types-list').stopObserving(Mojo.Event.listAdd, this.newTypeHandler);
	this.controller.get('types-list').stopObserving(Mojo.Event.listDelete, this.deleteTypeHandler);
};

PrefsAssistant.prototype.cleanup = function(event) 
{
};
