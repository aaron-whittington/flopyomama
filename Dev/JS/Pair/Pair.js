var AWModel = require('../Core/AWModel');
var nsConvert = require('../Core/Convert');
var nsMath = require('../Core/Math');

var Pair = AWModel.extend({
    className: 'Pair',
    _stringToPrm: function(aArgs) {
        //var prm = arguments;
        var sCardPair = aArgs[0];
        this.sCardPair = sCardPair;
        var oPair = {};
        oPair.rank1 = nsConvert.rankCharToNumber(sCardPair[0]);
        oPair.rank2 = nsConvert.rankCharToNumber(sCardPair[1]);
        oPair.suited = (sCardPair.length === 3 && sCardPair[2] === 's');

        return oPair;
    },
    /*just counts the number oPairs*/
    initialize: function(oPair) {
        if (oPair.rank1 === oPair.rank2)
            oPair.comb = 6;
        else
            oPair.comb = oPair.suited ? 4 : 12;
        this.set('comb', oPair.comb);
    },
    endingChar: function() {
        if (this.get('suited'))
            return 's';
        else if (this.get('comb') === 12)
            return 'o';
        else
            return '';
    },
    toString: function() {
        var rank1 = this.get('rank1');
        var rank2 = this.get('rank2');
        var disRank1 = rank1 > rank2 ? rank1 : rank2;
        var disRank2 = rank1 < rank2 ? rank1 : rank2;
        return nsConvert.rankNumberToChar(disRank1) + '' +
            nsConvert.rankNumberToChar(disRank2) +
            this.endingChar();
    },
    bPPair: function() {
        return (this.get('rank1') === this.get('rank2'));
    },
    toArray: function(aFilter) {
        var aCards = [];
        var aAllKinds = [];

        var rank1 = this.get('rank1');
        var rank2 = this.get('rank2');
        var bSuited = this.get('suited');

        if (rank1 === rank2) {
            aCards.push({
                rank: rank2,
                suit: 1
            });
            aCards.push({
                rank: rank2,
                suit: 2
            });
            aCards.push({
                rank: rank2,
                suit: 3
            });
            aCards.push({
                rank: rank2,
                suit: 4
            });
            aAllKinds = nsMath.combine(aCards, 2);
        } else {
            aCards.push({
                rank: rank2,
                suit: 1
            });
            aCards.push({
                rank: rank2,
                suit: 2
            });
            aCards.push({
                rank: rank2,
                suit: 3
            });
            aCards.push({
                rank: rank2,
                suit: 4
            });
            aCards.push({
                rank: rank1,
                suit: 1
            });
            aCards.push({
                rank: rank1,
                suit: 2
            });
            aCards.push({
                rank: rank1,
                suit: 3
            });
            aCards.push({
                rank: rank1,
                suit: 4
            });
            aAllKinds = nsMath.combine(aCards, 2);
        }

        //order within each pair		
        for (var i = 0; i < aAllKinds.length; i++) {
            aAllKinds[i].sort(function(a, b) {
                if (a.rank !== b.rank)
                    return b.rank - a.rank;

                return b.suit - a.suit;
            });
        }
        //order the pairs
        aAllKinds.sort(function(aPair, bPair) {
            //TODO use sort function in NSCard
            if (aPair[0].rank !== bPair[0].rank)
                return bPair[0].rank - aPair[0].rank;
            else if (aPair[0].suit !== bPair[0].suit)
                return bPair[0].suit - aPair[0].suit;
        });


        //filter out known cards
        var aKnownFiltered = [],
            j;
        if (typeof aFilter === "object") {
            //nsUtil.fLog("applying pair filter");
            aKnown = aFilter;
            for (i = 0; i < aAllKinds.length; i++) {
                var bPairOk = true;
                for (j = 0; j < aKnown.length; j++) {
                    if ((aAllKinds[i][0].rank === aKnown[j].rank && //filter out pairs
                            aAllKinds[i][0].suit === aKnown[j].suit) ||
                        (aAllKinds[i][1].rank === aKnown[j].rank && //filter out pairs
                            aAllKinds[i][1].suit === aKnown[j].suit)) {
                        bPairOk = false;
                        continue;
                    }
                }
                if (bPairOk === true)
                    aKnownFiltered.push(aAllKinds[i]);
            }
        } else
            aKnownFiltered = aAllKinds;

        //pairs
        if (rank1 === rank2) {
            /*not going to use cardlistlist */
            //return new CardListList(aKnownFiltered);
            return aKnownFiltered;
        }
        //return new HandList(aKnownFiltered);	
        var suited = [];
        var nonsuited = [];
        //is this a bug?
        for (i = 0; i < aKnownFiltered.length; i++) {
            if (aKnownFiltered[i][0].rank !== aKnownFiltered[i][1].rank) //filter out pairs
                if (aKnownFiltered[i][0].suit === aKnownFiltered[i][1].suit)
                    suited.push(aKnownFiltered[i]);
                else
                    nonsuited.push(aKnownFiltered[i]);
        }

        var returnArray = suited;

        if (!bSuited)
            returnArray = nonsuited;

        var aoPairs = [];
        return returnArray;
    }
});
module.exports = Pair;
