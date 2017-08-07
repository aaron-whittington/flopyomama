
var oHand = require('./Hand');
var nsHand = {}; 

//nsHand.oHandStringCache = {};
nsHand.fHandToString = function(hand) {
    //actually made stuff slower var cache = nsHand.oHandStringCache[hand];
    //if (typeof cache !== 'undefined')
    //	return cache;

    var rankString = "";
    switch (hand.rank) {
        case oHand.HIGH_CARD:
            rankString = "High Card";
            break;
        case oHand.PAIR:
            rankString = "Pair";
            /*if (hand.subtype === oHand.TOP_Pair)
				rankString = "Top Pair";*/
            break;
        case oHand.TWO_PAIR:
            rankString = "Two Pair";
            break;
        case oHand.THREE_OF_A_KIND:
            rankString = "Three Of A Kind";
            break;
        case oHand.STRAIGHT:
            rankString = "Straight";
            break;
        case oHand.FLUSH:
            rankString = "Flush";
            break;
        case oHand.FULL_HOUSE:
            rankString = "Full House";
            break;
        case oHand.FOUR_OF_A_KIND:
            rankString = "Four Of A Kind";
            break;
        case oHand.STRAIGHT_FLUSH:
            rankString = "Straight Flush";
            break;
        default:
            rankString = "ERROR UNKNOWN!!!";
    }

    //nsHand.oHandStringCache[rankString] = rankString;	
    return rankString; //+ ' high: ' + hand.high;
};

/*gets the hand by order of ranking*/
nsHand.fGetBestHand = function(aCards) {
    var oNsHand = nsHand;
    if (aCards.length === 1) {
        return {
            rank: oHand.HIGH_CARD,
            high: aCards[0].rank,
            low: -1,
            kickers: []
        };
    }

    aCards.sort(nsHand.fCompareCard); //sort the cards for evaluating set types 

    var oBestStraight = oNsHand.fFindBestStraight(aCards); //get's straight flush or the best straight or null, if sf then stop here... if we find a straight, there can be no 4 of a kind or fullhouse, so we can skip
    if (oBestStraight !== null && oBestStraight.rank === oHand.STRAIGHT_FLUSH)
        return oBestStraight;

    var oBestSetHand = oNsHand.fFindBestSet(aCards); //always returns a hand even if not a made hand
    if (oBestSetHand.rank >= oHand.FULL_HOUSE)
        return oBestSetHand;

    var oBestFlushHand = oNsHand.fFindBestFlush(aCards);
    if (oBestFlushHand !== null)
        return oBestFlushHand;

    if (oBestStraight !== null)
        return oBestStraight;

    //return the best set which may just be high cards
    return oBestSetHand;
};

nsHand.fBigIntFirst = function(a, b) {
    return b - a;
};
//compare hands, to be used as sort function
nsHand.fCompareHand = function(handA, handB) {
    if (handA.rank !== handB.rank)
        return handB.rank - handA.rank;
    //same rank
    if (handA.high !== handB.high)
        return handB.high - handA.high;

    if (handA.low !== handB.low)
        return handB.low - handA.low;

    //compare kickers	
    if (typeof(handA.kickers) === "undefined" || handA.kickers.length === 0) //no kickers so the hands are equivalent
        return 0;

    handA.kickers.sort(nsHand.fBigIntFirst);
    handB.kickers.sort(nsHand.fBigIntFirst);

    for (var i = 0; i < handA.kickers.length; i++) {
        if (handB.kickers[i] !== handA.kickers[i])
            return handB.kickers[i] - handA.kickers[i];
    }

    return 0; //all the same;
};

nsHand.fFindBestFlush = function(aCards) {
    var flushes = [],
        i;
    for (var suit = 1; suit <= 4; suit++) {
        var aCardsOfSuit = [];
        for (i = 0; i < aCards.length; i++) {
            if (aCards[i].suit === suit)
                aCardsOfSuit.push(aCards[i]);

            if (aCardsOfSuit.length === 5) { //found one
                flushes = fPushArrayMultiDim(flushes, aCardsOfSuit);
                break;
            }
        }
    }

    if (flushes.length > 0) {
        flushes.sort(nsHand.fCompareFlushes);
        var returnHand = {};
        returnHand.rank = oHand.FLUSH;
        returnHand.high = flushes[0][4].rank;
        returnHand.low = returnHand.high;
        returnHand.kickers = [];
        for (i = 0; i < 5; i++)
            returnHand.kickers.push(flushes[0][i].rank); //little hack...for comparing flushes we can treat the hand as kickers
        return returnHand;
    }
    return null;
};

