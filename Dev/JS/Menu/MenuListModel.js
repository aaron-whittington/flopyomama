"strict mode";
var _ = require('underscore');
var MenuList = require('./MenuList');
var AWCollectionModel = require('../Core/AWCollectionModel');

var MenuItemGroup = function(name, exclusive) {
    if (_.isUndefined(exclusive))
        exclusive = false;
    if (_.isUndefined(name))
        name = "main";
};

var MenuListModel = AWCollectionModel.extend({
    className: 'MenuListModel',
    collection: MenuList
});

module.exports = MenuListModel;
