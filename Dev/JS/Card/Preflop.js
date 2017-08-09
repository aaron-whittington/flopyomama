nsCard = require('./NSCard');

Preflop = function (a1, a2, b1, b2) {

    //order the cards in each hand by rank
    heroCards = new CardList(a1,a2); 
    villainCards = new CardList(b1,b2);    
    heroCards.sort();
    villainCards.sort();

    this.getHeroCards() = function() {
        return heroCards; 
    };
    
    this.getVillainCards() = function() {
        return villainCards; 
    };

    this.isNormalized = false;
    this.wasReversedByNormalization = false;

    // returns a suit-normalized and hand order normalized preflop
    // the suits may have changed and/or the order  
    var getNormalizedPreflop = function() {
        var normalizedPreflop;
        
        if(compareHands([this.a1,this.a2],[this.b1, this.b2]) > 0) {
            normalizedPreflop = new Preflop(this.b1, this.b2, this.a1, this.a2);
            normalizedPreflop.wasReversedByNormalization = true;
        } else {
            normalizedPreflop = new Preflop(this.a1, this.a2, this.b1, this.b2);
        }
        
        normalizedPreflop.standardizeSuits();
        
        normalizedPreflop.isNormalized = true;
        return normalizedPreflop; 
    }
    
    var compareHands = function(hand1, hand2) {
        //first compare first card of each hand ranks
        var diff = hand2[0].get('rank') - hand1[0].get('rank'); 
        if (diff != 0) {return diff;}

        //then compare ranks of the second cards, if equal
        var diff = hand2[1].get('rank') - hand1[1].get('rank'); 
        if (diff != 0) {return diff;}

        //rank was alike, for both cards, so now we compare suit of first card
        return hand2[0].get('suit') - hand1[0].get('suit');
    }

    var getKey = function() {
        if (!this.isNormalized) {
            throw 'you must call this method on a normalized Preflop';
        } 

        return this.a1.toString() + '-' +
            this.a2.toString() + '-' +
            this.b1.toString() + '-' +
            this.b2.toString();
    }

    this.standardizeSuits = function() {
        var cardList = new CardList(
            this.a1,
            this.a2,
            this.b1,
            this.b2
        );
        cardList.s
    }
}; 


module.exports = Preflop;

