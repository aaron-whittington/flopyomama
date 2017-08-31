var AWCollection = require('../Core/AWCollection');
var RangeItem = require('./RangeItem');

var RangeItemList = AWCollection.extend({
    className: 'RangeItemListNew',
    model: RangeItem
});

module.exports = RangeItemList;