var nsRange = require('../Range/RangeLibrary');
require('backbone');

var Slider = Backbone.Model.extend({
    defaults: {
        value: 18,
        fRangeFunction: nsRange.getSlanskyFromPercent,
        max: 50,
        min: 0
    },
    initialize: function() {
        var fRangeFunction = null;
        var rangeFunctionStored = nsUtil.fGetLocalStorage("range_type");

        fRangeFunction = this.getFnFromScaleId(rangeFunctionStored);

        if (fRangeFunction) {
            this.set("fRangeFunction", fRangeFunction);
        }

        this.on('change:value', function() {
            var value = this.get('value');
            if (value > this.max)
                this.set({
                    'value': this.max
                });
            else if (value < this.min)
                this.set({
                    'value': this.min
                });
        });

        this.on('change:fRangeFunction', function() {
            this.trigger('finalize');
            var id,
                f = this.get('fRangeFunction');

            id = this.getScaleIdFromFn(f);

            nsUtil.fSetLocalStorage("range_type", id);
        });

        this.on('finalize', function(value) {
            if (_.isNull(value) || _.isUndefined(value))
                value = this.get('value');

            console.log("range slider finalize with value " + value);

            nsUtil.fSetLocalStorage("range_slider_val", value);

            var oldValue = this.get('value');

            this.set('value', value);
            if (oldValue === value)
                this.trigger('change:value');

        });
    },
    getScaleId: function() {
        var fn = this.get('fRangeFunction');
        return this.getScaleIdFromFn(fn);
    },
    getScaleIdFromFn: function(fn) {
        return fn === nsRange.getStatisticalFromPercent ? "statistical" : "sklansky";
    },
    getFnFromScaleId: function(id) {
        return id === "statistical" ? nsRange.getStatisticalFromPercent : nsRange.getSlanskyFromPercent;
    }
});

