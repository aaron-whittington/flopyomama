var AWCollection = require('../Core/AWCollection');
var RangeItem = require('./RangeItem');

var RangeItemList = AWCollection.extend({
    className: 'RangeItemListNew',
    model: RangeItem
});

/*var RangeItemListModel = AWCollectionModel.extend({
    className: 'RangeItemListModel',
    collection: RangeItemList
});*/

module.exports = RangeItemList;