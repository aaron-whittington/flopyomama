

var routerValues = {};

var TableRouter = Backbone.Router.extend({

  routes: {
    "help":                 "help",    // #help
    "slider=(:value)&hand=(:value1)&flop=(:value2)&turn=(:value3)&river=(:value4)":        "main", 
	"beer/:query/p:page": 		"search"   // #search/kiwis/p7
  },

  help: function() {
    
  },

	main: function(slider, hand, flop, turn, river) {					
		routerValues.slider =slider;
		
		if(typeof flopYoMama !== "undefined" && flopYoMama.slider) {
			window.flopYoMama.sliderView.trigger('update',slider);	
		} 	
  }
});
