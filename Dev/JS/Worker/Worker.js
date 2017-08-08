
var nsWorker = {};

self.addEventListener('message', function(e) {
    var data = e.data;
    switch (data.cmd) {
        case 'start':
            //self.postMessage({'command recieved start');
            importScripts("../Lib/underscore/underscore-min.js", '../Core/Math.js', '../Core/Hand.js', '../Core/Convert.js');


            nsWorker.fCalculateBoards(data.aoStartingHands, data.aKnownCards, data.aUnknownCards, data.aFixedBoardCards, data.numberOfOpenBoardHandPlaces, data.oFilter);
            break;
        case 'stop':
            self.close(); // Terminates the worker.
            break;
        default:
            self.postMessage('Unknown command: ' + data.msg);
    }
}, false);

//aoStartingHands = array of CardPair objects (like AAs)
nsWorker.fCalculateBoards = function(aoStartingHands, aKnownCards, aUnknownCards, aFixedBoardCards, numberOfOpenBoardHandPlaces, oFilter) {

    self.fPostConsole("STARTING HANDS: " + JSON.stringify(aoStartingHands));
    self.fPostConsole("KNOWN CARDS: " + JSON.stringify(aKnownCards));
    self.fPostConsole("UNKNOWN CARDS: " + JSON.stringify(aUnknownCards));
    self.fPostConsole("FIXED BOARD CARDS: " + JSON.stringify(aFixedBoardCards));
    self.fPostConsole("NUMBER OF OPEN BOARD PLACES " + JSON.stringify(numberOfOpenBoardHandPlaces));

    var startTime = new Date().getTime();
    var totalCombinations = fNumberOfCombinations(aUnknownCards.length, numberOfOpenBoardHandPlaces);
    var numberDone = 0;

    var oNsHand = nsHand;
    //calculate length of operation
    var allStartingPairs = [];
    var startLength = aoStartingHands.length;
    var totalCombinationsMultiplier = 0;
    var oPair, i;

    for (i = 0; i < startLength; i++) {
        oPair = aoStartingHands[i].oPair;
        var actualPairs = aoStartingHands[i].aPair; //now we have an array of villain's starting hands
        allStartingPairs.push(actualPairs);
        totalCombinationsMultiplier += actualPairs.length;
    }

    var approxTotalComb = totalCombinations * totalCombinationsMultiplier / 1.14; //from empirical testing 1.139

    //var combinatoricsStartTime= new Date().getTime(); COMBINATORICS FAST
    var aBoards = nsMath.combine(aUnknownCards, numberOfOpenBoardHandPlaces);

    if (aBoards.length === 0) { //board is full but we want to go once through the loop anyway {
        aBoards[0] = [];
    }

    var iCountWon = 0,
        iCountLost = 0,
        iCountDraw = 0;

    var oHandStatDic = {};
    var oVillainStaticDic = {};

    var oResultsCache = {}; //results cache

    var boardsLength = aBoards.length;

    //self.fPostConsole('board length ' + boardsLength);
    for (var iBoard = boardsLength - 1; iBoard >= 0; iBoard--) {
        //now loop through each opponent hand for each board
        var aCurrentKnown = aKnownCards;
        aCurrentKnown = aCurrentKnown.concat(aBoards[iBoard]);

        //instead of this, loop through the pair objects themselves
        //if the pair has a flush possibility with the given board, loop through all boards
        //if the pair has no flush possibility with the given board, check it once against hero
        //then multiply the results time the number of pairs in the pair type (minus the number which contain dead cards)
        var oHeroHand = oNsHand.fGetBestHand(aCurrentKnown);

        var realBoard = aFixedBoardCards.concat(aBoards[iBoard]); //board after concating speculative board 
        var aVillainHand, oVillainHand, iWon;

        var iWonMagnitude, sPair; //numbe of won lost or drawn combinations

        var startingHandLengths = aoStartingHands.length;

        var boardFlushPossibility;

        for (var iVillainPair = startingHandLengths - 1; iVillainPair >= 0; iVillainPair--) {
            //get the villain pair
            oPair = aoStartingHands[iVillainPair].oPair;
            sPair = aoStartingHands[iVillainPair].sPair;

            var oPairArray = fFilterCardPairArray(aoStartingHands[iVillainPair].aPair, aCurrentKnown, oFilter[sPair]);

            boardFlushPossibility = nsWorker.getFlushSuitAndNumber(realBoard, oPair);

            //split oPairArray into those which can hit flush and those which cannot
            var oPairCanHitFlush = [];
            var oPairCannotHitFlush = [];
            var oPairLength = oPairArray.length;
            for (i = 0; i < oPairLength; i++) {
                var pair = oPairArray[i];
                var numberOfSuit = 0;
                if (pair[0].suit === boardFlushPossibility.flushSuit)
                    numberOfSuit++;
                if (pair[1].suit === boardFlushPossibility.flushSuit)
                    numberOfSuit++;

                if (numberOfSuit + boardFlushPossibility.numberFound >= 5) //flush there
                    oPairCanHitFlush.push(pair);
                else
                    oPairCannotHitFlush.push(pair); //for test only pair can hit flush
            }

            iWonMagnitude = 0;

            var iWinCountLocal = 0,
                iDrawCountLocal = 0,
                iLossCountLocal = 0;

            if (oPairCannotHitFlush.length > 0) { //now we don't have to look for flushes, checking the first pair of this suffices

                //standardize all 7 cards
                iWonMagnitude = oPairCannotHitFlush.length;

                aVillainHand = [];
                aVillainHand = oPairCannotHitFlush[0].concat(aFixedBoardCards).concat(aBoards[iBoard]);

                oVillainHand = oNsHand.fGetBestHand(aVillainHand);
                if (typeof oVillainHand === "undefined")
                    fLogCards(aVillainHand, 'Something went wrong here 135');

                iWon = oNsHand.fCompareHand(oHeroHand, oVillainHand) * -1;
                iWinCountLocal = iWon > 0 ? iWonMagnitude : iWinCountLocal;
                iDrawCountLocal = iWon === 0 ? iWonMagnitude : iDrawCountLocal;
                iLossCountLocal = iWon < 0 ? iWonMagnitude : iLossCountLocal;

                iCountWon += iWinCountLocal;
                iCountDraw += iDrawCountLocal;
                iCountLost += iLossCountLocal;
                numberDone += iWonMagnitude;

                fAddToRecordDic(oVillainStaticDic, oNsHand.fHandToString(oVillainHand), -1 * iWon, iWonMagnitude);
                fAddToRecordDic(oHandStatDic, oNsHand.fHandToString(oHeroHand), iWon, iWonMagnitude, true);


            } //now loop through those which do hit flush

            for (i = 0; i < oPairCanHitFlush.length; i++) {
                //evaluate villain hand

                aVillainHand = [];
                aVillainHand = oPairCanHitFlush[i].concat(aFixedBoardCards).concat(aBoards[iBoard]);
                oVillainHand = oNsHand.fGetBestHand(aVillainHand);

                iWon = oNsHand.fCompareHand(oHeroHand, oVillainHand) * -1;
                iWinCountLocal = iWon > 0 ? ++iWinCountLocal : iWinCountLocal;
                iDrawCountLocal = iWon === 0 ? ++iDrawCountLocal : iDrawCountLocal;
                iLossCountLocal = iWon < 0 ? ++iLossCountLocal : iLossCountLocal;

                iCountWon = iWon > 0 ? ++iCountWon : iCountWon;
                iCountDraw = iWon === 0 ? ++iCountDraw : iCountDraw;
                iCountLost = iWon < 0 ? ++iCountLost : iCountLost;
                numberDone++;

                fAddToRecordDic(oVillainStaticDic, oNsHand.fHandToString(oVillainHand), -1 * iWon, 1);
                fAddToRecordDic(oHandStatDic, oNsHand.fHandToString(oHeroHand), iWon, 1, true);

            }
        }
        var currentPercent = numberDone / approxTotalComb;

        if (numberDone % 500 === 0) //only post 1500 rounds
            self.fPostProgress({
                iCountWon: iCountWon,
                iCountLost: iCountLost,
                iCountDraw: iCountDraw,
                total: numberDone,
                currentPercent: currentPercent
            });

    }

    var endTime = new Date().getTime();
    var consoleStringReport = "";
    fPostConsole("operation took " + (endTime - startTime) / 1000.0 + 's');
    fPostConsole("approximation of total " + approxTotalComb + ' real total ' + numberDone);
    self.fPostDone({
        iCountWon: iCountWon,
        iCountLost: iCountLost,
        iCountDraw: iCountDraw,
        total: numberDone,
        oHeroStat: oHandStatDic,
        oVillainStat: oVillainStaticDic
    });
};

