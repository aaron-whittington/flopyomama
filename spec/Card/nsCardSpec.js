describe("NSCard", function() {

	var nsCard = require('../../Dev/JS/Card/NSCard');
	var Card = require('../../Dev/JS/Card/Card');
	var CardList = require('../../Dev/JS/Card/CardList');
    describe('compareCards', function() {
        it('high rank first', function() {
            var result = nsCard.compareCards(new Card('AS'), new Card('KH'));  
            expect(result).toBeLessThan(0);

            result = nsCard.compareCards(new Card('6H'), new Card('7C'));  
            expect(result > 0).toBeTruthy();
        });

        it('high suit first', function() {
            var result = nsCard.compareCards(new Card('3H'), new Card('3D'));  
            expect(result).toBeLessThan(0);

            result = nsCard.compareCards(new Card('2C'), new Card('2S'));  
            expect(result > 0).toBeTruthy();
        });

        it('equal cards', function() {
            var result = nsCard.compareCards(new Card('KC'), new Card('KC'));  
            expect(result).toEqual(0);
        });
    });

    describe('sortCardArray', function() {
        var input, result;
        it('should sort a cardarray correctly', function() {
            input = (new CardList('3D3H4S')).models; 
            result = nsCard.sortCardArray(input);
 
            expect(result.length).toEqual(3); 
            expect(result[0].get('rank')).toEqual(4); 
            expect(result[2].get('suit')).toEqual(2); 

        });
        xit('should modify original if preserveoriginal is false, otherwise not', function() {
            input = (new CardList('5D6HAS')).models; 
            result = nsCard.sortCardArray(input);
            expect(input[0].get('rank')).toEqual(5);
            expect(result[0].get('rank')).toEqual(14);

            nsCard.sortCardArray(input, false);
            expect(input[0].get('rank')).toEqual(14);
        });
    });
});
