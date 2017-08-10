
var AWModel = require('../Core/AWModel');
var Pair = require('../Pair/Pair');

var RangeItem = AWModel.extend({
    className: 'RangeItem',
    defaults: {
        filter: [],
        selected: false,
        custom: false
    },
    initialize: function(o) {

        if (!(o.pair instanceof Pair)) {
            this.set('pair', new Pair(o.pair));
        }

        for (var prop in o.pair) {
            this.set(prop, o.pair[prop]);
        }
        this.set('key', this.get('pair').toString());
    },
    safeSetSelected: function(val) {
        if (!this.get('custom')) {
            this.set('selected', val);
        }
    },
    //string representing the custom status AK+ or AK- 
    //empty string represents non-custom fields
    toCustomString: function() {
        if (!this.get('custom')) {
            return "";
        }
        return this.get('pair').toString() +
            (this.get('selected') ? '+' : '-');
    }
});

module.exports = RangeItem;
