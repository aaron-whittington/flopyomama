var AWModel = require('../Core/AWModel');
var MenuItem = AWModel.extend({
    className: 'MenuItem',
    defaults: {
        selectable: true,
        selected: false,
        action: null,
        value: 1,
        dispayValue: this.value,
        divider: false,
        group: null
    },
    initialize: function(o) {

    }
});

module.exports = MenuItem;