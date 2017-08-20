
var nsMath= {};

nsMath.combine = function(aN, k) {
    if (k === 0)
        return [];

    var aDisplace = [];

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

    while (aDisplace[0] !== max) {
        //print result

        //find first column less than max
        for (i = aDisplace.length - 1; i >= 0; i--) {
            if (aDisplace[i] < max) {

                var currentAdd = aDisplace[i] + 1;
                aDisplace[i] = currentAdd;
                for (j = i + 1; j < aDisplace.length; j++) aDisplace[j] = Math.min(currentAdd, aDisplace[j]);

                break;
            } //end iff
        } //end for
        fAddFoundArray();
    } //end while
    return returnArray;
}; // end func

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
}

module.exports = nsMath;
