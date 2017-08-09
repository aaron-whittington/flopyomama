var AWModel = require('../Core/AWModel');
var AWCollection = require('../Core/AWCollection');
var AWCollectionModel = require('../Core/AWCollectionModel');
var nsConvert = require('../Core/Convert');

//todo, make card a normal object instead of the weird get and set thing
var Card = AWModel.extend({
    className: 'Card',
    _stringToPrm: function(aArgs) {
        var cardString = aArgs[0];
        if (cardString.length !== 2)
            throw "card constructor called with invalid prop: " + aArgs[0];
        var rankChar = cardString[0].toUpperCase();
        var suitChar = cardString[1].toUpperCase();
        var rank = nsConvert.rankCharToNumber(rankChar);
        var suit = nsConvert.suitCharToNumber(suitChar);
        return {
            rank: rank,
            suit: suit
        };
    },
    _numToPrm: function(aArgs) {
        return {
            rank: aArgs[0],
            suit: aArgs[1]
        };
    },
    initialize: function() {
    },
    rankNumberToChar: function() {
        var i = this.get('rank');
        return nsConvert.rankNumberToChar(i);
    }, //maybe put these ones in a view...
    suitToDisplayChar: function() {
        var i = this.get('suit');
        return nsConvert.suitToDisplayChar(i);
    },
    suitToChar: function() {
        var i = this.get('suit');
        return nsConvert.suitToChar(i);
    },
    toString: function() {
        return this.rankNumberToChar() + this.suitToChar();
    },
    toDisplayString: function() {
        return this.rankNumberToChar() + this.suitToDisplayChar();
    }
});

var CardList = AWCollection.extend({
    className: 'CardList',
    _stringToPrm: function(aArgs) {
        //var prm = arguments;
        var aoCards = []
        var sCards = aArgs[0];
        if (sCards.indexOf(',') === -1) {
            var length = sCards.length;
            for (var i = 0; i < length; i += 2) {
                aoCards.push(new Card(sCards.substring(i, i + 2)));
            }
        } else {
            var aSplit = sCards.split(','); //separator
            var length = aSplit.length;
            for (var i = 0; i < length; i++) {
                aoCards.push(new Card(aSplit[i]));
            }
        }
        return aoCards;
    },
    model: Card,
    _objToPrm: function(aArgs) {
        var aoCards = [];
        var prm = aArgs[0];
        var length = prm.length;
        for (var i = 0; i < length; i++) {
            aoCards.push(new Card(prm[i]));
        }
        return aoCards;
    }
});


var CardListModel = AWCollectionModel.extend({
    className: 'CardListModel',
    collection: CardList
});

var CardListList = AWCollection.extend({
    className: 'CardListList',
    model: CardListModel
});

module.exports = Card;
