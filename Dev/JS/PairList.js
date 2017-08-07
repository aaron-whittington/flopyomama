
var AWCollection = require('./core/AWCollection');

var PairList = AWCollection.extend({
    className: 'PairList',
    model: Pair
});

module.exports = PairList;
