
importScripts('Maths.js', 'Hand.js','Convert.js');


self.addEventListener('message', function(e) {
  var data = e.data;
  switch (data.cmd) {
    case 'start':
	  //self.postMessage({'command recieved start');
	  fCalculateBoards(data.aStartingHandStrings,data.aKnownCards,data.aUnknownCards, data.aFixedBoardCards, data.numberOfOpenBoardHandPlaces);
      break;
    case 'stop':
      self.close(); // Terminates the worker.
      break;
    default:
      self.postMessage('Unknown command: ' + data.msg);
  };
}, false);


var fCalculateBoards = function (aStartingHandStrings,aKnownCards,aUnknownCards,aFixedBoardCards,numberOfOpenBoardHandPlaces) {		

	var totalCombinations = fNumberOfCombinations(aUnknownCards.length,numberOfOpenBoardHandPlaces)
	self.fPostConsole(' first starting hand string ' + aStartingHandStrings[0] + ' aknowncardslength ' + aKnownCards.length +
			' aUnknownCardslength ' + aUnknownCards.length + ' numberOfOpenBoardHandPlaced ' + numberOfOpenBoardHandPlaces +
			' aFixedBoardCards ' + aFixedBoardCards.length);

	var allStartingPairs=[];
	var startLength = aStartingHandStrings.length;
	for (var i=0; i< startLength; i++) {
		 var oPair = fGetCardPairFromString(aStartingHandStrings[i]);
		 var actualPairs = fGetCardArrayFromPair(oPair);//now we have an array of villain's starting hands
		 allStartingPairs.push(actualPairs);
	}
	
	 //self.postMessage('all opponent starting pairs ' + allStartingPairs.length);
	 //self.postMessage('starting pairs * possible board configs ' + totalCombinations * allStartingPairs.length);	
	var approxTotalComb = totalCombinations * allStartingPairs.length;
	//loop through all boards
		
		//self.fPostConsole('a unknown cards count ' + aUnknownCards.length);
		//self.fPostConsole('a unknown cards count ' + aUnknownCards.length);
	var aBoards = fCombinatorics(aUnknownCards,numberOfOpenBoardHandPlaces);
	//self.fPostConsole('getting here, boards length ');
	if (aBoards.length ==0) {//board is full but we want to go once through the loop anyway {
		aBoards[0]=[];
		//self.fPostConsole('boards length was zero, now '+ aBoards.length);
	}
	
	var iCountWon =  0;
	var iCountLost = 0;
	var iCountDraw = 0;
	var numberDone = 0;
	var oHandStatDic = {};
	
	var boardsLength = aBoards.length;
	for (var iBoard = boardsLength-1; iBoard >=0; iBoard--) {
		//now loop through each opponent hand for each board...we start at -1 for the case
		//won't get here when the board is all filled
		var aCurrentKnown = aKnownCards;
		aCurrentKnown = aCurrentKnown.concat(aBoards[iBoard]);
	
		//instead of this, loop through the pair objects themselves
		//if the pair has a flush possibility with the given board, loop through all boards
		//if the pair has no flush possibility with the given board, check it once against hero
		//then multiply the results time the number of pairs in the pair type (minus the number which contain dead cards)
		var oHeroHand = fGetBestHand(aCurrentKnown);
		var realBoard = aFixedBoardCards.concat(aBoards[iBoard]); //board without hero hand or villain hand
		var herosg = 'HERO HAND    ';
			for (var i=0; i< aCurrentKnown.length; i++) {
				herosg =  herosg + ' ' + fConvertRankToChar(aCurrentKnown[i].rank) + ' ' +fConvertSuitToUTF(aCurrentKnown[i].suit) + ' '; 
		}
		herosg = herosg + '  ' +fHandToString(oHeroHand);

		var iWonMagnitude; //numbe of won lost or drawn combinations
		var aRanges = fGetStartingHandsFromRangeArray(aStartingHandStrings,aCurrentKnown);
		var startingHandLengths = aStartingHandStrings.length;
		for (var iVillainPair = startingHandLengths-1; iVillainPair >= 0; iVillainPair--) {
			//get the villain pair
			var oPair = fGetCardPairFromString(aStartingHandStrings[iVillainPair]);
			var oPairArray = fGetCardArrayFromPair(oPair,aCurrentKnown);
			//check flush possibilities
			var minForFlush=4;
			if(oPair.suited)
				minForFlush=3;
			iWonMagnitude = oPair.comb;
			//count the max number of one suit on the board
			var aSuitNumbers = [0,0,0,0]; //num of clubs, num of diamonds, num of hearts, num of spaids
			//now we have to get the real board instead of the board without the known cards
		
			for (var i=0; i< realBoard.length; i++) {
				aSuitNumbers[realBoard[i].suit-1]++;
			}
			aSuitNumbers.sort(fBigIntFist);
			if (aSuitNumbers[0] < minForFlush && oPairArray.length>0){ //now we don't have to look for flushes, checking the first pair of his suffices
				var aVillainHand = [];
				aVillainHand = oPairArray[0].concat(aFixedBoardCards).concat(aBoards[iBoard]);	
				var oVillainHand = fGetBestHand(aVillainHand);	
				//self.fPostConsole("evaluating board without flush possibility");
				//numberDone += iWonMagnitude;
			
				var iWon = fCompareHand(oHeroHand,oVillainHand);
					var sWon;
				if(iWon >0) {
					iCountWon+=iWonMagnitude;
					sWon = 'Won';
				}
				else if(iWon ==0){
					iCountDraw+= iWonMagnitude;
					sWon = 'Draw';
				}
				else {
					iCountLost+= iWonMagnitude;
					sWon = 'Loss';
				}
			}
			else {//now we have to evaluate flushes
				for(i=0;i<oPairArray.length;i++){
				//evaluate villain hand
					var aVillainHand = [];
					aVillainHand = oPairArray[i].concat(aFixedBoardCards).concat(aBoards[iBoard]);							
					var oVillainHand = fGetBestHand(aVillainHand);				
					var iWon = fCompareHand(oHeroHand,oVillainHand);		
					var sWon;
					if(iWon >0) {
						iCountWon++;
						sWon = 'Won';
					}
					else if(iWon ==0){
						iCountDraw++;
						sWon = 'Draw';
					}
					else {
						iCountLost++;
						sWon = 'Loss';
					}
				}
			}
			//self.fPostConsole();
			/*var consoleMessage = 'VILLAIN HAND ';
			for (var i=0; i< aVillainHand.length; i++) {
				consoleMessage = consoleMessage + ' ' + fConvertRankToChar(aVillainHand[i].rank) +' ' + fConvertSuitToUTF(aVillainHand[i].suit) + ' '; 	
			}
				consoleMessage = consoleMessage + sWon + '  ' +fHandToString(oVillainHand);
			self.fPostConsole(consoleMessage);
			*/
			
			
			
			/*if (typeof (oHandStatDic[fHandToString(oHeroHand)]) == 'undefined') {
				oHandStatDic[fHandToString(oHeroHand)] = {};
				oHandStatDic[fHandToString(oHeroHand)].wonCount =0;
				oHandStatDic[fHandToString(oHeroHand)].drawCount = 0;		
				oHandStatDic[fHandToString(oHeroHand)].lossCount = 0;
			}
			//oHandStatDic[fHandToString(oHeroHand)].count++;
			if (iWon>0)
				oHandStatDic[fHandToString(oHeroHand)].wonCount +=iWonMagnitude;
			else if(iWon==0)
				oHandStatDic[fHandToString(oHeroHand)].drawCount+= iWonMagnitude;
			else
				oHandStatDic[fHandToString(oHeroHand)].lossCount+= iWonMagnitude;
			*/
			
			var currentPercent = numberDone / approxTotalComb;
			
			if(numberDone%50===0) //only post every 50 rounds
				self.fPostProgress(currentPercent * 100.0);
				
			numberDone+= oPairArray.length;	
			//if(numberDone >10000)
				//break;
		}
	}
	var consoleStringReport = "";
	/*for (prop in oHandStatDic)
		consoleStringReport = consoleStringReport + '  ' + prop + ' wins ' + oHandStatDic[prop].wonCount +
			' losses ' + oHandStatDic[prop].lossCount + ' draws ' + oHandStatDic[prop].drawCount + '	';*/
	self.fPostConsole(consoleStringReport);
	self.fPostConsole('total win count: ' + iCountWon + ' total loss count: ' + iCountLost + ' total draw count: ' +iCountDraw);
	self.fPostConsole('total win %: ' + iCountWon/numberDone + ' total loss %: ' + iCountLost/numberDone + ' total draw %: ' +iCountDraw/numberDone);
	self.fPostDone();
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

var fPostConsole = function(sMessage) {
	  self.postMessage({type:'console', msg:sMessage});
}

var fPostDone = function() {
	  self.postMessage({type:'done'});
	  self.close(); // Terminates the worker.
  
}

var fPostProgress = function(sMessage) {
	  self.postMessage({type:'progress', msg:sMessage});
}