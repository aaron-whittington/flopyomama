


var deckPermutations = function() {
     
    flopYoMama.rangeTable.tableLoop(function() {
    
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

            var villainHands = fCombinatorics(remaining50Cards, 2);
            var counter = 1;
            
            
            villainHands.forEach(function(villainHand, i) {

                console.log(
                    heroCard1.toString() + heroCard2.toString() + ' vs ' +
                    villainHand[0].toString() + villainHand[1].toString());
                /*console.log('Progress: ' + ((i+1) / (villainHands.length* 13 * 13)));
                getExactPreflopOdds(heroCard1, heroCard2, villainHand[0], villainHand[1]);
                if((counter) % 13 == 0) {
                   console.log('Progress Dump ' + JSON.stringify(enormousOddsObject));
                }*/

                counter++;
            }); 
            throw "that's enough";
        }
    );

    console.log('DONE ');
    console.log(JSON.stringify(enormousOddsObject));

} 

var getExactPreflopOdds = function(heroCard1, heroCard2, badGuyCard1, badGuyCard2) {
    //this finds exact odds against two specific hands
    
    var deck = new Deck();
    var toRemove = new CardList();

    //sort the cards inside the hands to avoid duplicates
    var first = heroCard1.get('rank') > heroCard2.get('rank') ? heroCard1 : heroCard2;
    var second = heroCard1.get('rank') > heroCard2.get('rank') ? heroCard2 : heroCard1;
    var third = badGuyCard1.get('rank') > badGuyCard2.get('rank') ?  badGuyCard1: badGuyCard2;
    var fourth = badGuyCard1.get('rank') > badGuyCard2.get('rank') ?  badGuyCard2: badGuyCard1;

    toRemove.add(first);
    toRemove.add(second);
    toRemove.add(third);
    toRemove.add(fourth);

    var key = fGetKeyFromHandList(toRemove);

    if(fAlreadyHasKey(key)) {
        return;
    };

    var remaining = deck.getDifference(toRemove, true);
    var boards = fCombinatorics(remaining, 5);

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
    
    var results = [wins/boards.length, draws/boards.length, losses/boards.length]; 
    
    enormousOddsObject[key] = results;

    console.log('results ' + key + ' ' + JSON.stringify(results));

};


