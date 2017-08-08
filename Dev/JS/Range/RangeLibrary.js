$ = require('jquery');
Pair = require('../Pair/Pair');
sklanskyRanges = require('./RangeScaleSklansky');
procentualRanges = require('./RangeScaleProcentual'); 
poker = require('../Constants/Poker');
nsFilter = require('../Filter/Filter');
nsUtil = require('../Core/Util');
work = require('webworkify');

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


nsRange.fGetAllUnknownCombinationsThreaded = function(knownCards) {

    $('.no_results').remove();
    var MAX_WORKERS = 4;
    var workerDoneCount = 0;
    var lastUpdatePercent = 0;
    if (typeof(Worker) === "undefined") {
        alert('Browser must support webworkers!');
        return;
    }

    nsRange.fKillCurrentWorkers();

    var aoStartingHands = nsRange.fGetStartingHandsFromRangeGrid();

    var aKnownCards = knownCards.allKnown(true);
    var aUnknownCards = knownCards.allUnknown(true);
    var aFixedBoardCards = knownCards.get('board').map(function(m) {
        return m.attributes;
    });
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
        if (state !== null) {
            var test = state.valueOf();
            var test2 = state.toString();

        }
        var worker = new work(require('../Worker/Worker'));

        nsRange.aCurrentWorkers.push(worker);

        worker.addEventListener('message', function(e) {
            if (e.data.type === 'progress') {
                //$('#results_progress>div').css("width",e.data.msg + "%"); 
                lastUpdatePercent = e.data.msg;
                //{iCountWon: iCountWon, iCountLost:iCountLost, iCountDraw:iCountDraw,total:numberDone})
                totalWonPer = e.data.msg.iCountWon / e.data.msg.total * 100.0 * e.data.msg.currentPercent; //here we'd have to divide by total number
                totalDrawPer = e.data.msg.iCountDraw / e.data.msg.total * 100.0 * e.data.msg.currentPercent;
                totalLossPer = e.data.msg.iCountLost / e.data.msg.total * 100.0 * e.data.msg.currentPercent;
                $('#win_percent_bar div').each(function(i) {
                    if (i === 0)
                        $(this).css('width', totalWonPer + '%');
                    if (i === 1)
                        $(this).css('width', totalDrawPer + '%');
                    if (i === 2)
                        $(this).css('width', totalLossPer + '%');

                });
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
                //self.fPostDone({iCountWon: iCountWon, iCountLost:iCountLost, iCountDraw:iCountDraw,total:numberDone});

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
                    $('#win_percent_bar').trigger('done');
                    var totalWonPer = oDoneRecord.iCountWon / oDoneRecord.total * 100.0;
                    var totalLossPer = oDoneRecord.iCountLost / oDoneRecord.total * 100.0;
                    var totalDrawPer = oDoneRecord.iCountDraw / oDoneRecord.total * 100.0;
                    nsUtil.fLog('total win count: ' + oDoneRecord.iCountWon +
                        ' total loss count: ' + oDoneRecord.iCountLost + ' total draw count: ' + i + oDoneRecord.iCountDraw);
                    nsUtil.fLog('total win %: ' + totalWonPer +
                        ' total loss %: ' + totalLossPer + ' total draw %: ' +
                        totalDrawPer);


                    if (oDoneRecord.total === 0) {
                        var nothingFound = '<p class="no_results">All results filtered out.</p>';
                        $('#hero_stat').html(nothingFound);
                        $('#villain_stat').html(nothingFound);
                        $('#textures').html(nothingFound); //should actually be done in the textures method
                        return;
                    }

                    nsHtml.fSetMainStatBar(totalWonPer, totalDrawPer, totalLossPer);

                    var graphPref = nsPrefs.oGraphType.fGet();
                    if (graphPref === nsPrefs.nsConst.BAR_GRAPHS) {
                        var heroStatHtml = ""; //"<row><h4>Hero Results</h4></row>";
                        heroStatHtml += nsHtml.fGetResultStatHtml(oHeroStat, oDoneRecord);

                        var villainStatHtml = ""; //"</row><h4>Villain Results</h4></row>"; //todo fix boilerplate code
                        villainStatHtml += nsHtml.fGetResultStatHtml(oVillainStat, oDoneRecord);

                        $('#hero_stat').html(heroStatHtml);
                        $('#villain_stat').html(villainStatHtml);
                        nsHtml.fInitResultPopovers();
                    } else if (graphPref === nsPrefs.nsConst.PIE_GRAPHS) {
                        nsHtml.fDrawResultsStatPie(oHeroStat, oDoneRecord, 'hero_stat');
                        nsHtml.fDrawResultsStatPie(oVillainStat, oDoneRecord, 'villain_stat');
                    }


                }
            }
            nsUtil.fLog('message received: ' + JSON.stringify(e.data));
        }, false);

        worker.postMessage({
            'cmd': 'start',
            'msg': '',
            aoStartingHands: aSplitStartingHands,
            aKnownCards: aKnownCards,
            aUnknownCards: aUnknownCards,
            numberOfOpenBoardHandPlaces: numberOfOpenBoardHandPlaces,
            aFixedBoardCards: aFixedBoardCards,
            oFilter: nsFilter.oFilterRecord,
            bMin: false
        });
    }; //end fStartWorker

    $('#win_percent_bar').trigger('start');

    var startHandL = aoStartingHands.length;
    var handsPerWorker = Math.floor(startHandL / MAX_WORKERS) + 1;

    nsUtil.fLog('start hand length ' + startHandL);
    for (var i = 0; i < MAX_WORKERS; i++) {
        var start = i === 0 ? 0 : i * handsPerWorker;
        var end = start + handsPerWorker;
        var aHandWorkerRange = aoStartingHands.slice(start, end);
        fStartWorker(aHandWorkerRange);

        nsUtil.fLog('worker start hand start index ' + start + " end index " + end);
    }
};

nsRange.fGetTextures = function(knownCards) {
    if (typeof(Worker) === "undefined") {
        alert('Browser must support webworkers!');
        return;
    }
    $('.no_results').remove();
    //aoStartingHands,aKnownCards,aFixedBoardCards
    var aoStartingHands = nsRange.fGetStartingHandsFromRangeGrid();
    var aKnownCards = knownCards.allKnown(true);
    var aFixedBoardCards = knownCards.get('board').map(function(m) {
        return m.attributes;
    });
    var oFilter = nsFilter.fActiveFilter(null, true);

    var fStartWorker = function() {

        var worker = new work(require('../Worker/WorkerTextures'));

        worker.addEventListener('message', function(e) {
            if (e.data.type === 'console')
                nsUtil.fLog(e.data.msg);
            if (e.data.type === 'done') {
                var oResult = e.data.msg;
                var graphPref = nsPrefs.oGraphType.fGet();
                nsFilter.fClearFilter();
                nsFilter.fDrawFilterToBoard(oResult.oFilterRecord);
                if (graphPref === nsPrefs.nsConst.BAR_GRAPHS) {
                    var sHtml = nsHtml.fGetTextureHtml(oResult);
                    $('#textures').html(sHtml);
                    nsHtml.fSetupTextureHover(oResult);
                } else if (graphPref === nsPrefs.nsConst.PIE_GRAPHS) {
                    nsHtml.fDrawTexturePie(oResult);
                }
            }
            nsUtil.fLog('message received from texture worker: ' + JSON.stringify(e.data));
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
