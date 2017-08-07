

var oHand = {};

oHand = {
    rank: 0,
    high: -1,
    /*for all hands high card in the made portion of the hand*/
    low: -1,
    /*for two pair and fh, the low card in the made portion*/
    kickers: [],
    /*up to five cards for high-card hands*/
    subtype: -1,
    /*types such as over pair*/
    drawinghands: []
};

oHand.HIGH_CARD = 0;
oHand.PAIR = 1;
oHand.TWO_PAIR = 2;
oHand.THREE_OF_A_KIND = 3;
oHand.STRAIGHT = 4;
oHand.FLUSH = 5;
oHand.FULL_HOUSE = 6;
oHand.FOUR_OF_A_KIND = 7;
oHand.STRAIGHT_FLUSH = 8;

/*subtypes*/
oHand.TOP_Pair = 0;

module.exports = oHand;

