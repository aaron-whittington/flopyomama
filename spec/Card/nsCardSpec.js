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
        it('should modify original if preserveoriginal is false, otherwise not', function() {
            input = (new CardList('5D6HAS')).models; 
            result = nsCard.sortCardArray(input);
            expect(input[0].get('rank')).toEqual(5);
            expect(result[0].get('rank')).toEqual(14);

            nsCard.sortCardArray(input, false);
            expect(input[0].get('rank')).toEqual(14);
        });
    });

    describe('standardizeSuits', function() {
        var input, result;
        it('should standardize suits correctly, spades first', function() {
            input = (new CardList('5D7C4SAH')).models; 
            result = nsCard.standardizeSuits(input);
 
            expect(result.length).toEqual(4); 
            expect(result[0].toString()).toEqual('5S'); 
            expect(result[1].toString()).toEqual('7H'); 
            expect(result[2].toString()).toEqual('4D'); 
            expect(result[3].toString()).toEqual('AC'); 

            input = (new CardList('ACKCQCJCTC')).models; 
            result = nsCard.standardizeSuits(input);
 
            expect(result.length).toEqual(5); 
            expect(result[0].toString()).toEqual('AS'); 
            expect(result[1].toString()).toEqual('KS'); 
            expect(result[2].toString()).toEqual('QS'); 
            expect(result[3].toString()).toEqual('JS'); 
            expect(result[4].toString()).toEqual('TS'); 

        });

        it('should not modify original cards', function() {
            input = (new CardList('5D7C4SAH')).models; 
            result = nsCard.standardizeSuits(input);
 
            expect(result.length).toEqual(4); 
            expect(result[0].toString()).toEqual('5S'); 
            expect(input[0].toString()).toEqual('5D'); 

        });
    });
});