var fLogCards = function(aCards, message) {
    if (!message)
        message = 0;
    var consoleMessage = message + ' logged hand';
    for (var i = 0; i < aCards.length; i++) {
        consoleMessage = consoleMessage + ' ' + nsConvert.rankNumberToChard(aCards[i].rank) + nsConvert.suitToDisplayChar(aCards[i].suit) + ' ';
    }
    fPostConsole(consoleMessage);
};

var fCardsToKey = function(aCards) {
    var sReturn = 'k_';
    for (var i = 0; i < aCards.length; i++) {
        sReturn = sReturn + nsConvert.rankNumberToChard(aCards[i].rank) + aCards[i].suit;
    }
    return sReturn;
};

var fLogPairs = function(aPairs, message) {
    if (!message)
        message = 0;
    var consoleMessage = message + ' logged hand';
    for (var i = 0; i < aPairs.length; i++) {
        consoleMessage = consoleMessage + ' ' + nsConvert.rankNumberToChard(aPairs[i][0].rank) +
            nsConvert.suitToDisplayChar(aPairs[i][0].suit) + ' ' +
            nsConvert.rankNumberToChard(aPairs[i][1].rank) + nsConvert.suitToDisplayChar(aPairs[i][1].suit);
    }
    fPostConsole(consoleMessage);
};

