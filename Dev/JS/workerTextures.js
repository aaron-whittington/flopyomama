var nsWorkerTextures ={};

self.addEventListener('message', function(e) {
  var data = e.data;
  switch (data.cmd) {
    case 'start':
	  
	  if(data.bMin) 
		importScripts("../lib/underscore/underscore-min.js", 'lib.min.js');
	  else
		importScripts("../lib/underscore/underscore-min.js",'Maths.js', 'Hand.js','DrawingHand.js','Convert.js','Filter.js','Util.js');
	
	  //self.postMessage({'command recieved start');
	  try {
		fPostConsole('STARTING TEXTURE WORKER');
		nsWorkerTextures.fCalculateBoards(data.aoStartingHands,data.aKnownCards, data.aFixedBoardCards, data.oFilter);
      }
	  catch(error) {
		fPostConsole('ERROR' +error.toString());
	  }
	  
	  break;
    case 'stop':
      self.close(); // Terminates the worker.
      break;
    default:
      self.postMessage('Unknown command: ' + data.msg);
  }
}, false);


nsWorkerTextures.fCalculateBoards = function (aoStartingHands,aKnownCards,aFixedBoardCards, oFilter) {		
	var startTime = new Date().getTime();
	var numberDone = 0;
	var oVillainStaticDic = {};
	var oPairLengthDic = {};
	var oFilterRecord = [];
	fPostConsole('TEST TEST TEST');
	//fPostConsole('TEST filter' + JSON.stringify(oFilter));
		var aCurrentKnown = aKnownCards;
		var startingHandLengths = aoStartingHands.length;
		for (var iVillainPair = startingHandLengths-1; iVillainPair >= 0; iVillainPair--) {
			//get the villain pair
			var oPair = aoStartingHands[iVillainPair].oPair;
			var sPair = aoStartingHands[iVillainPair].sPair;
			oFilterRecord[sPair]=[];
			
			var oPairArray = fFilterCardPairArray(aoStartingHands[iVillainPair].aPair,aCurrentKnown);
							
			var iPairLength = oPairArray.length;
			
			for(var i=0;i<oPairArray.length;i++){
						
						var aVillainHand = [];
						aVillainHand = oPairArray[i].concat(aFixedBoardCards);
						var oVillainHand;
						if (!oFilter) {
							var bHit = nsFilter.nsEvaluate.fEvaluateFilter(oFilter,aVillainHand); //this should actually return the drawing hand, so i don't have to evaluate it again
							if(!bHit) { //did not pass filter
								oFilterRecord[sPair].push(oPairArray[i]); 
								continue;
							}
							oVillainHand = nsFilter.nsEvaluate.oCurrentHand;
						}
						else 
							oVillainHand = nsDrawingHand.fGetDrawingHands(aVillainHand);
													
						var sVillainHand = nsDrawingHand.fHandToString(oVillainHand);
						
						var aSplit = sVillainHand.split("-");
	
						for (j=0; j< aSplit.length; j++) {
							aSplit[j] = aSplit[j].trim();
							nsWorkerTextures.fAddToRecordDic(oVillainStaticDic,aSplit[j] ,sPair); 
							numberDone++;
						}						
			}

			oPairLengthDic[sPair] = iPairLength;
	}		
	self.fPostDone({oVillainStat: oVillainStaticDic, count: numberDone, oPairLengthDic : oPairLengthDic, oFilterRecord: oFilterRecord});
};

nsWorkerTextures.fAddToRecordDic = function(oVillainStatDic, sHandString, sPairString, iPairCount) {
		if (typeof (oVillainStatDic[sHandString]) === 'undefined') {
			oVillainStatDic[sHandString] = {oPairRecord:{},count:0};			
		}
		
		if (typeof (oVillainStatDic[sHandString].oPairRecord[sPairString]) === 'undefined') {
			oVillainStatDic[sHandString].oPairRecord[sPairString] = 1;			
		}
		else {
			oVillainStatDic[sHandString].oPairRecord[sPairString]++; //track the pairs for each hand type	
		}
		
		oVillainStatDic[sHandString].count++;
};


var fPostConsole = function(sMessage) {
	  self.postMessage({type:'console', msg:sMessage});
};

var fPostDone = function(oData) {
	  self.postMessage({type:'done', msg:oData});
	  self.close(); // Terminates the worker. 
};

var fPostProgress = function(sMessage) {
	  self.postMessage({type:'progress', msg:sMessage});
};
