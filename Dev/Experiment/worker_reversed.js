
importScripts('../Math.js', 'Hand.js','Convert.js');

var MAX_RUNTIME = 25.0; //never run longer than x seconds

self.addEventListener('message', function(e) {
  var data = e.data;
  switch (data.cmd) {
    case 'start':
	  //self.postMessage({'command recieved start');
	  fCalculateBoards(data.aoStartingHands,data.aKnownCards,data.aUnknownCards, data.aFixedBoardCards, data.numberOfOpenBoardHandPlaces);
      break;
    case 'stop':
      self.close(); // Terminates the worker.
      break;
    default:
      self.postMessage('Unknown command: ' + data.msg);
  };
}, false);

var numberDone = 0;
var fCalculateBoards = function (aoStartingHands,aKnownCards,aUnknownCards,aFixedBoardCards,numberOfOpenBoardHandPlaces) {		
	var startTime = new Date().getTime();
	var totalCombinations = fNumberOfCombinations(aUnknownCards.length,numberOfOpenBoardHandPlaces)
	self.fPostConsole('now starting operation');

	//calculate length of operation
	var allStartingPairs=[];
	var startLength = aoStartingHands.length;
	var totalCombinationsMultiplier = 0;
	for (var i=0; i< startLength; i++) {
		 var oPair = aoStartingHands[i].oPair;
		 var actualPairs = aoStartingHands[i].aPair;;//now we have an array of villain's starting hands
		 allStartingPairs.push(actualPairs);
		 totalCombinationsMultiplier += actualPairs.length;
	}
	
	var approxTotalComb = totalCombinations * totalCombinationsMultiplier;
	
	/********** LOOP THROUGH PAIRS ************/
	
	var iCountWon =  0;
	var iCountLost = 0;
	var iCountDraw = 0;
	
	var oHandStatDic = {};
	var oVillainStaticDic = {};
	
	var oResultsCache ={}; //results cache
	
	var startingHandLengths = aoStartingHands.length;
	for (var iVillainPair = startingHandLengths-1; iVillainPair >= 0; iVillainPair--) {
			//get the villain pair
			var oPair = aoStartingHands[iVillainPair].oPair;
			var oPairArray = fFilterCardPairArray(aoStartingHands[iVillainPair].aPair,aKnownCards);
						
			
			var iWonMagnitude =0;	
	
			var iWinCountLocal = 0;
			var iDrawCountLocal = 0;
			var iLossCountLocal = 0;
			/****Loop through the pair array****/
			for(var i=0;i<oPairArray.length;i++){
				//evaluate villain hand		
				var oPair = oPairArray[i];
				var currentUnknown = fFilterCardArray(aUnknownCards,oPair);
				var aBoards = fCombinatorics(currentUnknown,numberOfOpenBoardHandPlaces);

				//prepare to loop through the boards
				if (aBoards.length ==0) {//board is full but we want to go once through the loop anyway {
					aBoards[0]=[];
				}
				
				
				var boardsLength = aBoards.length;
				//self.fPostConsole('board length ' + boardsLength);
				for (var iBoard = boardsLength-1; iBoard >=0; iBoard--) {
					//now loop t
					var aVillainHand = [];
					aVillainHand = oPair.concat(aFixedBoardCards).concat(aBoards[iBoard]);							
					var oVillainHand = fGetBestHand(aVillainHand);
					var aHeroCards = aKnownCards;
					aHeroCards = aHeroCards.concat(aBoards[iBoard]);
				
					//instead of this, loop through the pair objects themselves
					//if the pair has a flush possibility with the given board, loop through all boards
					//if the pair has no flush possibility with the given board, check it once against hero
					//then multiply the results time the number of pairs in the pair type (minus the number which contain dead cards)
					var oHeroHand = fGetBestHand(aHeroCards);
		
				
				
					var iWon = fCompareHand(oHeroHand,oVillainHand)*-1;		
					var sWon;
					iWinCountLocal = iWon>0 ? ++iWinCountLocal : iWinCountLocal;
					iDrawCountLocal = iWon===0 ? ++iDrawCountLocal : iDrawCountLocal;
					iLossCountLocal = iWon<0 ? ++iLossCountLocal : iLossCountLocal;	

					iCountWon = iWon>0 ? ++iCountWon : iCountWon;
					iCountDraw = iWon===0 ? ++iCountDraw : iCountDraw;
					iCountLost = iWon<0 ? ++iCountLost : iCountLost;
					numberDone ++;
					//iWonMagnitude ++;
					
					
					fAddToRecordDic(oVillainStaticDic, fHandToString(oVillainHand), -1*iWon, 1 );
					fAddToRecordDic(oHandStatDic, fHandToString(oHeroHand), iWon, 1, true );
					
				}//end board loop
				
			var currentPercent = numberDone / approxTotalComb;
	
			if(numberDone%1500===0) //only post 1500 rounds
				self.fPostProgress({iCountWon: iCountWon, iCountLost:iCountLost, iCountDraw:iCountDraw,total:numberDone, currentPercent:currentPercent});
	
		}//single pair hand loop
			
	}//end pair type loop
	
	var consoleStringReport = "";
	//fPostConsole("operation took " + (endTime - startTime)/1000.0 + 's' );
	self.fPostDone({iCountWon: iCountWon, iCountLost:iCountLost, iCountDraw:iCountDraw, total:numberDone, oHeroStat: oHandStatDic, oVillainStat: oVillainStaticDic});
}

