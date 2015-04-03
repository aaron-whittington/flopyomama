

var routerValues = {};

var TableRouter = Backbone.Router.extend({

  routes: {
    "help":                 "help",    // #help
    "slider=(:value)&hand=(:value1)&board=(:value2)":        "main", 
	"beer/:query/p:page": 		"search"   // #search/kiwis/p7
  },

  help: function() {
    
  },

	main: function(slider, hand, board) {					
		routerValues.slider =slider;
		routerValues.hand = hand;
		routerValues.board = board;
		
		if(typeof flopYoMama !== "undefined" && flopYoMama.knownCards) {
			window.flopYoMama.knownCards.trigger('update', hand, board);	
		} 	

		if(typeof flopYoMama !== "undefined" && flopYoMama.slider) {
			window.flopYoMama.sliderView.trigger('update', slider);	
		} 	
  }
});
