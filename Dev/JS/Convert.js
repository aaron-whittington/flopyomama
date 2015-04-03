/*takes AAo und generates AcAd,AsAh ...and so on*/
var nsConvert = {};

var fGetRandomCards = function(i) {

	var aAll =flopYoMama.knownCards.allUnknown(true),
		aReturnCards = [],
		aReturnCardIndex = [];
	while (aReturnCards.length < i) {
		var random = Math.floor((Math.random()*aAll.length));
		if(jQuery.inArray(random, aReturnCardIndex)<0) {
			aReturnCardIndex.push(random);
			aReturnCards.push(aAll[random]);
		}
	}
	return aReturnCards;
};

//takes a string such as A'\u2663' to the proper card object
nsConvert.fConvertStringToCardObject = function(s) {
	var oCard;
	if (typeof s === "string") {
		oCard = {};
		oCard.rank = nsConvert.rankCharToNumber(s[0]);
		oCard.suit =  nsConvert.suitCharToNumber(s[1]);
	}
	else { //param is an array
		var returnArray = [];
		for (var i=0;i<s.length; i++)
			returnArray.push(nsConvert.fConvertCardStringToCardObject(s[i]));
			
		return returnArray;
	}
	
	return oCard; 
}

nsConvert.fConvertCardObjectToString = function(oCard) {
	return nsConvert.rankNumberToChar(oCard.rank)+nsConvert.suitToDisplayChar(oCard.suit);
}


//remove known board cards from pair array (SHOULD BE SOMEWHERE ELSE)
var fFilterCardPairArray = function(pairArray,aKnown, aFilterPairs) {
	var cardArrayLength = pairArray.length;
	var aKnownLength = aKnown.length;
	var returnArray =[]
	for(var i=0;i<pairArray.length;i++){
		var pair = pairArray[i];
		var card1 = pair[0];
		var card2 = pair[1];
		var bCardOk = true;
		for (var j=0; j<aKnownLength;j++) {
			var known = aKnown[j];
			if (((known.suit === card1.suit) && (known.rank === card1.rank))||
				((known.suit === card2.suit) && (known.rank === card2.rank))) {
				bCardOk = false;
				break;
			}
		}
		if (aFilterPairs)
			for (var j=0; j<aFilterPairs.length;j++) {
				var filterPair = aFilterPairs[j];
				if (((filterPair[0].suit === card1.suit) && (filterPair[0].rank === card1.rank) &&
					(filterPair[1].suit === card2.suit) && (filterPair[1].rank === card2.rank	)) ||
					((filterPair[1].suit === card1.suit) && (filterPair[1].rank === card1.rank) &&
					(filterPair[0].suit === card2.suit) && (filterPair[0].rank === card2.rank	)) ) {
					bCardOk = false;
					break;
				}
			}
		
		if (bCardOk)
			returnArray.push(pair);
	}
	return returnArray;
}

//card char /int conversion
_.extend(nsConvert,
	{
		rankCharToNumber: function(c) {
			 if(c === 'A')
				return 14;
			 if(c === 'K')
				return 13;
			 if(c === 'Q')
				return 12;
			 if(c === 'J')
				return 11;
			 if(c === 'T')
				return 10;	
			 return parseInt(c);
		},
		suitCharToNumber: function(c) {				
			if (c === '\u2663') //c
				return 1;
			if (c === '\u2666')  //d
				return 2;
			if (c === '\u2665') //h
				return 3;
			if (c === '\u2660') //s
				return 4;			
			if (c === 'C')
				return 1;
			if (c === 'D')
				return 2;
			if (c === 'H')
				return 3;
			if (c === 'S')
				return 4;
			
			return null;
		},
		rankNumberToChar: function(i) {
			 if (i===14)
				return 'A';
			 if(i===13)
				 return 'K';
			 if(i===12)
				 return 'Q';
			 if(i===11)
				 return 'J';
			 if(i===10)
				 return 'T';
			 return i.toString(); 
		}, //maybe put these ones in a view...
		suitToDisplayChar: function (i) {
			if (i===1)
				return '\u2663';
			if (i===2)
				return '\u2666';
			if (i===3)
				return '\u2665';
			if (i===4)
				return '\u2660';
			
			return null;
		},
		suitToChar: function(i) {
			
			if (i===1)
				return 'C';
			if (i===2)
				return 'D';
			if (i===3)
				return 'H';
			if (i===4)
				return 'S';
				
			return null;
		}
}); //expose this stuff



