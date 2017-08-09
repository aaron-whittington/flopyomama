var Card = require('./Card');
var AWCollection = require('../Core/AWCollection');
var nsCard = require('./NSCard');

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
    }, 
    sort: function() {
        nsCard.sortCardArray(this.models, false);
    }
});

module.exports = CardList;
