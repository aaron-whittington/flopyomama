
var _ = require('underscore');
var nsMath = require('../Core/Math');
var nsDrawingHand = require('../Hand/DrawingHand');
var nsConvert = require('../Core/Convert');
var nsFilter = require('../Filter/Filter');
var nsUtil = require('../Core/Util');

module.exports = function(self) {

    var nsWorkerTextures = {};

    self.addEventListener('message', function(e) {
        var data = e.data;
        switch (data.cmd) {
            case 'start':
                try {
                    nsWorkerTextures.fCalculateBoards(data.aoStartingHands, data.aKnownCards, data.aFixedBoardCards, data.oFilter);
                } catch (error) {
                    fPostConsole('ERROR' + error.toString());
                }

                break;
            case 'stop':
                self.close(); // Terminates the worker.
                break;
            default:
                self.postMessage('Unknown command: ' + data.msg);
        }
    }, false);

    nsWorkerTextures.fCalculateBoards = function(aoStartingHands, aKnownCards, aFixedBoardCards, oFilter) {
        var startTime = new Date().getTime();
        var numberDone = 0;
        var oVillainStaticDic = {};
        var oPairLengthDic = {};
        var oFilterRecord = {};
        var aCurrentKnown = aKnownCards;

        var startingHandLengths = aoStartingHands.length;
        for (var iVillainPair = startingHandLengths - 1; iVillainPair >= 0; iVillainPair--) {
            //get the villain pair
            var oPair = aoStartingHands[iVillainPair].oPair;
            var sPair = aoStartingHands[iVillainPair].sPair;

            oFilterRecord[sPair] = [];

            var oPairArray = nsConvert.fFilterCardPairArray(aoStartingHands[iVillainPair].aPair, aCurrentKnown);

            var iPairLength = oPairArray.length;

            for (var i = 0; i < oPairArray.length; i++) {

                var aVillainHand = [];
                aVillainHand = oPairArray[i].concat(aFixedBoardCards);
                var oVillainHand;
                if (oFilter) {
                    //this should actually return the drawing hand, so i don't have to evaluate it again
                    var bHit = nsFilter.nsEvaluate.fEvaluateFilter(oFilter, aVillainHand);
                    if (!bHit) { //did not pass filter
                        oFilterRecord[sPair].push(oPairArray[i]);
                        continue;
                    }
                    oVillainHand = nsFilter.nsEvaluate.oCurrentHand;
                } else {
                    oVillainHand = nsDrawingHand.fGetDrawingHands(aVillainHand);
                }

                var aVillainHand = nsDrawingHand.fHandToKeyArray(oVillainHand);
                
                //slice is just an experiment, only getting the made hands
                nsWorkerTextures.fAddToRecordDic(oVillainStaticDic, aVillainHand[0], sPair);

                //add the best draw, we can go deeper, or make the setting method recursive,
                //but i'm not sure we can present that data nicely
                if(aVillainHand.length > 1) {
                     nsWorkerTextures.fAddToRecordDic(oVillainStaticDic[aVillainHand[0]].drawingHands, aVillainHand[1], sPair);   
                }
            }

            oPairLengthDic[sPair] = iPairLength;
        }
        fPostDone({
            oVillainStat: oVillainStaticDic,
            count: numberDone,
            oPairLengthDic: oPairLengthDic,
            oFilterRecord: oFilterRecord
        });
    };

    nsWorkerTextures.fAddToRecordDic = function(oVillainStatDic, sHandString, sPairString) {

        if (typeof(oVillainStatDic[sHandString]) === 'undefined') {
            oVillainStatDic[sHandString] = {
                oPairRecord: {},
                count: 0,
                drawingHands : {} 
            };
        }

        if (typeof(oVillainStatDic[sHandString].oPairRecord[sPairString]) === 'undefined') {
            oVillainStatDic[sHandString].oPairRecord[sPairString] = 1;
        } else {
            oVillainStatDic[sHandString].oPairRecord[sPairString]++; //track the pairs for each hand type	
        }

        oVillainStatDic[sHandString].count++;
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
        self.close(); // Terminates the worker. 
    };

    var fPostProgress = function(sMessage) {
        self.postMessage({
            type: 'progress',
            msg: sMessage
        });
    };
};
