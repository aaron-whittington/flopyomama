"use strict"

var LinkEditorView = AWView.extend({
	initialize: function() {
		var that = this;
		this.listenTo(flopYoMama.router, "route:main", function() {
			this.setFromRoute();
		});

		$('#lg_display').keyup( function() {
			that.updateFields();
		});

		$('#lg_display').change( function() {
			that.updateFields();
		});
		this.setFromRoute();

	},
	updateFields: function() {
		
		var linkText = '<a href="' + location.href + '">' +
					$('#lg_display').val() +
					'</a>';

		$('#lg_code').text(linkText).html();

	},
	setFromRoute: function() {
		//set the display text from the route
		var prefix = 'FYM: ',
			hand = routerValues.hand,
			board = routerValues.board;

		var oHand = new CardList(hand),
			oBoard = new CardList(board);

		var display = prefix + oHand.toDisplayString() + ', ' + 
			oBoard.toDisplayString();

		$('#lg_display').val(display);

		this.updateFields();
		//lg_preview, lg_code
	}
});

$(function() {
	
	var lev = new LinkEditorView();
});
