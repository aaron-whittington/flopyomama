FixedRange = AWModel.extend({
	initialize: function() {
		this.on('activate', function() {

			var rangeTable = flopYoMama.rangeTable;
			rangeTable.clearCustom();
			
			//custom board places 
			var custom = this.get('custom');
			_.each(custom, function(o) {
				var key = o.key;
				var selected = o.selected;
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
	}
});

FixedRange.fromCurrent = function(slider, rangeTable) {
	var name = prompt('please enter a name', 'name'),
		range = new FixedRange({
			name : name,
			sliderVal: slider.get('value'),
			sliderScale: slider.getScaleId(),
			custom: rangeTable.getCustom(true)
		});
	return range;
};


FixedRangeList = AWCollection.extend( {
	model: FixedRange
});


//load the default ranges
FixedRangeList.loadDefault = function() {
	


};

FixedRangeView = AWView.extend({
	initialize: function() {
		this.compiledTemplate = Mustache.compile(this.template);
		this.render();

	},
	template: '<li class="fixed_range {{{nameLower}}}" title="{{{desc}}}">'+
				'<a>{{{name}}}</a>' +
			  '</li>',
	render: function() {
		var oData = this.renderData();
		var output = this.compiledTemplate(oData);
		$('#new_fixed').before(output);
		this.$el = $(".fixed_range." + oData.nameLower);
	},
	events : {
		"click" : "handleClick"
	},
	handleClick : function(e) {
		this.model.trigger('activate');
	},
	renderData: function() {
		return {
			nameLower: this.model.get('name').toLowerCase(),
			name: this.model.get('name'),
			desc: this.model.get('desc')
		}
	}

});

FixedRangeList.default = {
	"Nit":  {"name": "Nit", "desc": "A very tight player", "sliderVal": 7, 
		"sliderScale": "statistical", "custom": null},
	"Tag" : {"name": "Tag", "desc": "Strong player: tight and agressive", "sliderVal": 11, 
		"sliderScale": "sklansky", "custom": null}, 
	"Lag": {"name":"Lag", "desc": "Strong player: loose and agressive","sliderVal":19,
		"sliderScale":"sklansky",
		"custom":[{"key":"44", "selected":true},
				{"key":"33", "selected": true},
				{"key":"22","selected":true}]}, 
	"Agrofish": {"name":"Agrofish", "desc": "A very agressive bad player", "sliderVal":25,
		"sliderScale":"statistical",
		"custom":[{"key":"K5s","selected":false},
				{"key": "K4s","selected":false},
				{"key":"33","selected":true},
				{"key":"22","selected":true}]},
	"Pairs" : {"name":"Pairs", "desc" : "Plays only pocket pairs", "sliderVal":0,
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
	_.each(FixedRangeList.default, function(val) {
		def.add(new FixedRange(val));
	});
	def.each(function(mod) {
		var view = new FixedRangeView({model: mod});
	});

	$('#new_fixed').click(function() {
		 
		var range = FixedRange.fromCurrent(
			flopYoMama.slider,
			flopYoMama.rangeTable,
			nsFilter.fGetActiveFilter()
		);

		console.log( JSON.stringify(range.attributes) ); 
	});

});
