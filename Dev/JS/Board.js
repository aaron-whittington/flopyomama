
var KnownCards = AWModel.extend({
	defaults: {hand: new CardList(), board: new CardList(), deck: new Deck()},
	allKnown: function(bToAtts) {
		var cl = new CardList(this.get('hand').models.concat(this.get('board').models));
		if (bToAtts) {
			return cl.map( function(m) {
				return m.attributes;
			});
		} else {
			return cl;
		}
	
	},
	allUnknown: function(bToAtts) {
		var allKnown = this.allKnown();
		var ac = this.get('deck');
		var cl = ac.filter(function(c) {
		
			var found = allKnown.where({rank: c.get('rank'),suit: c.get('suit')});
			return found.length < 1;
		});

		if (bToAtts) {
			return cl.map( function(m) {
				return m.attributes;
			});
		} else {
			return cl;
		}
	},
	initialize: function() {
		//initialize from router
		if(routerValues.hand || routerValues.board) {
			this.set('hand', new CardList(routerValues.hand));
			this.set('board', new CardList(routerValues.board));
		}
		//read from the localstorage 
		else {
			var boardArray = nsUtil.fGetLocalStorage("board_array"),
				i;

			if (!boardArray)
				return;

			for(i=0; i<2; i++) {
				if(boardArray[i])
					this.get('hand').add( new Card(boardArray[i]) );
			}

			for(i=2; i<7;i++) {
				if(boardArray[i])
					this.get('board').add( new Card(boardArray[i]) );
			}
		}

		this.on('update', function(hand, board) {
			if(hand)
				this.set('hand', new CardList(hand));
			if(board)
				this.set('board', new CardList(board));
			
		});
	}
});

var KnownCardsView = Backbone.View.extend({	  
	initialize: function() {
		this.listenTo(this.model, 'change', function() {
			this.render();
		});

	},
	render: function() {
		var hand = this.model.get('hand').models,
			board = this.model.get('board').models,
			i;

		for(i=0; i<hand.length; i++) {
			this.setBoardString($("#known_" + (i+1)), hand[i]);		
		}
	
		for(i=0; i<board.length; i++) {
			this.setBoardString($("#known_" + (i+3)), board[i]);		
			
		}
	},
	//This takes jqKnown (jq object on board) and sets it to o
	//(passed as card object or card string)
	//NOTE: this should be called from this view, not external to it.
	setBoardString: function(jqKnown, o) {

		if(nsUtil.fType(o) === "object") {
			o = o.toDisplayString();
		}
		var oCard;
		/*nothing selected*/
		if(jqKnown.length < 1) {
			return false;
		}
		else {
			jqKnown.val(o);

			jqKnown.removeClass("suit_C suit_D suit_H suit_S");

			if(o.length === 2){
				oCard = nsConvert.fConvertStringToCardObject(o); 
				jqKnown.addClass("suit_" + nsConvert.suitToChar(oCard.suit));
			}	

			return true;	
		}	
	},
	/*Sets a board place(s) to the card at the given position.
	  If no position is given, it sets the board card to the current focus.
	  Position is 0-based.
	  Otherwise throws an exception. */
	setBoardCard: function(oCard, position) {

		/*if position not sent try to set it on the focused one */
		if(typeof position === "undefined") {
			var current = $('.known.btn:focus');
				
			if(current.length !== 1)
				throw "fSetBoardCard, no position given, and no current focus.";

			var sNum = current.attr("id").split("_")[1];
			var iNum = parseInt(sNum,10);
			position = (iNum -1)%7;
		}

		var insertNode = $('#known_' + (position+1)), i;

		if (nsUtil.fType(oCard) !== 'array'){
			
			if (nsUtil.fType(oCard) === 'object') 
				oCard = nsConvert.fConvertCardObjectToString(oCard);


			if ((nsUtil.fType(oCard) === 'string' && oCard.length === 2)) { //single card
				this.setBoardString(insertNode, oCard);				
				this.updateModel();
			}
			else {
				var numberOfCards = oCard.length/2;
				for(i=0; i<numberOfCards; i++) {
					var singleCard = oCard[i*2] + oCard[i*2+1];
					this.setBoardCard(singleCard,(position+i)%7);	
				}
				this.updateModel();
			}	
		}
		else {
			for (i=0; i< oCard.length; i++) {
				this.setBoardCard(oCard[i], (position+i)%7);		
			}
			this.updateModel();
		}	
	},
	updateModel: function() {
		var hand = new CardList($('#known_1').val() + $('#known_2').val());
		//silent once, since we don't need to update until we do the board, too
		this.model.get('hand').reset(hand.models, {silent: true});

		var board = new CardList($('#known_3').val() +
								 $('#known_4').val() +
								 $('#known_5').val() +
								 $('#known_6').val() +
								 $('#known_7').val());

		this.model.get('board').reset(board.models, {silent: true});
		board.trigger('update');
	}
});
