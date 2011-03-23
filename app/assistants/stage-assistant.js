db = {};
TeaTypes = [
            { id: 0, label: 'Black', command: 'black' },
            { id: 1, label: 'Green', command: 'green' },
            { id: 2, label: 'White', command: 'white' },
            { id: 3, label: 'Oolong', command: 'oolong' },
            { id: 4, label: 'Roobios', command: 'roobios' },
            { id: 5, label: 'Herbal', command: 'herbal' },
            { id: 6, label: 'Mate', command: 'mate' }
		   ];
TempType = "fahrenheit";


function StageAssistant() 
{
}

StageAssistant.prototype.setup = function() 
{
	db = new Mojo.Depot({ name:"teaList", version:1, replace:false }, this.dbOpened.bind(this), this.dbFailed.bind(this));
};

StageAssistant.prototype.dbOpened = function()
{
	db.get("types", this.dbTypesGot.bind(this), this.dbFailed.bind(this));
};

StageAssistant.prototype.dbTypesGot = function(types)
{
	if(types)
		TeaTypes = types;
	
	Mojo.Controller.stageController.pushScene("main");
};

StageAssistant.prototype.dbFailed = function(transaction, result)
{
	Mojo.Controller.errorDialog("Database failed.");
};