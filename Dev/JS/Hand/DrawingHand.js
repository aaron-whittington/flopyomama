var nsHand = require('./NSHand');
var oHand = require('./Hand');
var nsDrawingHand = {};

/*drawing hands*/
nsDrawingHand.bIgnoreBackdoorDraws = true;

//TODO put these in constants folder
nsDrawingHand.BACKDOOR_STRAIGHT_DRAW = 0;
nsDrawingHand.BACKDOOR_FLUSH_DRAW = 1;
nsDrawingHand.GUTSHOT_STRAIGHT_DRAW = 2;
nsDrawingHand.OPEN_ENDED_STRAIGHT_DRAW = 3;
nsDrawingHand.FLUSH_DRAW = 4;

nsDrawingHand.fDrawingHandToShortString = function(oDrawingHand) {
    var sLong = nsDrawingHand.fDrawingHandToString(oDrawingHand);
    var iDraw = sLong.indexOf('Draw');
    return sLong.substring(0, iDraw - 1);
}

nsDrawingHand.fDrawingHandToString = function(oDrawingHand) {
    var rankString = "";
    switch (oDrawingHand.rank) {
        case nsDrawingHand.BACKDOOR_STRAIGHT_DRAW:
            rankString = "Backdoor Straight Draw";
            break;
        case nsDrawingHand.BACKDOOR_FLUSH_DRAW:
            rankString = "Backdoor Flush Draw";
            break;
        case nsDrawingHand.GUTSHOT_STRAIGHT_DRAW:
            rankString = "Gutshot Straight Draw";
            break;
        case nsDrawingHand.OPEN_ENDED_STRAIGHT_DRAW:
            rankString = "Open Ended Straight Draw";
            break;
        case nsDrawingHand.FLUSH_DRAW:
            rankString = "Flush Draw";
            break;
        default:
            rankString = "ERROR UNKNOWN!!!";
    }

    return rankString;
};

nsDrawingHand.fHandToString = function(oDrawingHand) {
    var returnString = nsHand.fHandToString(oDrawingHand);

    for (i = 0; i < oDrawingHand.drawingHands.length; i++) {
        returnString = returnString + ' - ' + nsDrawingHand.fDrawingHandToString(oDrawingHand.drawingHands[i]);
    }
    return returnString;
};

nsDrawingHand.fGetDrawingHands = function(aCards) {
    aCards.sort(nsHand.fCompareCard);
    var bestMadeHand = nsHand.fGetBestHand(aCards);

    bestMadeHand.drawingHands = []; //should be in a constructor to oHand.
    //if we have a made hand as big as a straight or are dealing with all the cards, no drawing hands (maybe implement
    //straight to flush drawing in the future
    if (bestMadeHand.rank > oHand.THREE_OF_A_KIND || aCards.length > 6 || aCards.length < 5)
        return bestMadeHand;

    var fd = nsDrawingHand.fFindBestFlushDraw(aCards);
    //nsHand.fGet
    var sd = nsDrawingHand.fFindBestStraightDraw(aCards);

    if (fd !== null)
        bestMadeHand.drawingHands.push(fd);

    if (sd !== null)
        bestMadeHand.drawingHands.push(sd);

    return bestMadeHand;
};

//compare drawing hands, to be used as sort function
nsDrawingHand.fCompareHand = function(handA, handB) {
    if (handA.rank !== handB.rank)
        return handB.rank - handA.rank;
    //same rank
    if (handA.high !== handB.high)
        return handB.high - handA.high;

    if (handA.low !== handB.low)
        return handB.low - handA.low;

    return 0; //all the same;
};

