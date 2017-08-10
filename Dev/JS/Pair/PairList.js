
var AWCollection = require('../Core/AWCollection');
var Pair = require('./Pair');

var PairList = AWCollection.extend({
    className: 'PairList',
    model: Pair
});

module.exports = PairList;
