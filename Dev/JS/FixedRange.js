FixedRange = AWModel.extend({
	initialize: function() {

		//convert custom objects to custom BB models
		var newCust,
		oldCust = this.get('custom');
		if(oldCust && oldCust.length > 0) {
			if(!(oldCust[0] instanceof RangeItem)) {
				newCust = _.map(oldCust, function(o) {
					return new RangeItem({ 
						pair: o.key,
						selected: o.selected,
						custom: true
					})
				});
				this.set('custom',newCust);
			}
		}
		
		if(!this.get('id')) {
			this.set('id', this.getIdName());
		}
		this.on('change:name', function(val) {
			this.set('id', this.getIdName());
		});

		this.on('activate', function() {

			var rangeTable = flopYoMama.rangeTable;
			rangeTable.clearCustom();
			
			//custom board places 
			var custom = this.get('custom');
			_.each(custom, function(o) {
				var key = o.get('key');
				var selected = o.get('selected');
				var mod = rangeTable.findPairString(key);
				mod.set('custom', true);
				mod.set('selected',selected); 
			});

			var slider = flopYoMama.slider;	
			var sliderView = flopYoMama.sliderView;
						
			var fnRange = slider.getFnFromScaleId( 
				 this.get('sliderScale')
			);

			flopYoMama.slider.set('fRangeFunction', fnRange, {silent : true});
			sliderView.update( this.get('sliderVal'), {silent: true});

		});

		this.on('save', function() {
			console.log("FIXED RANGE LIST PREFIX" + FixedRangeList.itemPrefix);
			var key = FixedRangeList.itemPrefix + this.get('id');
			nsUtil.fSetLocalStorage(key,this.toJSON());
		});
	}, 
	getIdName: function() {
		return this.get('name').toLowerCase().replace(/ /g,'_'); 
	}
});

FixedRange.fromCurrent = function(slider, rangeTable) {
	var range = new FixedRange({
			id : "new_id",
			name : name,
			sliderVal: slider.get('value'),
			sliderScale: slider.getScaleId(),
			custom: rangeTable.getCustom()
		});
	return range;
};

FixedRangeList = AWCollection.extend({
	model: FixedRange,
	initialize: function() {
		this.initLocalData();
		this.loadAll();
		this.on('remove',this.toLocalData);
		this.on('add',this.toLocalData);
	},
	initLocalData: function() {
		//do nothing, if it's already there
		var test = nsUtil.fGetLocalStorage(FixedRangeList.displayKey);

		if (nsUtil.fType(test) === 'array') {
			return;
		} else {
			var toSet = _.keys(FixedRangeList.default);	
			nsUtil.fSetLocalStorage(FixedRangeList.displayKey, toSet); 
		}
	},
	//loads list, accoring to displayKey, first trying from localStorage
	//and then trying from the defaults
	loadAll: function() {
		var toLoad = nsUtil.fGetLocalStorage(FixedRangeList.displayKey),
			that = this;
		this.remove();
		_.each(toLoad, function(key) {
			var test = nsUtil.fGetLocalStorage(FixedRangeList.itemPrefix + key);
			if(test) {
				that.add(test);
			} else if (FixedRangeList.default[key]) {
				that.add(FixedRangeList.default[key]);
			} else {
				alert("Error: could not load fixed range: " + key);
			}
		});
	},
	//writes the list of keys to localstorage
	//based on the current state of the collection
	toLocalData: function() {
		var ids = this.pluck('id');
		nsUtil.fSetLocalStorage(FixedRangeList.displayKey, ids);
	}
});

FixedRangeList.itemPrefix = "fixed_range_";
FixedRangeList.displayKey = "fixed_range_list";

//view of ranges for clicking loading
FixedRangeView = AWView.extend({
	initialize: function() {
		this.compiledTemplate = Mustache.compile(this.template);
		this.render();
	},
	template: '<li class="fixed_range {{{id}}}" title="{{{desc}}}">'+
				'<a>{{{name}}}</a>' +
			  '</li>',
	render: function() {
		var oData = this.renderData();
		var output = this.compiledTemplate(oData);
		$('#new_fixed').before(output);
		this.$el = $(".fixed_range." + oData.id);
	},
	events : {
		"click" : "handleClick"
	},
	handleClick : function(e) {
		this.model.trigger('activate');
	},
	renderData: function() {
		return {
			id: this.model.getIdName(),
			name: this.model.get('name'),
			desc: this.model.get('desc')
		}
	}
});

FixedRangeListView = AWView.extend({
	model: FixedRangeView,
	initialize: function() {
		this.render();
		this.listenTo(this.collection, 'change', this.render);
		this.listenTo(this.collection, 'remove', this.render);
		this.listenTo(this.collection, 'add', this.render);
	},
	render: function() {
		$('.fixed_range').remove();
		this.collection.each(function(m) {
			var view = new FixedRangeView({model:m});
		});
	}
});
//ranges stored in js for the start
FixedRangeList.default = {
	"nit":  {"name": "Nit", "desc": "A very tight player", "sliderVal": 7, 
		"sliderScale": "statistical", "custom": null},
	"tag" : {"name": "Tag", "desc": "Strong player: tight and agressive", "sliderVal": 11, 
		"sliderScale": "sklansky", "custom": null}, 
	"lag": {"name":"Lag", "desc": "Strong player: loose and agressive","sliderVal":19,
		"sliderScale":"sklansky",
		"custom":[{"key":"44", "selected":true},
				{"key":"33", "selected": true},
				{"key":"22","selected":true}]}, 
	"agrofish": {"name":"Agrofish", "desc": "A very agressive bad player", "sliderVal":25,
		"sliderScale":"statistical",
		"custom":[{"key":"K5s","selected":false},
				{"key": "K4s","selected":false},
				{"key":"33","selected":true},
				{"key":"22","selected":true}]},
	"pairs" : {"name":"Pairs", "desc" : "Plays only pocket pairs", "sliderVal":0,
		"sliderScale":"statistical",
		"custom":[
			{"key":"AA","selected":true},
			{"key":"KK","selected":true},
			{"key":"QQ","selected":true},
			{"key":"JJ","selected":true},
			{"key":"TT","selected":true},
			{"key":"99","selected":true},
			{"key":"88","selected":true},
			{"key":"77","selected":true},
			{"key":"66","selected":true},
			{"key":"55","selected":true},
			{"key":"44","selected":true},
			{"key":"33","selected":true},
			{"key":"22","selected":true}
		]
	}
};

$(document).ready(function() {
	var def = new FixedRangeList();
	var view = new FixedRangeListView({collection: def});
		
	var editorView = null;
	$('body').on('show.bs.modal', '#fixed_range_editor', function(){
		editorView = new FixedRangeEditorView({
			collection: def,
			model: FixedRange.fromCurrent(flopYoMama.slider, flopYoMama.rangeTable)
		});
	});
	$('body').on('hide.bs.modal','#fixed_range_editor',function(){
		editorView.destroy();
	});
	
	$('#save_fixed_ranges').click(function() {
		editorView.trySave();
	});
});
