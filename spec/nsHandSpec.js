describe("NSHand", function() {
 
	var nsHand = require('../Dev/JS/Hand/NSHand');
    var nsConvert = require('../Dev/JS/Core/Convert');

	it('should handle high card hands', function() {
        var cards1 = nsConvert.fConvertStringToCardObject(['A♥', 'K♣', 'Q♣', 'J♦', '5♦', '3♣', '2♠']);
        var cards2 = nsConvert.fConvertStringToCardObject(['A♥', 'J♦', 'T♣', '7♦', '5♦', '3♣', '2♠']);
        var hand1 = nsHand.fGetBestHand(cards1);
        var hand2 = nsHand.fGetBestHand(cards2);
        var results = nsHand.fCompareHand(hand1, hand2); 
        expect(results).toBeLessThan(0);
    });

	it('should handle high card hands with two kickers', function() {
        var cards1 = nsConvert.fConvertStringToCardObject(['A♥', 'T♣', 'Q♣', 'J♦', '9♦', '3♣', '2♠']);
        var cards2 = nsConvert.fConvertStringToCardObject(['A♥', 'J♦', 'Q♣', 'J♦', '9♦', '3♣', '2♠']);
        var hand1 = nsHand.fGetBestHand(cards1);
        var hand2 = nsHand.fGetBestHand(cards2);
        var results = nsHand.fCompareHand(hand1, hand2); 
        expect(results > 0).toBeTruthy();
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

    it('should let full houses beat flushes', function() {
        var cards1 = nsConvert.fConvertStringToCardObject(['3H', '3D', '3S', '2S', '2H', 'AH', 'KH']);
        var cards2 = nsConvert.fConvertStringToCardObject(['QH', 'JH', '3S', '2S', '2H', 'AH', 'KH']);
        var hand1 = nsHand.fGetBestHand(cards1);
        var hand2 = nsHand.fGetBestHand(cards2);
        var results = nsHand.fCompareHand(hand1, hand2); 
        expect(results).toBeLessThan(0);
    });
    
    it('4 sets beat 3 sets', function() {
        var cards1 = nsConvert.fConvertStringToCardObject(['3H', '4D', '3S', '3H', '3D', 'AH', 'KH']);
        var cards2 = nsConvert.fConvertStringToCardObject(['AH', 'JD', '3S', '3H', '3D', 'AH', 'KH']);
        var hand1 = nsHand.fGetBestHand(cards1);
        var hand2 = nsHand.fGetBestHand(cards2);
        var results = nsHand.fCompareHand(hand1, hand2); 
        expect(results).toBeLessThan(0);
    });

    it('should let full houses beat straights', function() {
        var cards1 = nsConvert.fConvertStringToCardObject(['3H', '3D', '3S', '2S', '2H', 'AD', 'KH']);
        var cards2 = nsConvert.fConvertStringToCardObject(['4H', '5H', '3S', '2S', '2H', 'AD', 'KH']);
        var hand1 = nsHand.fGetBestHand(cards1);
        var hand2 = nsHand.fGetBestHand(cards2);
        var results = nsHand.fCompareHand(hand1, hand2); 
        expect(results).toBeLessThan(0);
    });

    it('should let full houses beat flushes', function() {
        var cards1 = nsConvert.fConvertStringToCardObject(['3H', '3D', '3S', '2S', '2H', 'AH', 'KH']);
        var cards2 = nsConvert.fConvertStringToCardObject(['4H', '5H', '3S', '2S', '2H', 'AH', 'KH']);
        var hand1 = nsHand.fGetBestHand(cards1);
        var hand2 = nsHand.fGetBestHand(cards2);
        var results = nsHand.fCompareHand(hand1, hand2); 
        expect(results).toBeLessThan(0);
    });

    it('4 sets beat full houses', function() {
        var cards1 = nsConvert.fConvertStringToCardObject(['3H', '4D', '3S', '3H', '3D', 'AH', 'KH']);
        var cards2 = nsConvert.fConvertStringToCardObject(['AH', 'AD', '3S', '3H', '3D', 'AH', 'KH']);
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

	it('should respect superior straight', function() {
        var cards1 = nsConvert.fConvertStringToCardObject(['T♥', '9♥', '8♣', '7♦', '6♣', '5♥', '2♠']);
        var cards2 = nsConvert.fConvertStringToCardObject(['J♣', '9♣', '8♣', '7♦', '6♣', '5♥', '2♠']);
        var hand1 = nsHand.fGetBestHand(cards1);
        var hand2 = nsHand.fGetBestHand(cards2);
        var results = nsHand.fCompareHand(hand1, hand2); 
        expect(results).toEqual(-1);
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
