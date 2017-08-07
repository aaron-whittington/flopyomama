describe("Deck", function() {

    var nsConvert = require('../Dev/JS/Convert');
        var Card = require('../Dev/JS/Card');

    xit('should have get random cards', function() {
        nsConvert.fGetRandomCards(3);
                expect(deck.models.length).toEqual(52);
    });
        
    it('should convert strings to card objects', function() {
        var result = nsConvert.fConvertStringToCardObject('AH');
        expect(result.rank).toEqual(14);
        expect(result.suit).toEqual(3);
    });

    it('should convert card object to string', function() {
        var result = nsConvert.fConvertCardObjectToString({rank: 'K', suit: 4}); 
        expect(result).toEqual('K♠');
    });

    it('should filter cards correctly', function() {
        //nsConvert.fFilterCardPairArray(pairArray, aUnknown, aFilterPairs);
    });

});
