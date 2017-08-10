describe("Pair", function() {

	var Pair = require('../Dev/JS/Pair/Pair');
	var pair;

	it('should create suited and unsuited pairs ', function() {
        pair = new Pair('AKs');
        expect(pair.get('suited')).toBeTruthy();

        pair = new Pair('AKo');
        expect(pair.get('suited')).toBeFalsy();
	});

    it('should split into correct cards (offsuit) ', function() {
        pair = new Pair('Q3o');
        var result = pair.toArray();
        expect(result.length).toEqual(12);
    });

    it('should split into correct cards (suited) ', function() {
        pair = new Pair('56s');
        var result = pair.toArray();
        expect(result.length).toEqual(4);
    });

    it('should handle pocket pairs', function() {
        pair = new Pair('77');
        var result = pair.toArray();
        expect(result.length).toEqual(6);
    });

    xit('should filter out correctly', function() {
        var aFilter = [];
        var result = pair.toArray(aFilter);
    });
});
