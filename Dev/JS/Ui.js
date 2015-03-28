"use strict";
var RANK_CODES = {};
//bugs 9 key doesn't work;
/*keyCodes 2 to 9*/
for(var i=50;i<50+8;i++){
	RANK_CODES[i]=i-48;
}

/*tjqka*/
RANK_CODES[84] = 'T';
RANK_CODES[74] = 'J';
RANK_CODES[81] = 'Q';
RANK_CODES[75] = 'K';
RANK_CODES[65] = 'A';

/*suits*/
var SUIT_CODES = {};
SUIT_CODES[67] = '\u2663'; //club
SUIT_CODES[68] = '\u2666'; //diamond
SUIT_CODES[72] = '\u2665'; //heart
SUIT_CODES[83] = '\u2660'; //spade

var BACKSPACE_CODE = 8;
var DELETE_CODE = 46;
var TAB_CODE = 9;
var LEFT_ARROW = 37;
var RIGHT_ARROW = 39;

var nsUI = {};

nsUI.fGetCurrentBoardString = function() {
	var current = $('.known.btn:focus');
		
	/*nothing selected*/
	if(current.length !== 1)
		return undefined;
	else
		return current.val();		
}; 

nsUI.fSetBoardString = function(current, s) {	
	var oCard;
	/*nothing selected*/
	if(current.length < 1) {
		return false;
	}
	else {
		current.val(s);

		current.removeClass("suit_C suit_D suit_H suit_S");

		if(s.length === 2){
			oCard = nsConvert.fConvertStringToCardObject(s); 
			current.addClass("suit_" + nsConvert.suitToChar(oCard.suit));
		}	

		return true;	
	}	
};

nsUI.fSetCurrentBoardString = function(s) {
	var current = $('.known.btn:focus');
	return nsUI.fSetBoardString(current, s);
}; 


nsUI.fHandleKeyPressKnown = function(keyCode,e){

	var bBoardChanged = false;
	
	/*allow native tabs*/
	if (keyCode!==TAB_CODE) {
		e.preventDefault();
	}
	
	if(keyCode === RIGHT_ARROW) {
		nsUI.fSelectNext();
	}
	else if(keyCode === LEFT_ARROW) {
		nsUI.fSelectPrev();
	}


	if (keyCode === BACKSPACE_CODE) {
		
		if(!nsUI.fDeleteSelected())	
			nsUI.fSelectPrev();
		else
			bBoardChanged = true;	
	} 	
	
	if(keyCode === DELETE_CODE) {
		nsUI.fDeleteSelected();
		e.stopPropagation(); 
		bBoardChanged = true;
		//return false;
	}
	var val, s;
	//HERE WE NEED TO MAKE SURE THERE AREN'T ALREADY FOUR OF A KIND ON THE BOARD
	if(typeof RANK_CODES[keyCode] !== "undefined") {
	 	val = nsUI.fGetCurrentBoardString();
		if (typeof val === "undefined")
			return;
			
		var rank =RANK_CODES[keyCode];
		
		s = '' + rank;
		
		if(val.length > 1)
			s+=val[1]; 
		nsUI.fSetCurrentBoardString(s);
	}		
	else if(typeof SUIT_CODES[keyCode] !== "undefined") {
		val = nsUI.fGetCurrentBoardString();
		/*we must have a current field and the length must be at least 1*/
		if (typeof val === "undefined" || val.length < 1)
			return;
				
		var suit =SUIT_CODES[keyCode];
		s = '' + val[0] + suit; 
		console.log("now typing suit s= " + s);
		if(nsUI.fValidateKeypress(s)) {			
			nsUI.fSetCurrentBoardString(s);
			nsUI.fSelectNext(); 		//move to next position
			bBoardChanged = true;				
		}			
	}
	
	if (bBoardChanged) {
		nsUI.fAfterBoardChange();
	}		
};

nsUI.fHandleKeyPressAnywhereElse = function(keyCode,e){
	if (keyCode === BACKSPACE_CODE) {
		
		//here we have to check if we're in a form field or not
		// when not in a form field, the default is to navigate away; don't navigate away	
		//	e.preventDefault();	
	} 
};

nsUI.fHandleKeyPress = function(keyCode,e){
	var d = e.srcElement || e.target;
	var bBoardChanged = false;
   
    if (!$(d).hasClass('known')) {
            nsUI.fHandleKeyPressAnywhereElse(keyCode,e);
			return; 
	} else {	
		nsUI.fHandleKeyPressKnown(keyCode,e);
	}
};		

