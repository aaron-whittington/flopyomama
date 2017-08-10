describe("Preflop", function() {

	var Preflop = require('../../Dev/JS/Card/Preflop');
	var Card = require('../../Dev/JS/Card/Card');
	var CardList = require('../../Dev/JS/Card/CardList');
	var preflop;

	it('should sort hands', function() {
		preflop = new Preflop(new Card('KH'), new Card('AH'), new Card('QC'), new Card('QD')) ;
        var heroCards = preflop.getHeroCards().models;
        expect(heroCards[0].toString()).toEqual('AH');
        expect(heroCards[1].toString()).toEqual('KH');
	});

    describe('Normalize', function() {
        it('should return a normalized preflop instance', function() {
		    preflop = new Preflop(new Card('QH'), new Card('QD'), new Card('KH'), new Card('AH')) ;
            var result = preflop.getNormalizedPreflop();
            expect(result instanceof Preflop).toBeTruthy();
            expect(result.isNormalized).toBeTruthy();
            expect(result.wasReversedByNormalization).toBeTruthy();

            var heroCards = result.getHeroCards().models;
            var villainCards = result.getVillainCards().models;

            expect(heroCards[0].toString()).toEqual('AS');
            expect(heroCards[1].toString()).toEqual('KS');
            expect(villainCards[0].toString()).toEqual('QS');
            expect(villainCards[1].toString()).toEqual('QH');
        });        
    });

    it('should return keys correctly', function() {
		 var preflop = new Preflop(new Card('3H'), new Card('4D'), new Card('3S'), new Card('5C')) ;
         expect(preflop.getKey).toThrow('please normalize preflop');
         var result = preflop.getNormalizedPreflop().getKey();
         expect(result).toEqual('5-3H-4D-3C');
    });
});
