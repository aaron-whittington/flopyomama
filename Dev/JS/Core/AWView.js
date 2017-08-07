"strict mode"
var Backbone = require('backbone');
var AWView = Backbone.View.extend({
    className: 'AWView',
    constructor: function() {
        var prm = arguments;
        Backbone.View.apply(this, prm);
    }
});

module.exports = AWView;