var fLogCards = function(aCards, message) {
	if (!message)
		message = 0;
	var consoleMessage = message +' logged hand';
			for (var i=0; i< aCards.length; i++) {
				consoleMessage = consoleMessage + ' ' + fConvertRankToChar(aCards[i].rank) + fConvertSuitToUTF(aCards[i].suit) + ' '; 	
			}
	fPostConsole(consoleMessage);
}

var fCardsToKey = function(aCards) {
	var sReturn = 'k_';
	for (var i=0; i< aCards.length; i++) {
			sReturn = sReturn + fConvertRankToChar(aCards[i].rank)+ aCards[i].suit; 	
	}
	return sReturn;
}

var fLogPairs = function(aPairs, message) {
	if (!message)
		message = 0;
	var consoleMessage = message +' logged hand';
			for (var i=0; i< aPairs.length; i++) {
				consoleMessage = consoleMessage + ' ' + fConvertRankToChar(aPairs[i][0].rank) + fConvertSuitToUTF(aPairs[i][0].suit) + ' '
				+ fConvertRankToChar(aPairs[i][1].rank) + fConvertSuitToUTF(aPairs[i][1].suit); 	
			}
	fPostConsole(consoleMessage);
}



var fAddToRecordDic = function(oHandStatDic, sHandString, iWon, magnitude, bHero) {
		if (typeof (oHandStatDic[sHandString]) == 'undefined') {
			oHandStatDic[sHandString] = {};
			oHandStatDic[sHandString].wonCount =0;
			oHandStatDic[sHandString].drawCount = 0;		
			oHandStatDic[sHandString].lossCount = 0;
		}
		//if(isNaN(magnitude) || isNaN(iWon) || typeof(sHandString) == 'undefined' || ! isNaN(parseInt(sHandString)))
		//	fPostConsole('SOMETHING WENT WRONG');
		//oHandStatDic[fHandToString(oHeroHand)].count++;
		if (iWon>0)
			oHandStatDic[sHandString].wonCount +=magnitude;
		else if(iWon===0)
			oHandStatDic[sHandString].drawCount+= magnitude;
		else
			oHandStatDic[sHandString].lossCount+= magnitude;
		
}


var fGetStartingHandsFromRangeArray = function(allStartingPairs, aKnownHands){
	var filteredStartingPairs = [];
	var startLength =allStartingPairs.length;
	for (var i=0; i<startLength; i++) {
		var oPair = fGetCardPairFromString(allStartingPairs[i]);
		var actualPairs = fGetCardArrayFromPair(oPair,aKnownHands);
		//this is multidimensional array
		filteredStartingPairs = filteredStartingPairs.concat(actualPairs); //fPushArrayMultiDim = function(parentArray, childArray)
	}
	return filteredStartingPairs;	
}

//remove known board cards from pair array
var fFilterCardPairArray = function(pairArray,aKnown) {
	var cardArrayLength = pairArray.length;
	var aKnownLength = aKnown.length;
	var returnArray =[]
	for(i=0;i<pairArray.length;i++){
		var pair = pairArray[i];
		var card1 = pair[0];
		var card2 = pair[1];
		var bCardOk = true;
		for (j=0; j<aKnownLength;j++) {
			var known = aKnown[j];
			if (((known.suit == card1.suit) && (known.rank == card1.rank))||
				((known.suit == card2.suit) && (known.rank == card2.rank))) {
				bCardOk = false;
				break;
			}
		}
		if (bCardOk)
			returnArray.push(pair);
	}
	return returnArray;
}

var fFilterCardArray = function(cardArray,aKnown) {
	var cardArrayLength = cardArray.length;
	var aKnownLength = aKnown.length;
	var returnArray =[]
	for(i=0;i<cardArray.length;i++){
		var card = cardArray[i];
		var bCardOk = true;
		for (j=0; j<aKnownLength;j++) {
			var known = aKnown[j];
			if (((known.suit == card.suit) && (known.rank == card.rank))) {
				bCardOk = false;
				break;
			}
		}
		if (bCardOk)
			returnArray.push(card);
	}
	return returnArray;
}


var fPostConsole = function(sMessage) {
	  self.postMessage({type:'console', msg:sMessage});
}

var fPostDone = function(oData) {
	  self.postMessage({type:'done', msg:oData});
	  self.close(); // Terminates the worker. 
}

var fPostProgress = function(sMessage) {
	  self.postMessage({type:'progress', msg:sMessage});
}