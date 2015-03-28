"strict mode";

var MenuItemGroup = function(name,exclusive){
	if(_.isUndefined(exclusive))
		exclusive = false;
	if(_.isUndefined(name))
		name = "main";
};

var MenuItem = AWModel.extend({
	className: 'MenuItem',
	defaults: {
		selectable: true,
		selected: false,
		action: null,
		value: 1,
		dispayValue: this.value,
		divider: false,
		group: null
	},
	initialize: function(o) {
		
	}
});

var MenuList = AWCollection.extend({
	className: 'MenuCollection',
	model: MenuItem
});

var MenuListModel = AWCollectionModel.extend({
	className: 'MenuListModel',
	collection: MenuList
});


var MenuView = AWView.extend({
	initialize: function() {
		this.compiledTemplate = Mustache.compile(this.template); //this could be in awview base
		//var elTest = $(Mustache.render('#{{.}}',this.idPrefix() + this.id()));
		//if (_.isElement(elTest[0])) {
		//	this.el = elTest[0];
		//	this.$el = elTest;
		//} // could also be in base
		var that = this;	
		that.views = []; ///CAN'T FIGURE OUT WHY THIS IS BEING PERSISTED FROM BASE
		this.model._collection.forEach(function(mod) {
			that.views.push(new MenuItemView({'model':mod, 'parentView':that}));
		});	
	},
	id: "",
	tagName: 'ul',
	idPrefix: function() {
		return "menu-";
	}, 
	views: [],
	className: function() {
		return "ctrls dropdown-menu";
	},
	after: 'rand_ctrl',
	events: {'click' : "handleMainClick"
	}, 
	handleMainClick: function() {
		/*called when the UL is clicked. OK 
		alert("handleMainClick called in MenuView")*/
	},
	render: function() {
		var oData = {
				id: this.id,
				className: this.className(),
				html: [],
				tagName: this.tagName
			};
		var menuView = this;
		
		_.forEach(this.views, function(view) {
			var viewEl = view.render().el;
			menuView.$el.append(viewEl);
			//oData.html.push(view.render());
		});
		
		//var rendered = this.compiledTemplate(oData);
		//this.$el.html(rendered);
		this.$el.attr("class",this.className());
		this.$el.attr("id", this.id);
		return this;
		
	},
	template: 	"\
					{{#html}}\
						{{{.}}}\
					{{/html}}\
				"
});


var MenuItemView = AWView.extend({	  
	initialize: function(oData) {				
		this.compiledTemplate = Mustache.compile(this.template); //this could be in awview base
		this.parentView = oData.parentView;
		/*var elTest = $(Mustache.render('#{{.}}',this.idPrefix() + this.id()));
		if (_.isElement(elTest[0])) {
			this.el = elTest[0];
			this.$el = elTest;
		} */// could also be in base
		//this.el = "#" + this.id;
		
	},
	tagName: 'li',
	className: function() {
		var className = '';
		var classes = [];
		if (this.model.get('active')) {
			classes.push('active');
		}
		if (this.model.get('selected')) {
			classes.push('selected');
		}
		
		var sClasses = classes.join(' ');
		return sClasses;
	},
	events: {
		"click" : "handleclick"
	},
	handleclick: function(e){
		//alert("menu item view call handleclick");
		
		if (this.model.get('selectable')) {
			this.model.toggle('selected');
			this.model.toggle('active');
			console.log("model selected toggled");
		}
		var actionName = this.model.get('action');
		var action = this.model.get(actionName);
		if (action)
			action.call(e);
		
		e.stopPropagation();	
		this.render();
		
	},
	render: function() {						
			////suit offsuit pPair
			var oData = this.renderData();	
			var output;
			if (this.model.get('divider')) {
				this.$el.addClass("divider");
				return this;
			}
				
			output = this.compiledTemplate(oData);//Mustache.render(this.template, oData);
			this.$el.html(output);			
			this.$el.attr('class',oData.class);
			
			return this; 
	},
	idPrefix: function() {
		return this.parentView.id + '_';
	},
	id: "",
	icon: function() {
		var iconClass = null;
		if (this.model.get('active')) {
			iconClass = 'glyphicon-ok';
		}
		else if(this.model.get('action')!==null) {
			iconClass = 'glyphicon-cog';			
		}
		if (iconClass)
			return Mustache.render(this.iconTemplate,{iconClass: iconClass});
		else
			return '';
	},
	iconTemplate: '<span class="glyphicon {{{iconClass}}}"></span>',
	renderData: function() {
		return 	{
			'class': this.className(),
			'id': this.id,
			'id_prefix': this.idPrefix(),
			'displayValue': this.model.get('displayValue'),
			'icon': this.icon()
		};
	},
	template: 	"<a>{{{displayValue}}}{{{icon}}}</a>" 
});




$(function() {
	
/*	var loggingMenu = new MenuListModel([
			{value:"A", displayValue:"FlopYoMama.js", group: standardGroup},
			{value:"B", displayValue:"RangeTable.js", group: standardGroup},
			{value:"C", displayValue:"Slider.js", group: standardGroup},
			{value:"D", displayValue:"Range.js", group: standardGroup}		
		]
	);

	var loggingModelView = new MenuView({model:loggingMenu});
*/
	//loggingModelView.after = "rand_ctrl";


	var standardGroup = new MenuItemGroup();
	var rangeMenuActionGroup = new MenuItemGroup('clearboard',false);	
	var randomMenu = new MenuListModel([
			{id:"hand", value:"random_hand", displayValue:"Hand",
				group: standardGroup, active: true},
			{divider: true},
			{id:"flop", value:"random_flop", displayValue:"Flop",
				group: standardGroup, active: true},
			{id:"turn", value:"random_turn", displayValue:"Turn", group: standardGroup},
			{id:"river", value:"random_river", displayValue:"River", group: standardGroup},
			{divider: true},
			{value:"clear_board", displayValue:"Clear Board", 
				group: rangeMenuActionGroup, 
				action:'clearBoard',
				clearBoard: function(e) {
					nsUI.fDeleteBoard();
				},
				selectable: false
			}
		]
	);
	randomMenu.set("id","random_menu"); 

	var randomModelView = new MenuView({model:randomMenu,id: "random_menu" });
	/*for (var i=0;i<randomModelView.views.length;i++)  {
		randomModelView.views[i].el = "body";
	}*/
    randomModelView.render();
	$("#rand_ctrl").after(randomModelView.el);
	//loggingModelView.render();

	/***********************************    RANDOM     ******************************************************/				
	$('body').on('click touchstart','#rand', function(){
		var aCards = fGetRandomCards(7);
				
		if (randomMenu._collection.get("hand").get("active")) {
			nsUI.fSetBoardCard(aCards.slice(0,2),0);
		}
		
		if (randomMenu._collection.get("flop").get("active")) {
			nsUI.fSetBoardCard(aCards.slice(2,5),2);
		}
		
		if (randomMenu._collection.get("turn").get("active")) {
			nsUI.fSetBoardCard(aCards.slice(5,6),5);
		}
		
		if (randomMenu._collection.get("river").get("active")) {			
			nsUI.fSetBoardCard(aCards.slice(6,7),6);
		}
		
		nsUI.fAfterBoardChange();
	});
	
});
