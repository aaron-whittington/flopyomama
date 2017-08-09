
nsCard =  { 
    compareCards: function(card1, card2) {
        if (card2.get('rank') !== card1.get('rank'))
            return card2.get('rank') - card1.get('rank');
        else 
            return card2.get('suit') - card1.get('suit');

    }, 
    sortCardArray: function(cardArray, preserveOriginal = true) {
        var cardClone = preserveOriginal ? cardArray.slice() : cardArray;  
        cardClone.sort(nsCard.compareCards);
        return cardClone;
    }
};

module.exports = nsCard;
