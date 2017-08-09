var RangeTable = require('../Range/RangeTable');
var Deck = require('../Card/Deck');
var Card = require('../Card/Card');
var nsMath = require('../Core/Math');
var Preflop = require('../Card/Preflop');
var nsHand = require('../Hand/NSHand');
var o = require('../Card/PreflopData'); 
fs = require('fs');
sleep = require('system-sleep');
var keyInEnormousObjectExists = function(key) {
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

var setInEnormousObject = function(key, value) {
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

var deckPermutations = function() {
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
                getExactPreflopOdds(heroCard1, heroCard2, villainHand[0], villainHand[1]);
                counter++;
                console.log('PERCENT DONE: ' + (100 * (counter / totalNumberOfCombinations)) );
            }); 
        }
    );

    console.log('DONE !!!');
    console.log(JSON.stringify(o));

} 

var getExactPreflopOdds = function(heroCard1, heroCard2, badGuyCard1, badGuyCard2) {
    //this finds exact odds against two specific hands
    
    var deck = new Deck();

    var preflop = new Preflop(heroCard1, heroCard2, badGuyCard1, badGuyCard2);
    
    var normalizedPreflop = preflop.getNormalizedPreflop();

    //now check for key
    var key = normalizedPreflop.getKey();
    if(keyInEnormousObjectExists(key)) {
        console.log('key already exists: ' + key);
        console.log('original hand was: ');
        console.log(heroCard1.toString() + heroCard2.toString() +
             ' vs ' + badGuyCard1.toString() + badGuyCard2.toString() );
        return;
    };

    sleep(5000); //give the system a break
    var toRemove = new CardList();
    toRemove.add(normalizedPreflop.getHeroCards());
    toRemove.add(normalizedPreflop.getVillainCards()); 

    var remaining = deck.getDifference(toRemove, true);
    var boards = nsMath.combine(remaining, 5);

    console.log("Get exact odds for key: " + key);

    var board, heroHand, badGuyHand, wins = 0, losses=0, draws=0;

    for(var i=0; i<boards.length; i++) {
        board = boards[i];
        heroHand = [heroCard1.attributes, heroCard2.attributes].concat(board);
        badGuyHand = [badGuyCard1.attributes, badGuyCard2.attributes].concat(board);

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
    var results = [getResultNumber(wins,boards.length), getResultNumber(draws,boards.length)]; 

    setInEnormousObject(key, results);    
    console.log(key + ' DONE');


    var toWriteString = "o = " + JSON.stringify(o) + ";\n\n";
    toWriteString = toWriteString +  "module.exports = o;\n"; 
    fs.writeFileSync('../Card/PreflopData.js', toWriteString);
};

function getResultNumber(number, total) {
    var percent = number / total;
    return Math.round(percent * 100000);
};

deckPermutations();
