
var nsCard =  { 
    compareCards: function(card1, card2) {
        if (card2.get('rank') !== card1.get('rank'))
            return card2.get('rank') - card1.get('rank');
        else 
            return card2.get('suit') - card1.get('suit');
    }, 
    sortCardArray: function(cardArray, preserveOriginal) {
        if (typeof preserveOriginal == 'undefined') preserveOriginal = true;
        var cardClone = preserveOriginal ? cardArray.slice() : cardArray;  
        cardClone.sort(nsCard.compareCards);
        return cardClone;
    }, 
    standardizeSuits: function(cardArray, preserveOriginal) {
        if (typeof preserveOriginal == 'undefined') preserveOriginal = true;
        var cardClone = preserveOriginal ? cardArray.slice() : cardArray;  
        //physically clone all cards
        //TODO, get rid of this stuff and make Card objects immutable (non Backbone objects)
        if(preserveOriginal)
            cardClone = cardClone.map(function(c) {
               return c.clone();
            });
 
        var suitsFound = [];
        var targetSuits = [4,3,2,1];
        var i;
        for( i=0; i<cardClone.length; i++) {
            if(suitsFound.indexOf(cardClone[i].get('suit')) < 0) {
                suitsFound.push(cardClone[i].get('suit'));
            } 
        }
        var indexOfFoundSuit;
        for( i=0; i<cardClone.length; i++) {
            indexOfFoundSuit = suitsFound.indexOf(cardClone[i].get('suit'));
            cardClone[i].set('suit', targetSuits[indexOfFoundSuit]);
        }
        return cardClone;
    }
};

module.exports = nsCard;
