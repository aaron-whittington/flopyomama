var AWModel = require('../Core/AWModel');

var FixedRange = AWModel.extend({
    initialize: function() {

        //convert custom objects to custom BB models
        var newCust,
            oldCust = this.get('custom');
        if (oldCust && oldCust.length > 0) {
            if (!(oldCust[0] instanceof RangeItem)) {
                newCust = _.map(oldCust, function(o) {
                    return new RangeItem({
                        pair: o.key,
                        selected: o.selected,
                        custom: true
                    })
                });
                this.set('custom', newCust);
            }
        }

        if (!this.get('id')) {
            this.set('id', this.getIdName());
        }
        this.on('change:name', function(val) {
            this.set('id', this.getIdName());
        });

        this.on('activate', function() {

            var rangeTable = flopYoMama.rangeTable;
            rangeTable.clearCustom();

            //custom board places 
            var custom = this.get('custom');
            _.each(custom, function(o) {
                var key = o.get('key');
                var selected = o.get('selected');
                var mod = rangeTable.findPairString(key);
                mod.set('custom', true);
                mod.set('selected', selected);
            });

            var slider = flopYoMama.slider;
            var sliderView = flopYoMama.sliderView;

            var fnRange = slider.getFnFromScaleId(
                this.get('sliderScale')
            );

            flopYoMama.slider.set('fRangeFunction', fnRange, {
                silent: true
            });
            sliderView.update(this.get('sliderVal'), {
                silent: true
            });

        });

        this.on('save', function() {
            console.log("FIXED RANGE LIST PREFIX" + FixedRangeList.itemPrefix);
            var key = FixedRangeList.itemPrefix + this.get('id');
            nsUtil.fSetLocalStorage(key, this.toJSON());
        });
    },
    getIdName: function() {
        return this.get('name').toLowerCase().replace(/ /g, '_');
    }
});

FixedRange.fromCurrent = function(slider, rangeTable) {
    var range = new FixedRange({
        id: "new_id",
        name: name,
        sliderVal: slider.get('value'),
        sliderScale: slider.getScaleId(),
        custom: rangeTable.getCustom(true)
    });
    return range;
};
module.exports = FixedRange;