var fAddToRecordDic = function(oHandStatDic, sHandString, iWon, magnitude, bHero) {
    if (typeof(oHandStatDic[sHandString]) === 'undefined') {
        oHandStatDic[sHandString] = {};
        oHandStatDic[sHandString].wonCount = 0;
        oHandStatDic[sHandString].drawCount = 0;
        oHandStatDic[sHandString].lossCount = 0;
    }
    //if(isNaN(magnitude) || isNaN(iWon) || typeof(sHandString) === 'undefined' || ! isNaN(parseInt(sHandString)))
    //	fPostConsole('SOMETHING WENT WRONG');
    //oHandStatDic[fHandToString(oHeroHand)].count++;
    if (iWon > 0)
        oHandStatDic[sHandString].wonCount += magnitude;
    else if (iWon === 0)
        oHandStatDic[sHandString].drawCount += magnitude;
    else
        oHandStatDic[sHandString].lossCount += magnitude;

};

var fGetStartingHandsFromRangeArray = function(allStartingPairs, aKnownHands) {
    var filteredStartingPairs = [];
    var startLength = allStartingPairs.length;
    var oPair, actualPairs;
    for (var i = 0; i < startLength; i++) {
        oPair = new Pair(pairString);
        actualPairs = oPair.toArray(aKnownHands);
        //this is multidimensional array
        filteredStartingPairs = filteredStartingPairs.concat(actualPairs);
    }
    return filteredStartingPairs;
};


var fPostConsole = function(sMessage) {
    self.postMessage({
        type: 'console',
        msg: sMessage
    });
};

var fPostDone = function(oData) {
    self.postMessage({
        type: 'done',
        msg: oData
    });
    // self.close(); // Terminates the worker. BREAKS FIREFOX
};

var fPostProgress = function(sMessage) {
    self.postMessage({
        type: 'progress',
        msg: sMessage
    });
};

//return array [num clubs, diamnds, hearts, spaids 
nsWorker.getSuitNumbers = function(board) {
    //count the max number of one suit on the board
    var aSuitNumbers = [0, 0, 0, 0]; //num of clubs, num of diamonds, num of hearts, num of spaids
    //now we have to get the real board instead of the board without the known cards
    var boardLength = board.length;

    for (i = 0; i < boardLength; i++) {
        aSuitNumbers[board[i].suit - 1]++;
    }

    return aSuitNumbers;
};

//check flush possibilities
nsWorker.getFlushSuitAndNumber = function(board, oPair) {
    var aSuitNumbers = nsWorker.getSuitNumbers(board);

    var minForFlush = 4;

    if (oPair.suited)
        minForFlush = 3;

    //find the flush suit
    var flushSuit = -1;
    var foundHowManyOfSuit = 0;
    for (i = 3; i >= 0; i--) {
        if (aSuitNumbers[i] >= minForFlush) {
            flushSuit = i + 1;
            foundHowManyOfSuit = aSuitNumbers[i];
        }
    }

    return {
        flushSuit: flushSuit,
        numberFound: foundHowManyOfSuit
    };
};