nsHand.fCompareFlushes = function(flushA, flushB) {
    for (i = 0; i < 5; i++) {
        if (flushA[i].rank !== flushB[i].rank)
            return flushB[i].rank - flushA[i].rank;
    }
};

var fPushArrayMultiDim = function(parentArray, childArray) {

    parentArray[parentArray.length] = childArray;
    return parentArray;
};

nsHand.fFindBestStraight = function(aCards) {
    var iFirst;
    var aFoundStraights = [];
    for (iLowRank = 10; iLowRank >= 1; iLowRank--) {
        var aStraightRecord = []; //can contain duplicates // forget aces low
        for (memberInStraight = 0; memberInStraight < 5; memberInStraight++) {
            var findRank = iLowRank + memberInStraight; //special case for Aces low

            if (iLowRank === 1) {
                if (memberInStraight === 0)
                    findRank = 14;
            }
            //nsUtil.fLog("lowrank " + iLowRank + " memberinstraight " + memberInStraight + " findrank " +findRank)
            //aces low lowRank = 1, member =0, findRank = 14
            //next round lowRank = 2 member =1, findRank =3 ??

            var aMembersOfRank = nsHand.fFindAllCardsWithRank(aCards, findRank);

            if (aStraightRecord.length === 0 && aMembersOfRank.length > 0)
                aStraightRecord[memberInStraight] = aMembersOfRank;
            else if (aStraightRecord.length > 0 && aMembersOfRank.length > 0 && (
                    aStraightRecord[aStraightRecord.length - 1][0].rank === findRank - 1 ||
                    (aStraightRecord[aStraightRecord.length - 1][0].rank === 14 && findRank === 2)
                ) //low aces
            )
                aStraightRecord[memberInStraight] = aMembersOfRank;
            else
                break; //go on to next rank, no straight found

        }
        if (aStraightRecord.length === 5)
            aFoundStraights = fPushArrayMultiDim(aFoundStraights, aStraightRecord);
    }


    //convert ordered arrays of cards to straight hands
    var aFoundHands = [];
    for (var i = 0; i < aFoundStraights.length; i++) {
        var oStraight = nsHand.fStraightFromAmbig(aFoundStraights[i]);
        aFoundHands = fPushArrayMultiDim(aFoundHands, oStraight);
    }

    aFoundHands.sort(nsHand.fCompareHand);
    if (aFoundHands.length > 0)
        return aFoundHands[0];
    return null;
};

nsHand.fStraightFromAmbig = function(aCardListArray) {
    if (aCardListArray.length === 0)
        return;

    var aFoundSuits = [];
    var aFirstCards = aCardListArray[0];
    var countOfFlushSuits, i, j, k, l;
    /*load suit of first cards*/
    for (j = 0; j < aFirstCards.length; j++) {
        var suit = aFirstCards[j].suit;
        var bSuitAlreadyThere = false;
        for (k = 0; k < aFoundSuits.length; k++) {
            if (suit === aFoundSuits[k])
                bSuitAlreadyThere = true;
        }
        if (!bSuitAlreadyThere)
            aFoundSuits.push(suit);
    }

    for (i = 1; i < aCardListArray.length; i++) {
        var aCardsOfRank = aCardListArray[i];
        var aToRemove = [];
        for (j = 0; j < aFoundSuits.length; j++) {

            var searchForSuit = aFoundSuits[j];
            var bFound = false;
            for (k = 0; k < aCardsOfRank.length; k++) {
                if (aCardsOfRank[k].suit === searchForSuit)
                    bFound = true;
            }
            if (!bFound)
                aToRemove.push(aFoundSuits[j]);
        }

        for (k = 0; k < aToRemove.length; k++) {
            for (l = 0; l < aFoundSuits.length; l++) {
                if (aToRemove[k] === aFoundSuits[l])
                    aFoundSuits.splice(l, 1);
            }
        }
    }
    countOfFlushSuits = aFoundSuits.length;
    var oReturnHand = {};
    if (countOfFlushSuits > 0)
        oReturnHand.rank = oHand.STRAIGHT_FLUSH;
    else
        oReturnHand.rank = oHand.STRAIGHT;

    oReturnHand.low = aCardListArray[0][0].rank;
    if (oReturnHand.low === 14)
        oReturnHand.low = 1;
    oReturnHand.high = oReturnHand.low + 5;
    return oReturnHand;
};

nsHand.fFindAllCardsWithRank = function(aCards, rank) {
    var returnCards = [];

    for (i = 0; i < aCards.length; i++) {
        if (aCards[i].rank === rank) {
            returnCards.push(aCards[i]);
        }
    }
    return returnCards;
};

