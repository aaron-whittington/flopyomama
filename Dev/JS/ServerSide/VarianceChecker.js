var nsMath = require('../Core/Math.js');



function simulateVariance(rewards, failure, iterations) {
    var sum = 0,
        place;
    for (var i=0; i<iterations; i++) {
        sum -= failure;
        place = nsMath.randomIntBetween(1,9);
        if (place < 4)  
           console.log('**ITM** ' + place);
        else 
           console.log('LOSS: ' + place); 

        sum += rewards[place - 1];
    }

    return sum;
}

//have to think about how to implement this
//var testChances = [1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9];
var testRewards = [14.23, 8.53, 5.68, 0, 0, 0, 0, 0, 0];
var testFailure = 3.16;
var testIterations = 500000;

var result = simulateVariance(testRewards, testFailure, testIterations);

console.log('You ended up with $ ' + result);
