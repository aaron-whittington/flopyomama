"strict mode";
var MenuList = require('./MenuList');
var AWCollectionModel = require('../Core/AWCollectionModel');

var MenuListModel = AWCollectionModel.extend({
    className: 'MenuListModel',
    collection: MenuList
});

module.exports = MenuListModel;
