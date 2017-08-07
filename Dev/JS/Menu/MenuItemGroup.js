
var _ = require('underscore');
var MenuItemGroup = function(name, exclusive) {
    if (_.isUndefined(exclusive))
        exclusive = false;
    if (_.isUndefined(name))
        name = "main";
};

module.exports = MenuItemGroup;