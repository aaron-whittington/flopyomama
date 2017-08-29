$ = require('jquery');
Pair = require('../Pair/Pair');
sklanskyRanges = require('./RangeScaleSklansky');
procentualRanges = require('./RangeScaleProcentual'); 
poker = require('../Constants/Poker');
nsFilter = require('../Filter/Filter');
nsUtil = require('../Core/Util');
work = require('webworkify');
nsPrefs = require('../Settings/Preferences');
nsConvert = require('../Core/Convert');

nsRange = {};

nsRange.getSlanskyFromPercent = function(fPercent) {
    var aReturn = [];
    var iHandsAdded = 0;
    for (var sklanskyRange = 1; sklanskyRange < sklanskyRanges.length; sklanskyRange++) {
        for (var iHand = 0; iHand < sklanskyRanges[sklanskyRange].length; iHand++) {
            var nextHand = sklanskyRanges[sklanskyRange][iHand];
            var oPair = new Pair(nextHand);
            iHandsAdded += oPair.get("comb");

            if (iHandsAdded / poker.TOTAL_STARTING_COMBINATIONS < fPercent) {
                aReturn.push(nextHand);
            } else
                return aReturn;
        }
    }
    return aReturn;
};

nsRange.getStatisticalFromPercent = function(fPercent) {
    var aReturn = [];
    var iHandsAdded = 0;
    var lastEquity = 0;
    for (var i = 0; i < procentualRanges.aStatData.length; i++) {
        var hand = procentualRanges.aStatData[i].sPair;
        var oPair = new Pair(hand);
        iHandsAdded += oPair.get("comb");
        if (oPair.get("suited") === false && oPair.get("rank1") !== oPair.get("rank2"))
            hand = hand[0] + hand[1] + 'o'; //add offsuit symbol
        if (iHandsAdded / poker.TOTAL_STARTING_COMBINATIONS <= fPercent) {

            aReturn.push(hand);
            lastEquity = procentualRanges.aStatData[i].flEq;
        } else if (lastEquity === procentualRanges.aStatData[i].flEq) //when the equity is the same add them all (actually we should check this...)
            aReturn.push(hand);
        else
            return aReturn;

    }
    return aReturn;
};

nsRange.aCurrentWorkers = [];

nsRange.fKillCurrentWorkers = function() {
    for (var i = 0; i < nsRange.aCurrentWorkers.length; i++) {
        nsRange.aCurrentWorkers[i].terminate();
        nsRange.aCurrentWorkers[i] = null; //maybe help on firefox
    }
    nsRange.aCurrentWorkers = [];
};

nsRange.calculateDataForLegs = function(knownCards) {
    //not sure i need this
    nsRange.fKillCurrentWorkers();
    var legRecord = knownCards.getBoardState();

    if(legRecord.bHand) {
        //special case, get average for player hand, persaved odds 
    }

    if(legRecord.bFlop) {
        nsRange.fGetTextures(knownCards, true, poker.FLOP);
    }

    if(legRecord.bTurn) {
        nsRange.fGetTextures(knownCards, true, poker.TURN);
    }

    if(legRecord.bRiver) {
        //TODO: here textures actually contain win rate, so this is inefficient
        nsRange.fGetTextures(knownCards, true, poker.RIVER);
    }
} 