nsUI.fAfterBoardChange = function() {
	nsHtml.fRedrawBoardSelectionTable();
	nsUI.fEvaluateKnownCards();
	nsUI.fSaveBoardState();
};


nsUI.fValidateKeypress = function(sCard) {
	var oCard = nsConvert.fConvertStringToCardObject(sCard);
	var aKnownCards = nsUI.fGetKnownCards();
		
	var html = nsUI.fGetCurrentBoardString();
	if (typeof html === "undefined")
		return;
			
	var oCurrentCard = nsConvert.fConvertStringToCardObject(html);
	/*we allow typing of the same card*/
	if (fIdenticalCards(oCard,oCurrentCard))
		return true;		
	
	
	for(var j=0;j<aKnownCards.length;j++) {
		if(fIdenticalCards(oCard,aKnownCards[j]))
			return false;
	}	
	return true;
};

nsUI.fDeleteSelected = function() {
	var html = nsUI.fGetCurrentBoardString();
	if (typeof html === "undefined")
		return false; /*didn't delete something*/
		
	if (html ===EMPTY_CARD_STRING)
		return false;
		
	nsUI.fSetCurrentBoardString(EMPTY_CARD_STRING);
	
	nsUI.fSaveBoardState();
		
	return true;
};

nsUI.fDeleteBoard = function() {
	var btn;

	if (arguments.length === 0)
		nsUI.fSetBoardString($('.known'), EMPTY_CARD_STRING);

	for(var i=0; i< arguments.length; i++) {
		fDeleteSingleBoard(arguments[i]);
	}

	var fDeleteSingleBoard = function(id) { 
		if (nsUtil.fType(id) === 'number') {
			btn = $('.known').eq(id);
			nsUI.fSetBoardString($(this), EMPTY_CARD_STRING);
		}
		else if (nsUtil.fType(id) === 'string') {
			$('.known').each( function() {
					if($(this).val() === id)
						nsUI.fSetBoardString($(this), EMPTY_CARD_STRING);
				}		
			);		
		}	
	};
	nsUI.fSaveBoardState();
};

nsUI.fSaveBoardState = function() {
	var boardArray = [];
	for(i=0; i<7;i++) {
		var id = '#known_' + (i+1);
		var val = $(id).val();
		boardArray.push(val);
	}
	nsUtil.fSetLocalStorage("board_array",boardArray);
};

nsUI.fRestoreBoard = function() {
	var boardArray = nsUtil.fGetLocalStorage("board_array");
	if (boardArray === null)
		return;
	for(var i=0; i<7;i++) {
		var id = '#known_' + (i+1);
		var val = boardArray[i];
		nsUI.fSetBoardString($(id), val);
	}
};

/*Sets a board place(s) to the card at the given position.
  If no position is given, it sets the board card to the current focus.
  Otherwise throws an exception. */
nsUI.fSetBoardCard = function(oCard, position) {

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
			nsUI.fSetBoardString(insertNode, oCard);				
			nsUI.fSaveBoardState();	
		}
		else {
			var numberOfCards = oCard.length/2;
			for(i=0; i<numberOfCards; i++) {
				var singleCard = oCard[i*2] + oCard[i*2+1];
				nsUI.fSetBoardCard(singleCard,(position+i)%7);	
			}
			nsUI.fSaveBoardState();
		}	
	}
	else {
		for (i=0; i< oCard.length; i++) {
			nsUI.fSetBoardCard(oCard[i], (position+i)%7);		
		}
	}	
};

/*selects the board with the card defined by search*/
nsUI.fSelectKnown = function(search) {
	$('.known').each( function() {
			if($(this).val() === search){	
				$(this).focus();
			}
		}		
	);		
};

//moves all the way to the next card
nsUI.fSelectNext = function(bPreferEmpty) {	
	var jQCurrentSelected = $(".known.btn:focus");
	var currentSelected = null;
	if (jQCurrentSelected.length<1)
		return;
	else
		currentSelected = jQCurrentSelected.first().attr('id').split('_')[1];
	
	if(bPreferEmpty) {
		for(var i=1;i<7;i++) {
			currentSelected++;
			if (currentSelected > 7)
				 currentSelected = 1;
			var tryNode = $('#known_' + currentSelected + ' span');
			var sHtml = tryNode.html();
			if (sHtml === EMPTY_CARD_STRING) {
				$('#known_' + currentSelected).focus();
				return;
			}
		}
		return; //if we don't find a place just go home for now
	}	
	
	currentSelected++;
	if (currentSelected > 7)
		 currentSelected = 1;
	nsUtil.fLog ('current selected ' + currentSelected);
	$('#known_' + currentSelected).focus();
};

