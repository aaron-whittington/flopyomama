RangeTable = require('../Range/RangeTable');
Deck = require('../Card/Deck');
Card = require('../Card/Card');
nsMath = require('../Core/Math');
Preflop = require('../Card/Preflop');
nsHand = require('../Hand/NSHand');

fs = require('fs');
sleep = require('system-sleep');

if (fs.existsSync('../Card/PreflopData.js'))
    o = require('../Card/PreflopData'); 
else 
    o = {};

ns = {};

ns.keyInEnormousObjectExists = function(key) {
    var aKey = key.split('-');
    var key1 = aKey[0];
    var key2 = aKey[1];
    var key3 = aKey[2];
    var key4 = aKey[3];
    if(o.hasOwnProperty(key1) &&
       o[key1].hasOwnProperty(key2) &&
       o[key1][key2].hasOwnProperty(key3) &&
       o[key1][key2][key3].hasOwnProperty(key4))
       return true;
     
    return false;
}

ns.setInEnormousObject = function(key, value) {
    var aKey = key.split('-');
    var key1 = aKey[0];
    var key2 = aKey[1];
    var key3 = aKey[2];
    var key4 = aKey[3];

    if(!o.hasOwnProperty(key1))  
        o[key1] = {};

    if(!o[key1].hasOwnProperty(key2))
        o[key1][key2] = {};

    if(!o[key1][key2].hasOwnProperty(key3)) 
        o[key1][key2][key3] = {};

    if(o[key1][key2][key3].hasOwnProperty(key4))
         throw 'should not set key twice';

    o[key1][key2][key3][key4] = value; 
}

ns.deckPermutations = function() {
    rangeTable = new RangeTable(); 
    var counter = 0;
    var totalNumberOfCombinations = 16 * 16 * nsMath.numberOfCombinations(50,2); 
    rangeTable.tableLoop(function() {
    
        }, function(rangeItem) {
            var deck = new Deck();
            var toRemove = new CardList();

            var pair = rangeItem.get('pair'); 
            var representativePair = pair.toArray()[0];

            var heroCard1 = new Card(representativePair[0]), 
                heroCard2 = new Card(representativePair[1]); 
            
            toRemove.add(heroCard1);
            toRemove.add(heroCard2);
            
            var remaining50Cards = deck.getDifference(toRemove);

            if (remaining50Cards.length !== 50 ) {
                throw 'wrong length of remaining50Cards';
            }

            var villainHands = nsMath.combine(remaining50Cards, 2);
             
            villainHands.forEach(function(villainHand, i) {
                var results = ns.getExactPreflopOdds(heroCard1, heroCard2, villainHand[0], villainHand[1]);

                counter++;

                console.log('PERCENT DONE: ' + (100 * (counter / totalNumberOfCombinations)) );
                console.log('PERCENT DONE FOR HERO PAIR: ' + 100 * (i/villainHands.length));
            }); 
        }
    );

    console.log('DONE !!!');
    console.log(JSON.stringify(o));

} 

var test = function() {
    getExactPreflopOdds(new Card('AS'), new Card('AH'), new Card('AD'), new Card('7S')); 
}

//this finds exact odds against two specific hands
ns.getExactPreflopOdds = function(heroCard1, heroCard2, badGuyCard1, badGuyCard2) {

    var deck = new Deck();

    var preflop = new Preflop(heroCard1, heroCard2, badGuyCard1, badGuyCard2);
    
    var normalizedPreflop = preflop.getNormalizedPreflop();

    //now check for key
    var key = normalizedPreflop.getKey();
    if(ns.keyInEnormousObjectExists(key)) {
        console.log('key already exists: ' + key);
        console.log('original hand was: ');
        console.log(heroCard1.toString() + heroCard2.toString() +
             ' vs ' + badGuyCard1.toString() + badGuyCard2.toString() );
        return;
    };

    sleep(10000); //give the system a break
    var toRemove = new CardList();
    toRemove.add(normalizedPreflop.getHeroCards().models);
    toRemove.add(normalizedPreflop.getVillainCards().models); 

    if(toRemove.models.length !== 4) {
        throw 'aaron, wake up';
    }

    var remaining = deck.getDifference(toRemove, true);
    var debugString = '';
    if(remaining.length !== 48) {
        debugString = 'aaron, wake up again: ' + remaining.length;
        throw debugString;
    }

    var boards = nsMath.combine(remaining, 5);

    console.log("Get exact odds for key: " + key);

    var board, heroHand, badGuyHand, wins = 0, losses=0, draws=0;

    for(var i=0; i<boards.length; i++) {
        board = boards[i];
        heroHand = [heroCard1.attributes, heroCard2.attributes].concat(board);
        badGuyHand = [badGuyCard1.attributes, badGuyCard2.attributes].concat(board);
        
        if(heroHand.length != 7) {
            throw 'hero hand length wrong';
        }

        if(badGuyHand.length != 7) {
            throw 'badguy hand length wrong';
        }

        heroHand = nsHand.fGetBestHand(heroHand);
        badGuyHand = nsHand.fGetBestHand(badGuyHand);

        winRecord = nsHand.fCompareHand(heroHand, badGuyHand) * -1;

        if(winRecord > 0) {
            wins++;
        } else if(winRecord < 0) {
            losses++;
        } else {
            draws++;
        }

    }

    var results = [ns.getResultNumber(wins,boards.length),
         ns.getResultNumber(draws,boards.length)]; //losses for debugging 

    ns.setInEnormousObject(key, results);    
    console.log(key + ' DONE. Results: ' + JSON.stringify(results));

    var toWriteString = "o = " + JSON.stringify(o) + ";\n\n";
    toWriteString = toWriteString +  "module.exports = o;\n"; 
    fs.writeFileSync('../Card/PreflopData.js', toWriteString);

    return results;
};

ns.MULTIPLIER = 1000000;

ns.getResultNumber = function(number, total) {
    var percent = number / total;
    return Math.round(percent * ns.MULTIPLIER);
};
ns.deckPermutations();
//module.exports = ns;
