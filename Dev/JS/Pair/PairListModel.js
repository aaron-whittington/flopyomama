
var PairList = require('./PairList');
var AWCollectionModel = require('../Core/AWCollectionModel');
var PairListModel = AWCollectionModel.extend({
    className: 'PairListModel',
    collection: PairList
});
module.exports = PairListModel;
