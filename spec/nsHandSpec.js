describe("NSHand", function() {
 
	var nsHand = require('../Dev/JS/NSHand');
    var nsConvert = require('../Dev/JS/Convert');


	it('should handle high card hands', function() {
        var cards1 = nsConvert.fConvertStringToCardObject(['A♥', 'K♣', 'Q♣', 'J♦', '5♦', '3♣', '2♠']);
        var cards2 = nsConvert.fConvertStringToCardObject(['A♥', 'J♦', 'T♣', '7♦', '5♦', '3♣', '2♠']);
        var hand1 = nsHand.fGetBestHand(cards1);
        var hand2 = nsHand.fGetBestHand(cards2);
        var results = nsHand.fCompareHand(hand1, hand2); 
        expect(results).toBeLessThan(0);
    });

	it('should handle one pair with kickers', function() {
        var cards1 = nsConvert.fConvertStringToCardObject(['A♥', 'K♣', 'Q♣', 'J♦', '5♦', '3♣', '2♠']);
        var cards2 = nsConvert.fConvertStringToCardObject(['A♥', 'J♦', 'T♣', '7♦', '5♦', '3♣', '2♠']);
        var hand1 = nsHand.fGetBestHand(cards1);
        var hand2 = nsHand.fGetBestHand(cards2);
        var results = nsHand.fCompareHand(hand1, hand2); 
        expect(results).toBeLessThan(0);
    });

    it('should let straight flushes beat straights', function() {
        var cards1 = nsConvert.fConvertStringToCardObject(['A♥', 'K♥', 'Q♥', 'J♥', 'T♥', '3♣', '2♠']);
        var cards2 = nsConvert.fConvertStringToCardObject(['A♥', 'K♥', 'Q♥', 'J♥', 'T♠', '3♣', '2♠']);
        var hand1 = nsHand.fGetBestHand(cards1);
        var hand2 = nsHand.fGetBestHand(cards2);
        var results = nsHand.fCompareHand(hand1, hand2); 
        expect(results).toBeLessThan(0);
    });

    //TODO, this is silly, you should remove the duplicate twos
	it('should identify equality of two straights', function() {
        var cards1 = nsConvert.fConvertStringToCardObject(['6♥', '5♥', '4♣', '3♦', '2♣', '2♥', '2♠']);
        var cards2 = nsConvert.fConvertStringToCardObject(['6♣', '5♣', '4♣', '3♦', '2♣', '2♥', '2♠']);
        var hand1 = nsHand.fGetBestHand(cards1);
        var hand2 = nsHand.fGetBestHand(cards2);
        var results = nsHand.fCompareHand(hand1, hand2); 
        expect(results).toEqual(0);
    });

	it('should respect equality of a pair with same kickers', function() {
        var cards1 = nsConvert.fConvertStringToCardObject(['6♥', '5♥', '4♣', '3♦', '8♣', '2♥', '2♠']);
        var cards2 = nsConvert.fConvertStringToCardObject(['6♣', '5♣', '4♦', '3♦', '8♣', '2♥', '2♠']);
        var hand1 = nsHand.fGetBestHand(cards1);
        var hand2 = nsHand.fGetBestHand(cards2);
        var results = nsHand.fCompareHand(hand1, hand2); 
        expect(results).toEqual(0);

    });
});
