
nsModel = {};


var Slider = Backbone.Model.extend({
		defaults: {value: 18, fRangeFunction:fGetSlanskyFromPercent, max: 50, min:0},
		initialize: function() {					
			var fRangeFunction = null;
			var rangeFunctionStored = nsUtil.fGetLocalStorage("range_type");
		
			if (rangeFunctionStored  === "sklansky") {
				fRangeFunction = fGetSlanskyFromPercent;
			}			

			else if (rangeFunctionStored   === "statistical") {
				fRangeFunction = fGetStatisticalFromPercent;
			}
		
			if(fRangeFunction) {
				this.set("fRangeFunction", fRangeFunction);
			}
				
			this.on('change:value', function() {
				var value = this.get('value');
				if (value > this.max)
					this.set({'value':this.max});
				else if(value < this.min)
					this.set({'value':this.min});
			});

			this.on('change:fRangeFunction', function() {
				this.trigger('finalize');
				var id,
					f = this.get('fRangeFunction');

				id = f === fGetStatisticalFromPercent ? "statistical" : "sklansky"; 

				nsUtil.fSetLocalStorage("range_type", id);
			});
								
			this.on('finalize', function (value) {
					if(_.isNull(value) || _.isUndefined(value))
						value = this.get('value');
					
					console.log("range slider finalize with value " + value);
					
					nsUtil.fSetLocalStorage("range_slider_val", value);
					
					var oldValue = this.get('value');
					
					this.set('value',value);
					if (oldValue === value)
						this.trigger('change:value');
													
				}	
			);		
		}
	}
);

var SliderView = Backbone.View.extend({	  
	  initialize: function() {
			var that = this;
			this.$el.slider({
						change: function(e,ui) {
							that.model.trigger('finalize',ui.value);
						},
						slide: function(event,ui) {								
							that.model.set({value:ui.value});
						},
					max: that.model.get("max"),
						min: that.model.get("min"),
						value: that.model.get("value")					
					}		
			);	
			this.listenTo(this.model, "change:value", this.render);
			this.on('update', this.update);
			
		
			this.handle = $('.range_slider_bg').parent().find('a')[0];
			this.handleParent = $(this.handle).parent()[0];
			this.bg = $('.range_slider_bg')[0];			
	  },
	  handle: null,
	  handleParent: null,
	  bg: null,
	  render: function() {
			/*var handleLeft = this.handle.style.left;
			var valToSet =  100.0 - parseFloat(handleLeft) + '%';
			this.bg.style.right = valToSet; //('right',valToSet);*/
			var value = this.model.get('value');
			$("#range_slider_val").html(value + '%');			
			$('.range_slider_bg').css('width', 100.0*value/this.model.get('max') + '%');			
		},
		update : function(value) { //changing the slider programatically
			
			//nsUtil.fLog('manual SET trigger with value ' +this.model.get('value'));
			this.$el.slider({"value":value});
		}
});

var RangeTypeSelectView = Backbone.View.extend({
	initialize : function() {
		this.listenTo(this.model, "change:value", this.render);
		this.render();
	},
	render: function() {
		var f = this.model.get("fRangeFunction");
		if( f === fGetSlanskyFromPercent) {
			nsUI.fToggleCheckableMenu($('#sklansky'), true, true);
		} else if (f === fGetStatisticalFromPercent) {
			nsUI.fToggleCheckableMenu($('#statistical'), true, true);
		}
	},
	events: {
		"click": "handleClick"
	},
	handleClick: function(e) {
		var fRangeFunction,	
			item = $(e.target).parent(),
			bActivated = nsUI.fToggleCheckableMenu(item, true);	

		if (bActivated) {
			var id = $(item).attr('id');
			
			if (id === "sklansky") {
				fRangeFunction = fGetSlanskyFromPercent;
			}			
			else if (id === "statistical") {
				fRangeFunction = fGetStatisticalFromPercent;
			}
			
			this.model.set("fRangeFunction", fRangeFunction);
		}
	}
});



