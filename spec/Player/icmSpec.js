
describe("ICM", function() {

	var ICM = require('../../Dev/JS/Player/ICM');
	var icm1, icm2;
	beforeEach(function() {
        var prizeStructure = [100,60,40];
        var prizeStructure2 = [50,30,20];
        var chipCounts1 = [6000, 3000, 1000];
        var chipCounts2 = [5000, 2000, 1500, 5000];
        icm1 = new ICM(chipCounts1, prizeStructure);
        icm2 = new ICM(chipCounts2, prizeStructure2);
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
    
    it('shouldCalculateEquity', function() {
        var equity = icm1.getEquity();
        equity = equity.map(function(e){
            return +(e.toFixed(2)); 
        });
        expect(equity).toEqual([82.48, 67.67, 49.86]);
    });

    it('shouldCalculateEquity2', function() {
        var equity2 = icm2.getEquity();
        equity2 = equity2.map(function(e){
            return +(e.toFixed(2)); 
        });
        //matches another online ICM calculator
        //Harrington's values seem to be wrong
        expect(equity2).toEqual([32.68, 19.45, 15.19, 32.68]);
    });
});