nsRange.fGetAllUnknownCombinationsThreaded = function(knownCards, oFilterRecord, leg) {

    $('.no_results').remove();
    //changed from 4, because we now have multiple workers anyway
    var MAX_WORKERS = 1;
    var workerDoneCount = 0;
    var lastUpdatePercent = 0;
    if (typeof(Worker) === "undefined") {
        alert('Browser must support webworkers!');
        return;
    }

    var aoStartingHands = nsRange.fGetStartingHandsFromRangeGrid();

    var aKnownCards = knownCards.allKnown(true, leg);
    var aUnknownCards = knownCards.allUnknown(true, leg);
    var aFixedBoardCards = aKnownCards.slice(2);
    
    var numberOfOpenBoardHandPlaces = 7 - aKnownCards.length;

    var oDoneRecord = {
        iCountWon: 0,
        iCountLost: 0,
        iCountDraw: 0,
        total: 0
    };
    var oHeroStat = {};
    var oVillainStat = {};

    var fStartWorker = function(aSplitStartingHands) {

        var state = window.history.state;

        var worker = new work(require('../Worker/Worker'));

        nsRange.aCurrentWorkers.push(worker);
        
        worker.postMessage({
            'cmd': 'start',
            'msg': '',
            aoStartingHands: aSplitStartingHands,
            aKnownCards: aKnownCards,
            aUnknownCards: aUnknownCards,
            numberOfOpenBoardHandPlaces: numberOfOpenBoardHandPlaces,
            aFixedBoardCards: aFixedBoardCards,
            oFilter: oFilterRecord,
            bMin: false
        });

        worker.addEventListener('message', function(e) {
            if (e.data.type === 'progress') {
               
                lastUpdatePercent = e.data.msg;
                
                totalWonPer = e.data.msg.iCountWon / e.data.msg.total * 100.0 * e.data.msg.currentPercent; //here we'd have to divide by total number
                totalDrawPer = e.data.msg.iCountDraw / e.data.msg.total * 100.0 * e.data.msg.currentPercent;
                totalLossPer = e.data.msg.iCountLost / e.data.msg.total * 100.0 * e.data.msg.currentPercent;
                
                //here we used to set the progress bar, now we may set partial data
                //in other places
            }

            if (e.data.type === 'console')
                nsUtil.fLog(e.data.msg);
            if (e.data.type === 'done') {
                workerDoneCount++;
                var oResult = e.data.msg;
                oDoneRecord.iCountWon += oResult.iCountWon;
                oDoneRecord.iCountLost += oResult.iCountLost;
                oDoneRecord.iCountDraw += oResult.iCountDraw;
                oDoneRecord.total += oResult.total;

                oHeroStat = nsUtil.combineObjects(oResult.oHeroStat, oHeroStat, function(a, b) {
                    if (typeof a === "undefined")
                        a = {
                            lossCount: 0,
                            wonCount: 0,
                            drawCount: 0
                        };
                    if (typeof b === "undefined")
                        b = {
                            lossCount: 0,
                            wonCount: 0,
                            drawCount: 0
                        };
                    return nsUtil.combineObjects(a, b, function(a, b) {
                        return a + b;
                    });
                });

                oVillainStat = nsUtil.combineObjects(oResult.oVillainStat, oVillainStat, function(a, b) {
                    if (typeof a === "undefined")
                        a = {
                            lossCount: 0,
                            wonCount: 0,
                            drawCount: 0
                        };
                    if (typeof b === "undefined")
                        b = {
                            lossCount: 0,
                            wonCount: 0,
                            drawCount: 0
                        };
                    return nsUtil.combineObjects(a, b, function(a, b) {
                        return a + b;
                    });
                });


                if (workerDoneCount === MAX_WORKERS) {
                    //$('#results_progress').trigger('done');
                    var totalWonPer = oDoneRecord.iCountWon / oDoneRecord.total * 100.0;
                    var totalLossPer = oDoneRecord.iCountLost / oDoneRecord.total * 100.0;
                    var totalDrawPer = oDoneRecord.iCountDraw / oDoneRecord.total * 100.0;

                    //get leg key 
                    var key = nsConvert.streetConstantToString(leg);
                    knownCards.models.streets[key].setWinLossDraw(totalWonPer, totalLossPer, totalDrawPer);
                    if (oDoneRecord.total === 0) {
                        return;
                    }
                }
            }
        }, false);
    }; //end fStartWorker

    var startHandL = aoStartingHands.length;
    var handsPerWorker = Math.floor(startHandL / MAX_WORKERS) + 1;

    nsUtil.fLog('start hand length ' + startHandL);
    for (var i = 0; i < MAX_WORKERS; i++) {
        var start = i === 0 ? 0 : i * handsPerWorker;
        var end = start + handsPerWorker;
        var aHandWorkerRange = aoStartingHands.slice(start, end);
        fStartWorker(aHandWorkerRange);
    }
};

nsRange.fGetTextures = function(knownCards, getAllUnknown, leg) {
    if (typeof(Worker) === "undefined") {
        alert('Browser must support webworkers!');
        return;
    }

    var aoStartingHands = nsRange.fGetStartingHandsFromRangeGrid();
    var aKnownCards = knownCards.allKnown(true, leg);
    var aFixedBoardCards = aKnownCards.slice(2); 

    var oFilter = nsFilter.fActiveFilter(null, true);

    var fStartWorker = function() {

        var worker = new work(require('../Worker/WorkerTextures'));

        worker.addEventListener('message', function(e) {
            if (e.data.type === 'console')
                nsUtil.fLog(e.data.msg);
            if (e.data.type === 'done') {
                var oResult = e.data.msg;

                nsFilter.fClearFilter();
                nsFilter.fDrawFilterToBoard(oResult.oFilterRecord);

                var key = nsConvert.streetConstantToString(leg);

                knownCards.models.streets[key].setTextures(oResult);
                
                if(getAllUnknown) {
                    nsRange.fGetAllUnknownCombinationsThreaded(knownCards, oResult.oFilterRecord, leg);
                }
            }
        }, false);

        worker.postMessage({
            'cmd': 'start',
            'msg': '',
            aoStartingHands: aoStartingHands,
            aKnownCards: aKnownCards,
            aFixedBoardCards: aFixedBoardCards,
            oFilter: oFilter,
            bMin: false
        });
    }; //end fStartWorker

    fStartWorker();
};

nsRange.getStartingHandStrings = function() {
    var allStartingPairs = [];
    var jqSelected = $("#op_range_table .selected>.inner_pair").each(function() {
        allStartingPairs.push($(this).html());
    });
    return allStartingPairs;
};

nsRange.fGetStartingHandsFromRangeGrid = function(bAll) {
    var allStartingPairs = [];
    var selector = "#op_range_table td.selected";
    if (bAll === true)
        selector = "#op_range_table td";
    var jqSelected = $(selector).each(function() {
        var pairString = $(this).attr('id').split('_')[2]; //$(this).html();
        var oPair = new Pair(pairString);
        var actualPairs = oPair.toArray();
        allStartingPairs.push({
            oPair: oPair,
            aPair: actualPairs,
            sPair: pairString
        });
    });
    return allStartingPairs;
};

module.exports = nsRange;