nsDrawingHand.fFindBestFlushDraw = function(aCards) {
    var flushDraws = [];
    for (var suit = 1; suit <= 4; suit++) {
        var aCardsOfSuit = [];
        for (var i = 0; i < aCards.length; i++) {
            if (aCards[i].suit === suit)
                aCardsOfSuit.push(aCards[i]);
        }
        var minLength = aCards.length === 5 ? 3 : 4; //on the turn we don't want to count having 3 of a color
        if (aCardsOfSuit.length > 2) { //found one
            flushDraws.push(aCardsOfSuit);
            break;
        }
    }

    if (flushDraws.length > 0) {

        var returnHands = [];

        for (i = 0; i < flushDraws.length; i++) {
            if (aCards.length === 5) { //flop
                if (flushDraws[i].length === 4) {
                    returnHands.push({
                        rank: nsDrawingHand.FLUSH_DRAW,
                        high: flushDraws[i][0].rank,
                        low: flushDraws[i][flushDraws[i].length - 1].rank
                    });
                    continue;
                }
                if (flushDraws[i].length === 3) {
                    if (!nsDrawingHand.bIgnoreBackdoorDraws)
                        returnHands.push({
                            rank: nsDrawingHand.BACKDOOR_FLUSH_DRAW,
                            high: flushDraws[i][0].rank,
                            low: flushDraws[i][flushDraws[i].length - 1].rank
                        });
                    continue;
                }

            } else { //turn
                if (flushDraws[i].length === 4) {

                    returnHands.push({
                        rank: nsDrawingHand.FLUSH_DRAW,
                        high: flushDraws[i][0].rank,
                        low: flushDraws[i][flushDraws[i].length - 1].rank
                    });
                    continue;
                }
            }
        }

        returnHands.sort(nsDrawingHand.fCompareHand);
        if (returnHands.length > 0)
            return returnHands[0];
    }
    return null;
};


nsDrawingHand.fFindBestStraightDraw = function(aCards) {
    var iFirst;
    var aFoundDrawingStraights = [];
    for (iLowRank = 10; iLowRank >= 1; iLowRank--) {
        var aStraightRecord = []; //can contain duplicates // forget aces low
        for (memberInStraight = 0; memberInStraight < 5; memberInStraight++) {
            var findRank = iLowRank + memberInStraight;
            //special case for Aces low								
            if (iLowRank === 1) {
                if (memberInStraight === 0)
                    findRank = 14;
            }

            var aMembersOfRank = nsHand.fFindAllCardsWithRank(aCards, findRank);
            if (aMembersOfRank.length > 0)
                aStraightRecord[memberInStraight] = aMembersOfRank;
            else
                aStraightRecord[memberInStraight] = null;
        }

        aFoundDrawingStraights.push(aStraightRecord);
    }

    //now evaluate the straight draws

    var aFoundDraws = [];
    for (var i = 0; i < aFoundDrawingStraights.length; i++) {

        var aFoundDS = aFoundDrawingStraights[i];
        //find non null, high, and low
        var iHigh = -1;
        var iLow = -1;
        var numberNonNull = 0;
        var iFirstNonNull = -1;
        var aGaps = [];
        for (j = 0; j < aFoundDS.length; j++) {
            var cardsOfRank = aFoundDS[j];
            if (cardsOfRank !== null) {
                numberNonNull++;
                if (iLow === -1)
                    iLow = cardsOfRank[0].rank;

                iHigh = cardsOfRank[0].rank; //set it every time, and we will hit the last one, since they are currently in order from low to high
            } else
                aGaps.push(j);
        }
        var rank = -1;
        if (numberNonNull === 4) {

            if (aCards.length === 6) //on the turn always a backdoor straight draw ... we might distinguish between 2 sets of outs and 1 set of outs
                rank = nsDrawingHand.GUTSHOT_STRAIGHT_DRAW;
            else //check whether gushot or open ended
            {
                if (iHigh === 14 || iLow === 14) //aces high or low
                    rank = nsDrawingHand.GUTSHOT_STRAIGHT_DRAW;
                else {
                    if (aGaps[0] === 0 || aGaps[0] === 4) //gap comes at beginning or end
                        rank = nsDrawingHand.OPEN_ENDED_STRAIGHT_DRAW;
                    else
                        rank = nsDrawingHand.GUTSHOT_STRAIGHT_DRAW;
                }
            }
        } else if (numberNonNull === 3 && aCards.length === 5) { //backdoor straight draw with 3 cards only on flop

            if (!nsDrawingHand.bIgnoreBackdoorDraws)
                rank = nsDrawingHand.BACKDOOR_STRAIGHT_DRAW;

        }
        if (rank === -1)
            continue;

        aFoundDraws.push({
            rank: rank,
            high: iHigh,
            low: iLow
        });
    }


    aFoundDraws.sort(nsDrawingHand.fCompareHand);
    if (aFoundDraws.length > 0)
        return aFoundDraws[0];
    return null;
};

module.exports = nsDrawingHand;
