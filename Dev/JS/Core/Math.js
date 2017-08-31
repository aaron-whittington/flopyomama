
var nsMath= {};

nsMath.combine = function(aN, k) {

    if (k === 0)
        return [];
    
    if(k > aN.length) {
        throw "k cannot be greater than the length of the array";
    }

    var aDisplace = [], i;
 
    for (i = 0; i < k; i++)
        aDisplace[i] = 0;

    var returnArray = [];
    var max = aN.length - aDisplace.length; //w
    var currentColumn = aDisplace.length - 1;
    var fAddFoundArray = function() {
        var addArray = [];
        var aDisplaceLength = aDisplace.length;
        for (i = 0; i < aDisplaceLength; i++) {
            addArray[i] = aN[i + aDisplace[i]];
        }
        returnArray.push(addArray);
    };
    fAddFoundArray();

    var j;

    while (aDisplace[0] !== max) {

        //find first column less than max
        for (i = aDisplace.length - 1; i >= 0; i--) {
            if (aDisplace[i] < max) {

                var currentAdd = aDisplace[i] + 1;
                aDisplace[i] = currentAdd;
                for (j = i + 1; j < aDisplace.length; j++) 
                    aDisplace[j] = Math.min(currentAdd, aDisplace[j]);

                break;
            } //end iff
        } //end for
        fAddFoundArray();
    } //end while
    return returnArray;
}; // end func

nsMath.permute = function(aN, k) {
    if (k === 0)
        return [];
    
    if(k > aN.length) {
        throw "k cannot be greater than the length of the array";
    }
    
    //indices for first item example 0,1,2,3
    var first = [];
    for (var i = 0; i < k; i++)
        first[i] = i;


    function findNextFreeIndex(indexes, start) {
        for (var i=start; i < aN.length; i++) {
            if (indexes.indexOf(i) === -1) {
                return i;
            }
        }
        return -1;
    }

    function getNext(last) {
        //we push to next, then reverse it
        var next = last.slice();
        for(var depth = last.length -1; depth >= 0; depth--) {

             //max already achieved in this column
            if(last[depth] === aN.length-1) {
                if(depth === 0) {
                    //done
                    return false;
                } 
                //go to next column
                continue;
            } else {
                //we increment the current column to an available value
                var toSearch = next.slice(0,depth + 1);
                var nextAvailable = findNextFreeIndex(toSearch, last[depth] + 1);
                
                if(nextAvailable == -1) {;
                    continue;
                }

                next[depth] = nextAvailable;

                //now set the remaining columns to lowest possible values
                for(var j = depth + 1; j < last.length; j++) {
                    next[j] = findNextFreeIndex(next.slice(0,j), 0);
                } 
                
                return next;
            } 
        } 
    }

    var results = [first];
    do  { 
        first = getNext(first);
        if (first === false) {
            break;
        } else {
            results.push(first);
        }
    } while (true);

    //now convert to actual objects
    return results.map(function(aIndices){
        return aIndices.map( function(i) { return aN[i]; });
    })
}

nsMath.numberOfCombinations = function(n, k) {
    return nsMath.factorial(n) / (nsMath.factorial(k) * nsMath.factorial(n - k));
};

nsMath.factorial = function(n) {
    if (n <= 1) return 1;
    return n *nsMath.factorial(n - 1);
};

nsMath.shuffle = function(aArray, iMaxSub) {
    var returnArray = [];
    var arrayLength = aArray.length;
    if (arrayLength === 0)
        return aArray;
    if (typeof iMaxSub === "undefined")
        iMaxSub = arrayLength;

    var randomIndex;
    for (var i = arrayLength; i > 0; i--) {
        randomIndex = Math.floor((Math.random() * (i - 1)));
        returnArray.push(aArray[randomIndex]);
        if (returnArray.length >= iMaxSub)
            return returnArray;
        aArray.splice(randomIndex, 1);
    }

    return returnArray;
};

nsMath.randomIntBetween = function(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min; 
};

//for reduce callbacks
nsMath.sum = function(a, b) {
    return a + b;
};

//for reduce callbacks
nsMath.product = function(a, b) {
    return a * b;
};

module.exports = nsMath;