nsUI.fSelectPrev = function() {	
	var jQCurrentSelected = $(".known.btn:focus");
	var currentSelected = null;
	if (jQCurrentSelected.length<1)
		return;
	else
		currentSelected = jQCurrentSelected.first().attr('id').split('_')[1];

	currentSelected--;
	if (currentSelected < 1)
		currentSelected = 7;

	$('#known_' + currentSelected).focus();
};

nsUI.fGetBoardCards = function() {
	var jqCards = $('#board .known');
	var aCards = [];
	jqCards.each(function() {
			var raw = $(this).val();
			if (raw!==EMPTY_CARD_STRING)
				aCards.push(nsConvert.fConvertStringToCardObject(raw));
		}
	);
	return aCards;
};

//returns an object with prop bHand, bFlop, bRiver, bTurn, signifying that that part of the board has been set
nsUI.fGetBoardState = function () {
	
	var oReturn = {
		bHand: true,
		bFlop: true,
		bTurn: true,
		bRiver: true
	};
	
	//hand	
	$('#known_1, #known_2').each(function() {
		if($(this).val() === EMPTY_CARD_STRING) {
			oReturn.bHand = false;
			return false; //break
		}
	});
	
	//flop
	$('#known_3, #known_4, #known_5').each(function() {
		if($(this).val() === EMPTY_CARD_STRING) {
			oReturn.bFlop = false;
			return false; //break
		}
	});
	
	if ($('#known_6').val() === EMPTY_CARD_STRING)
			oReturn.bTurn = false;
	
	if ($('#known_7').val() === EMPTY_CARD_STRING)
			oReturn.bRiver = false;

	return oReturn;
};

nsUI.fEvaluateKnownCards = function() {
	var aCards = nsUI.fGetKnownCards();
	
	var bBoardState = nsUI.fGetBoardState();
	
	if (bBoardState.bFlop) {
		nsRange.fGetTextures();	
	}
	else
		$('#textures').html(''); 	//delete the range textures
	
	if(bBoardState.bFlop && bBoardState.bHand && nsPrefs.oAutomaticSearch.fGet()) {
		
		nsRange.fGetAllUnknownCombinationsThreaded();
	}
	else {
		nsUI.fDeleteLongStatistics();
	}
	
	var myHand = nsDrawingHand.fGetDrawingHands(aCards);
	nsUtil.fLog(nsDrawingHand.fHandToString(myHand));
	//$("#hand_description div").html(nsHand.fHandToString(myHand));
	//now get our records
};

nsUI.fDeleteLongStatistics = function() {
	$('#hero_stat, #villain_stat').html('');
	nsUI.fSetWinPercentBarZero();
};

nsUI.fSetWinPercentBarZero = function() {
	var oldTransition = $('#win_percent_bar').children().first().css('transition');
		$(this).children().css('transition','none').css('-webkit-transition','none');
			$('#win_percent_bar').children().css('width','0px');
		setTimeout(function() {	
			$('#win_percent_bar').children().css('transition',oldTransition).css('-webkit-transition',oldTransition);
		},1);
};

var EMPTY_CARD_STRING = '';

nsUI.fGetKnownCards = function() {
	var jqCards = $('.known');
	var aCards = [];
	jqCards.each(function() {
			var raw = $(this).val();
			if (raw!==EMPTY_CARD_STRING)
				aCards.push(nsConvert.fConvertStringToCardObject(raw));
		}
	);
	return aCards;
};

nsUI.fToggleCheckableMenu = function(node, bTurnOffOthers, bForceTrue) {

		if(!bForceTrue) {
			$(node).toggleClass('active');
		} else {
			$(node).addClass('active');
		}

		if($(node).hasClass('active')){
			
			if($(node).find('.glyphicon-ok').length == 0 )
				$(node).find('a').append('<span class = "glyphicon glyphicon-ok"></span>');
			
			if (bTurnOffOthers) {
				$(node).siblings().removeClass('active').find('.glyphicon-ok').remove();
			}
			
			return true;
		}
		else {
			$(node).find('.glyphicon-ok').remove();
			return false;
		}
};