nsHand.fFindBestSet = function(aCards) {
    var aSets = [],
        oReturnHand, i;
    for (i = 14; i >= 2; i--) {
        var timesFound = 0;
        var foundRank = [];
        var notFoundRank = [];
        for (j = 0; j < aCards.length; j++) {
            if (aCards[j].rank === i) {
                timesFound++;
                foundRank.push(i);
            } else {
                notFoundRank.push(aCards[j].rank);
            }
        }
        if (timesFound >= 2)
            aSets.push({
                same: foundRank,
                kickers: notFoundRank
            });
    }

    //now aSets contains an array of , for example [2,2],[3,3,3],[A,A,A,A] (14) 
    aSets.sort(nsHand.fCompareSimpleSet);

    //got at least one "set"
    if (aSets.length > 0) {
        //sort the kickers
        for (i = 0; i < aSets.length; i++)
            aSets[i].kickers.sort(nsHand.fBigIntFirst);

        var bestOfAll = aSets[0];
        if (bestOfAll.same.length === 4) { //4 of a kind
            //return best 4 hand
            oReturnHand = {};
            oReturnHand.rank = oHand.FOUR_OF_A_KIND;
            oReturnHand.low = bestOfAll.same[0];
            oReturnHand.high = oReturnHand.low;

            oReturnHand.kickers = bestOfAll.kickers.slice(0, 1);
            return oReturnHand;
        }

        //found at least 3
        if (bestOfAll.same.length === 3) {
            //full house or 3 of a kind
            if (aSets.length > 1) {
                oReturnHand = {};
                oReturnHand.rank = oHand.FULL_HOUSE;
                oReturnHand.high = bestOfAll.same[0];
                oReturnHand.low = aSets[1].same[0];
                oReturnHand.kickers = []; // no kickers with FH
                return oReturnHand;
                //return full house with aSets[0] and aSets[1]
            } else // set of 3
            {
                oReturnHand = {};
                oReturnHand.rank = oHand.THREE_OF_A_KIND;
                oReturnHand.high = bestOfAll.same[0];
                oReturnHand.low = oReturnHand.high;

                oReturnHand.kickers = bestOfAll.kickers.slice(0, 2);
                return oReturnHand;
            }
        }

        //found at least a pair
        if (bestOfAll.same.length === 2) {
            if (aSets.length > 1) {
                oReturnHand = {};
                oReturnHand.rank = oHand.TWO_PAIR;
                oReturnHand.high = bestOfAll.same[0];
                oReturnHand.low = aSets[1].same[0];
                for (i = 0; i < bestOfAll.kickers.length; i++) {
                    if (bestOfAll.kickers[i] !== aSets[1].same[0]) {
                        oReturnHand.kickers = [bestOfAll.kickers[i]]; //this is an array of one elment though it looks funny one kicker for two pair
                        break;
                    }
                }
                return oReturnHand;
                //return two pair with aSets[0] and aSets[1]
            } else { //return one pair
                oReturnHand = {};
                oReturnHand.rank = oHand.PAIR;
                oReturnHand.high = bestOfAll.same[0];
                oReturnHand.low = oReturnHand.high;

                if (oReturnHand.high === aCards[0].rank)
                    oReturnHand.subtype = oHand.TOP_Pair;

                oReturnHand.kickers = bestOfAll.kickers.slice(0, 3);
                return oReturnHand;
            }
        }
    }

    //no sets found return high card
    aCards.sort(nsHand.fCompareCard);
    var kickers = [];
    for (i = 0; i < aCards.length; i++)
        kickers.push(aCards[i].rank); // = aCards.slice(0,5);

    oReturnHand = {};
    oReturnHand.rank = oHand.HIGH_CARD;
    oReturnHand.high = -1;
    oReturnHand.low = -1;
    oReturnHand.kickers = kickers;

    return oReturnHand;

};

nsHand.fCompareCard = function(aCard, bCard) {
    return bCard.rank - aCard.rank;
};

nsHand.fCompareSimpleSet = function(aSet, bSet) {
    if (aSet.same.length !== bSet.same.length) // four of a kind are always better than three 
        return bSet.same.length - aSet.same.length;

    return bSet.same[0] - aSet.same[0];
};

nsHand.fFindHighCards = function(aCards) {
    var highRank = [],
        cardsLength = aCards.length;
    for (i = 0; i < cardsLength; i++)
        highRank[i] = -1;
    for (i = 0; i < cardsLength; i++) {
        var foundIndex = -1,
            newCardsLength = aCards.length;
        for (j = 0; i < newCardsLength; j++) {
            var card = aCards[j];
            if (card.rank >= highRank)
                highRank[i] = card.rank;
            foundIndex = j;
        }
        aCards.splice(foundIndex, 1);
    }
    return highRank;
};

module.exports = nsHand;
