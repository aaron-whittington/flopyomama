var nsMath = require('../Core/Math')


ICM = function(chipCounts, prizeStructure) {
    var that = this;
    this.chipCounts = chipCounts;
    this.prizeStructure = prizeStructure;
 

    var getFirstPlaceChances = function() {

         // first get first place chances
        var firstPlaceChances = that.chipCounts.map(function(chipCount){
             return chipCount / totalChips;
        });

        return firstPlaceChances;
    } 
    
    var generateRecursiveTree = function(chipCounts, multipliedChance = 1.0, depth = 1) {

        var totalChips = chipCounts.map(function(c) {
            return c.count;
        }).reduce(nsMath.sum);

        var nodes = chipCounts.map(function(chipCount, i){

            var remainder = chipCounts.slice();
            remainder.splice(i, 1);
            
            var winChance = chipCount.count / totalChips
            var accumulateChance = winChance * multipliedChance; 
            var newMultiplier = winChance * multipliedChance;
            var newDepth = depth + 1;
            return {
                chipCount: chipCount,
                winChance: winChance,
                accumulateChance: accumulateChance,
                depth: depth, 
                sub: remainder.length ? generateRecursiveTree(remainder, newMultiplier, newDepth) : null
            };
        });

        return nodes;
    }

    var traverseTree = function(tree, prize, player, cb) {
         tree.forEach(function(t) {

            if(t.chipCount.index == player && t.depth == prize) {
                cb(t);
            }
            if (t.sub) {
                traverseTree(t.sub, prize, player, cb);
            }
             
         });
    };

    this.getPrizeChances = function() {

        //first convert chipCounts to object, so we don't lose indices
        var chipCountObjects = that.chipCounts.map(function(c, i) {
            return {count: c, index: i}; 
        });

        var tree = generateRecursiveTree(chipCountObjects);         
        var sum;
        var results = [];
        for(i=0; i< that.chipCounts.length ; i++) {
            results[i] = [];
            for (var j=1; j <= that.prizeStructure.length; j++) {
                
                sum = 0.0; 
                traverseTree(tree, j, i, function(t) {
                    sum += t.accumulateChance;    
                });
                results[i].push(sum);
            }
        }

        return results;

    }
};

module.exports = ICM;