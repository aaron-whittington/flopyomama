"use strict"

var LinkEditorView = AWView.extend({
	initialize: function() {
		var that = this;
		this.listenTo(flopYoMama.knownCards, "finalize", function() {
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
			oHand = flopYoMama.knownCards.get('hand'),
			oBoard = flopYoMama.knownCards.get('board'),
			display;

		if(oHand.length > 0 || oBoard.length > 0 ) {
			display = prefix + oHand.toDisplayString() + ', ' +
				oBoard.toDisplayString();
		} else {
			display = "FlopYoMama";
		}

		$('#lg_display').val(display);

		this.updateFields();
		//lg_preview, lg_code
	}
});

$(function() {
	var lev = new LinkEditorView();
});
