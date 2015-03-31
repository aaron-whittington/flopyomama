var ImmutableDeck = CardList.extend({
	initialize: function() {
		for (var suit=4; suit>0; suit--) {
			for (var rank=14; rank>1; rank--) {
				this.add( new Card(rank,suit) );
			}
		}
		this.locked = true;
	},
	add: function() {
		if(this.locked)
			throw "you can't add or remove cards from an immutable deck";
		
		Backbone.Collection.prototype.add.apply(this, arguments);
	}, 
	remove: function() {
		
		if(this.locked)
			throw "you can't add or remove cards from an immutable deck";
		Backbone.Collection.prototype.remove.apply(this, arguments);
	}
});

var Deck = CardList.extend({
	initialize: function() {
		var id = new ImmutableDeck();
		this.models = id.models;
	}
});
