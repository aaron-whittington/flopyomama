
var RangeItem = AWModel.extend({
	className: 'RangeItem',
	defaults: {
		filter: [],
		selected:false,
		custom:false		
	},
	initialize: function(o) {
		this.set('pair', new Pair(o.pair));
		for(var prop in o.pair) {
			this.set(prop,o.pair[prop]); //especially ranks, for the searches
		}
		this.set('key',this.get('pair').toString());
	},
	safeSetSelected: function(val) {
		if (!this.get('custom')) {
				this.set('selected',val);
		}
	}
});

var RangeItemList = AWCollection.extend({
	className: 'RangeRecordList',
	model: RangeItem
});

var RangeItemListModel = AWCollectionModel.extend({
	className: 'RangeItemListModel',
	collection: RangeItemList
});

var RangeTable = RangeItemList.extend({
	className: 'RangeTable',
	initialize: function() {		
		for (rank1=14; rank1>1;rank1--) {
			for (rank2=14;rank2>1; rank2--){
				var rangeItem = {pair: 
									{rank1: rank1, rank2: rank2, suited: (rank1>rank2) }
								};
				this.add(rangeItem);
			}
		}
		
		this.amChanged = [];
		this.on('change', function(mod) {
			this.amChanged.push(mod);
		});
		
		this.on('finalize',function() {
			this.trigger('updateModels', this.amChanged);
			this.amChanged =[];
		});

	},
	listenToSlider: function(slider) {
		this.listenTo(slider,'change:value',function() {
			this.fSetFromRangeFunction(slider);
		});
		
		this.listenTo(slider,'finalize',function() {
			this.trigger('finalize');
		});
	},
	lastRangeVal:0.0,
	fSetFromRangeFunction: function(slider) {
		var value = slider.get('value');
		var fRange = slider.get('fRangeFunction');
		var aHits = fRange(value/100.0);
		nsUtil.fLog('calling range function');
		//if (this.lastRangeVal > value) {
			//getting small just
		var models = this.where({'selected':true}), i;
		for(i=0; i<models.length;i++){
			models[i].safeSetSelected(false);
		}
	
		for (i=0;i<aHits.length;i++) {
			var rangeItem = this.findPairString(aHits[i]);
			rangeItem.safeSetSelected(true);
		}
		this.lastRangeVal = value;
				
	},
	rangeItemAt: function(rank1,rank2) {		//search for a row or a column
		if (!_.isUndefined(rank2))
			return this.findWhere({rank1: rank1, rank2:rank2});
		else
			return this.find({rank1:rank1});
	},
	tableLoop: function(fnRow,fnCol) {
		for (rank1=14; rank1>1;rank1--) {
			fnRow(this.rangeItemAt(rank1,rank2));
			for (rank2=14;rank2>1; rank2--){
				fnCol(this.rangeItemAt(rank1,rank2));
			}
		}
	},
	findPairString: function(input) {
		var returnMod = null;
		this.forEach(function(mod) {
			if (mod.get('key') === input) {
				returnMod = mod;
				return false;
			}
		});
		return returnMod;
	}
	
});

