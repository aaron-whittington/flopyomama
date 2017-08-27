
describe("ICM", function() {

	var ICM = require('../../Dev/JS/Player/ICM');
	var icm1;
	beforeEach(function() {
        var prizeStructure = [100,60,40];
        var chipCounts1 = [6000, 3000, 1000];
		icm1 = new ICM(chipCounts1, prizeStructure);
	}); 

	it('should calculate itm chances', function() {
        var prizeChances = icm1.getPrizeChances(); 

        prizeChances.forEach(function(pc) {
            pc.forEach(function(inner, i) {
                pc[i] = +(inner.toFixed(3));
            });
        }); 

        expect(prizeChances).toEqual(
           [
               [0.600, 0.324, 0.076],
               [0.300, 0.483, 0.217],
               [0.100, 0.193, 0.707]
           ]
        );
	});

});