nsUI.clBootstrapCombobox = function(sId,aOptions,aDisplay, sHelpText, iSeparatorIndex) {			  
	var sHtml ='<div class="input-group" id ="'+sId+'">';	 
	sHtml += '<div class="input-group-btn">';	  	  
	sHtml+= '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>';
	sHtml+= '<ul class="dropdown-menu">';
		for(var i=0; i< aOptions.length; i++) {
		 sHtml += '<li id="'+aOptions[i]+'"><a href="#">'+aDisplay[i]+'</a></li>';
	     // <li class="divider"></li>
		}
	sHtml+=  '</ul>';
	sHtml+= '<button type="button" class="validate btn btn-default dropdown-toggle" data-toggle="dropdown"></button>';
	sHtml+=  '</ul>';
	sHtml+= '</div>';
	sHtml+= '<input type="text" class="form-control" placeholder="'+sHelpText+'">';
    sHtml+='</div>';
	return sHtml;
};

nsUI.fAddEventsToCombobox = function(sId,fVal) {
	
	//restore after autocomplete
	$('#' + sId + ' .btn').click(function(){
		$('#' + sId + ' .input-group-btn').removeClass('open'); 
		$('#' + sId + ' li').css('display','block').removeClass('active');
		$('#' + sId + ' ul').css('left',0 + 'px');
	});
	
	
	$('#' + sId).on('click', 'li', function() {
		var val = $(this).attr('id');
		var display = $(this).children().first().html();
		$('#' + sId + ' input').val(display);

		$(this).addClass('active');
		$(this).siblings().removeClass('active');
		
		fVal();
	});
	var aOpen = [];
	var aNotOpen = [];
	var bExact = false;
	$('#' + sId + ' input').keyup(function(e) {
		
		//todo autocomplete
		bExact = false;
		aOpen = [];
		aNotOpen = [];
		$('#' + sId + ' li').each(function() {
			var liLower = $(this).find('a').html(); 
			liLower = liLower.toLowerCase();
			var thisLower = $('#' + sId + ' input').val().toLowerCase();
			if (liLower === thisLower && thisLower.length >0){
				$(this).addClass('active');
				$(this).siblings().removeClass('active');
				bExact = true;
			
			}
			else if (liLower.indexOf(thisLower) > -1 && thisLower.length >0) { //found a hit
				aOpen.push(this);				
			}
			else
				aNotOpen.push(this);

		});
		if(!bExact) {			
			if (aOpen.length > 0) {
				$('#' + sId + ' .input-group-btn').addClass('open');
				var position = $('#' + sId + ' input').position();
				$(aOpen).css('display', 'block');
				$(aNotOpen).css('display', 'none').removeClass('active'); //active and it assumes the value is that
				//seems to be buggy when two hits
				$('#' + sId + ' ul').css('left',position.left + 'px');
				$('#' + sId + ' li').removeClass('active');
			}
			else {	
				$('#' + sId + ' .input-group-btn').removeClass('open');
				$('#' + sId + ' li').css('display','block').removeClass('active');
				$('#' + sId + ' ul').css('left',0 + 'px');
				//if (!bExact) //wenn genauer treffer lassen wir die li active
					//$('#' + sId + ' li').removeClass('active');
			}
		}
				
		fVal();
	});
	
	//tab key for autocomoplete
	$('#' + sId + ' input').keydown(function(e) {
		var keyCode = e.keyCode ? e.keyCode : e.which; //TAB_CODE
		if(keyCode === TAB_CODE && $('#' + sId + ' .input-group-btn').hasClass('open')) {
			var sHtml = $(aOpen[0]).find('a').html();
			$(aOpen[0]).addClass('activated');
			$('#' + sId + ' input').val( sHtml );
			$('#' + sId + ' .input-group-btn').removeClass('open');
			nsUtil.fLog('autocomplete ' + sHtml);
			$(this).triggerHandler('keyup');
		}
			
	});
	
	
	var fStandardValidate = function () {
		var val = $('#' + sId + ' input').val();
		var valButton = $('#' + sId).find('.validate');
		if (val === ''){
			valButton.html('<span class="glyphicon glyphicon-remove"></span>');
			return false;
		}
		else if (val ===  $('#' + sId + ' li.active a').html())
			valButton.html('<span class="glyphicon glyphicon-ok"></span>');		
		else 
			valButton.html('<span class="glyphicon glyphicon-plus-sign"></span>');
		
		nsUtil.fLog('triggering validated');
		$('#' + sId).trigger('validated');
		return true;
	};
	
	if(typeof fVal === 'undefined')
		fVal = fStandardValidate;
	
	fVal();
	//<span class="glyphicon glyphicon-ok"></span>
	//<span class="glyphicon glyphicon-remove"></span>
	//<span class="glyphicon glyphicon-plus-sign"></span>
};
