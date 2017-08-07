var MenuItem = require('./MenuItem');
var AWCollection = require("../Core/AWCollection");
var MenuList = AWCollection.extend({
    className: 'MenuCollection',
    model: MenuItem
});

module.exports = MenuList;