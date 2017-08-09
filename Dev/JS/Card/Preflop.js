nsCard = require('./NSCard');
CardList = require('./CardList');

Preflop = function (a1, a2, b1, b2) {

    //order the cards in each hand by rank
    var heroCards = new CardList([a1,a2]); 
    var villainCards = new CardList([b1,b2]);    
    heroCards.sort();
    villainCards.sort();

    this.getHeroCards = function() {
        return heroCards; 
    };
    
    this.getVillainCards = function() {
        return villainCards; 
    };

    this.isNormalized = false;
    this.wasReversedByNormalization = false;

    this.reverse = function()  {
        var oldHero = heroCards;
        heroCards = villainCards;
        villainCards = oldHero;
        this.wasReversedByNormalization = true;
    }
    
    this.standardizeSuits = function() {
        var allFourAsArray = heroCards.models.concat(villainCards.models);
        var standardized = nsCard.standardizeSuits(allFourAsArray); 
        heroCards = new CardList([standardized[0],standardized[1]]);        
        villainCards = new CardList([standardized[2],standardized[3]]);        
    };

    // returns a suit-normalized and hand order normalized preflop
    // the suits may have changed and/or the order  
    this.getNormalizedPreflop = function() {
        var normalizedPreflop;
        var shouldReverse = false; 
        //switch hands if necessary        
        if(compareHands(heroCards,villainCards) > 0) {
            shouldReverse = true;
        }         

        normalizedPreflop = new Preflop(
            heroCards.models[0], 
            heroCards.models[1],
            villainCards.models[0],
            villainCards.models[1]
        );
 
        if(shouldReverse) {
             normalizedPreflop.reverse();
        } 
        normalizedPreflop.standardizeSuits();
        normalizedPreflop.isNormalized = true;

        return normalizedPreflop; 
    }
    
    var compareHands = function(hand1, hand2) {
        var diff;
        //first compare first card of each hand ranks
        diff = hand2.models[0].get('rank') - hand1.models[0].get('rank'); 
        if (diff !== 0) {return diff;}

        //then compare ranks of the second cards, if equal
        diff = hand2[1].models.get('rank') - hand1.models[1].get('rank'); 
        if (diff != 0) {return diff;}

        //rank was alike, for both cards, so now we compare suit of first card
        return hand2.models[0].get('suit') - hand1.models[0].get('suit');
    }

    this.getKey = function() {
        if (!this.isNormalized) {
            throw 'please normalize preflop';
        } 

        return heroCards.models.concat(villainCards.models).map(function(c){
                return c.toString();
            }).join('-'); 
    }
}
module.exports = Preflop;