var RangeTableView = AWView.extend({	  
	tagName: 'table',
	className: 'table',
	id: 'op_range_table',
	parent: 'op_range',
	currentRangeItemView: null,
	initialize: function() {									
			var renderData = this.renderData;
			
			//this.currentRangeItemView = new RangeItemView(this.model.rangeItemAt(14,14));
			this.model.tableLoop(
				function(mod) {
					renderData.row.push([]);				
				}, function(mod) {
					if(!this.currentRangeItemView)
						this.currentRangeItemView = new RangeItemView({model:mod});
					else
						this.currentRangeItemView.setModel(mod);
					
					renderData.row[renderData.row.length -1].push(
						{
							innerHtml:this.currentRangeItemView.render(),
							id: this.currentRangeItemView.idPrefix() + this.currentRangeItemView.id(),
							sClass: this.currentRangeItemView.className()
						}
					);
				}
			);			
			this.render();	
			
			this.listenTo(this.model,'change', function(oChanged) {			
				//for (i=0; i< aChanged.length; i++) {
					if(!this.currentRangeItemView)
						this.currentRangeItemView = new RangeItemView({model:oChanged});
					else
						this.currentRangeItemView.setModel(oChanged);
					
					this.currentRangeItemView.render();
					
				//}
			});
	},
	events: {
		"mousedown td": "handleMousedown"	
	},
	modelFromTD : function(td) {
        var id = $(td).attr('id');
		var sId = id.split("_")[2];
		return this.model.findPairString(sId);        
    },
	handleMouseEnterDragging: function(e) {
		this.bWasSimpleClick = false; 
		var td = e.currentTarget;
		var model = this.modelFromTD(td);
		var originalSel = model.get(selected);
		
		var toSet = !this.bOriginalSelected;
		model.set('selected',toSet);
		
		if(originalSel !== toSet);
			model.toggle('custom');	
		this.fFixCustomBorders();
		
	},
	handleMousedown: function(e) {
		var td = e.currentTarget;
		var table = e.delegateTarget;
		var oView = this;	
		var model = this.modelFromTD(td);             
				
		bNewVal = model.toggle('selected');
		model.toggle('custom');
		
		this.bOriginalSelected = !bNewVal;		
		this.bWasSimpleClick = true;
		
		this.$('td').on('mouseenter', function(e) {
			oView.bWasSimpleClick = false; 
			var td = e.currentTarget;
			var model = oView.modelFromTD(td); 
			var originalSel = model.get('selected');
			
			var toSet = !oView.bOriginalSelected;
			model.set('selected',toSet);
			
			if(originalSel !== toSet)
				model.toggle('custom');	
			oView.fFixCustomBorders();
		}); //start listening for mousenter while dragging
		
		$(td).one('mouseup', function() {
			if (oView.bWasSimpleClick)
				oView.model.trigger('finalize');
			oView.fFixCustomBorders();	
		});
		
		$("body").one('mouseup', function() {
			oView.$('td').off('mouseenter');
			if(!oView.bWasSimpleClick)	
				oView.model.trigger('finalize');
		});
		oView.fFixCustomBorders();	
	},
	fFixCustomBorders : function() {
		this.$('td').removeClass('nbr nbl nbt nbb');
		this.$('td.custom').each(function() {
			var $this = $(this);
			var index = $this.index();
			var parent = $this.parent();
			
			var next = $this.next();
			var prev = $this.prev();			
			var top = parent.prev().children().eq(index);
			var bottom = parent.next().children().eq(index);
			
			if(next.is('.custom')) {
				$this.addClass('nbr');
				next.addClass('nbl');
			}
			
			if(prev.is('.custom')) {
				$this.addClass('nbl');
				prev.addClass('nbr');
			}
			
			if(top.is('.custom')) {
				$this.addClass('nbt');
				top.addClass('nbb');
			}
			
			if(bottom.is('.custom')) {
				$this.addClass('nbb');
				bottom.addClass('nbt');
			}				
		});
	},
	render: function() {						
			////suit offsuit pPair
			var oData = this.renderData;						
			var output = Mustache.render(this.template, oData);
			this.el.innerHTML = output; //html(output);
			$(Mustache.render('#{{.}}',this.parent)).append(this.el);
	},
	renderData: { 		
			'class': _.isFunction(this.className) ? this.className() : this.className,
			'id': this.id,
			'row': []			
	},
	template: 	"<table id='{{id}}' class='{{class}}'>\
					<tbody>\
						{{#row}}\
						<tr>\
								{{#.}}\
									<td id='{{id}}' class='{{sClass}}'>\
									{{{innerHtml}}}\
									</td>\
								{{/.}}\
						</tr>\
						{{/row}}\
					</tbody>\
				</table>"
});


var RangeItemView = AWView.extend({	  
	setModel: function(model) {
		this.model = model; //set this early
		//we could put this in our standard awview logik
		var elTest = $(Mustache.render('#{{.}}',this.idPrefix() + this.id()));
		if (_.isElement(elTest[0])) {
			this.el = elTest[0];
			this.$el = elTest;
		}
	},
	initialize: function(oData) {				
		this.setModel(oData.model);
		this.compiledTemplate = Mustache.compile(this.template);
	  },
	tagName: 'td',
	className: function() {
		var aClass=[];
		var sClass = 'offsuit';
		var pair = this.model.get("pair");
		if(pair.bPPair()) {
			sClass = 'pPair';
		}
		else if(pair.get('suited')) {
			sClass = 'suit';
		}
		aClass.push(sClass);
		if (this.model.get('selected'))
			aClass.push('selected');
		if (this.model.get('custom'))
			aClass.push('custom');
		
		return aClass.join(' ');
	},
	render: function() {						
			////suit offsuit pPair
			var oData = this.renderData();						
			var output = this.compiledTemplate(oData);//Mustache.render(this.template, oData);
			var sClass = this.className();
			this.el.innerHTML = output; //faster native performance
			this.el.className =sClass; //probably faster than jquery
			return output;
		},
	id: function() {
		return this.model.get('pair').toString();
	},
	idPrefix: function() {
		return 'op_range_';
	},
	renderData: function() {
		return 	{
			'class': this.className(),
			'id': this.id(),
			'id_prefix': this.idPrefix(),
			'string': this.id()
		};
	},
	template: 	"<div class='pair_wrapper'>\
				<div class='static_bg'>&nbsp;</div>\
				<div class='inner_pair'>{{string}}</div>"
});

