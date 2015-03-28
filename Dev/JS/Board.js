
var KnownCards = Backbone.Model.extend({
		defaults: {aCards: []},
		initialize: function() {					
			this.on('change:aCards', function() {
				//var value = this.get('value');				
			});
								
			this.on('finalize', function (value) {
					if(_.isNull(value))
						value = this.get('value');
					
					//nsUtil.fSetLocalStorage("range_slider_val", value);
					//nsUI.fEvaluateKnownCards();
					
					//if(!this.hasChanged('value'))
					//this.trigger("change:value")
					//this.set({'value':value});
					Router.navigate("board=" + JSON.stringify(this.value), {trigger: false});
				}	
			);
			
		},
		validateBoardString: function(s) {
				
			var ranks = '23456789TJQKA';		
			var suits = ['\u2663','\u2666','\u2665','\u2660'];
						
			if (s.length !== 2)
				return false;
			
			var cRank = s[0];
			var cSuit = s[1];
			
			if(ranks.indexOf(cRank) === -1)
				return false;
			
			if(suits.indexOf(cSuit) === -1)
				return false;
				
			return true;					
		}	
	}
);

var KnownCardsView = Backbone.View.extend({	  
	initialize: function() {
				
	},
	render: function() {
			
	},
	update : function() { 
	}
});

/*validate known cards on focus-out, then set the thing to EMPTY if not valid*/
$(function() {
	$("body").on("focusout",".known",function() {
		var s = $(this).val();
		
		var kc = new KnownCards();
		if(kc.validateBoardString(s))
			return;
		else
			nsUI.fSetBoardString($(this),EMPTY_CARD_STRING);
		
	});	
});
