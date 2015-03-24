

var routerValues = {};

var TableRouter = Backbone.Router.extend({

  routes: {
    "help":                 "help",    // #help
    "slider=(:value)":        "slider", 
	"beer/:query/p:page": 		"search"   // #search/kiwis/p7
  },

  help: function() {
    
  },

  slider: function(value) {					
		routerValues.slider = value;
		
		if(typeof flopYoMama !== "undefined" && flopYoMama.slider) {
			window.flopYoMama.sliderView.trigger('update',value);	
		} 	
  }
});
