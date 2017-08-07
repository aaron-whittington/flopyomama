var nsMath = require('../Dev/JS/Maths');

it('should calculate combinations correctly', function() {
        expect(nsMath.combine([1,2,3], 1)).toEqual([[1],[2],[3]]);
        
        var threeTakeTwo = nsMath.combine([1,2,3],2);

        expect(threeTakeTwo.length).toEqual(3);
        expect(threeTakeTwo).toContain([1,3]);
        expect(threeTakeTwo).toContain([1,2]);
        expect(threeTakeTwo).toContain([2,3]);
});


it('should calculate number of combinations correctly', function() {
	expect(nsMath.numberOfCombinations(3, 2)).toEqual(3);
	expect(nsMath.numberOfCombinations(4, 2)).toEqual(6);
});

it('should calculate factorials correctly', function() {
	expect(nsMath.factorial(3)).toEqual(6);
	expect(nsMath.factorial(4)).toEqual(24);
	expect(nsMath.factorial(0)).toEqual(1);
	expect(nsMath.factorial(1)).toEqual(1);
});

it('should shuffle correctly', function() {
        var toShuffle = [1,2,3];
        var shuffled = nsMath.shuffle([1,2,3]);
	expect(shuffled).toContain(1);
	expect(shuffled).toContain(2);
	expect(shuffled).toContain(3);
        expect(shuffled.length).toEqual(3);
});
