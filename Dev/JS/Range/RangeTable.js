var RangeItemList = require('./RangeItemList');

var RangeTable = RangeItemList.extend({
    className: 'RangeTable',
    initialize: function() {

        for (rank1 = 14; rank1 > 1; rank1--) {
            for (rank2 = 14; rank2 > 1; rank2--) {
                var rangeItem = {
                    pair: {
                        rank1: rank1,
                        rank2: rank2,
                        suited: (rank1 > rank2)
                    }
                };
                this.add(rangeItem);
            }
        }

        this.amChanged = [];
        this.on('change', function(mod) {
            this.amChanged.push(mod);
        });

        this.on('finalize', function() {
            this.trigger('updateModels', this.amChanged);
            this.amChanged = [];
        });

        /*if (routerValues.custom) {
            this.setCustom(routerValues.custom);
        }*/

    },
    listenToSlider: function(slider) {
        this.listenTo(slider, 'change:value', function() {
            this.fSetFromRangeFunction(slider);
        });

        this.listenTo(slider, 'finalize', function() {
            this.trigger('finalize');
        });
    },
    lastRangeVal: 0.0,
    fSetFromRangeFunction: function(slider) {
        var value = slider.get('value');
        var fRange = slider.get('fRangeFunction');
        var aHits = fRange(value / 100.0);
        nsUtil.fLog('calling range function');
        //if (this.lastRangeVal > value) {
        //getting small just
        var models = this.where({
                'selected': true
            }),
            i;
        for (i = 0; i < models.length; i++) {
            models[i].safeSetSelected(false);
        }

        for (i = 0; i < aHits.length; i++) {
            var rangeItem = this.findPairString(aHits[i]);
            rangeItem.safeSetSelected(true);
        }
        this.lastRangeVal = value;

    },
    rangeItemAt: function(rank1, rank2) { //search for a row or a column
        if (!_.isUndefined(rank2))
            return this.findWhere({
                rank1: rank1,
                rank2: rank2
            });
        else
            return this.find({
                rank1: rank1
            });
    },
    tableLoop: function(fnRow, fnCol) {
        for (rank1 = 14; rank1 > 1; rank1--) {
            fnRow(this.rangeItemAt(rank1, rank2));
            for (rank2 = 14; rank2 > 1; rank2--) {
                fnCol(this.rangeItemAt(rank1, rank2));
            }
        }
    },
    findPairString: function(input) {
        var returnMod = null;
        this.forEach(function(mod) {
            if (mod.get('key') === input) {
                returnMod = mod;
                return false;
            }
        });
        return returnMod;
    },
    getCustom: function(clone) {
        var custom = this.where({
            custom: true
        });
        if (!clone) {
            return custom;
        } else {
            return _.map(custom, function(o) {
                return o.clone();
            });
        }
    },
    //todo, the clear custom button doesn't currently call this
    clearCustom: function() {
        _.each(this.getCustom(), function(m) {
            m.set('custom', false);
        });
    },
    //sets the custom cards from the custom string (AKo+, KK-)...etc.
    setCustom: function(sCustom) {
        if (!sCustom) {
            return;
        }

        //split on plus, minus, but not end
        var aCustom = sCustom.split(','),
            that = this;
        _.each(aCustom, function(c) {
            var pairName = c.substring(0, c.length - 1);
            var inclusion = c.substring(c.length - 1, c.length);
            var rangeItem = that.findPairString(pairName);
            rangeItem.set('custom', true);
            var selected = inclusion === '+' ? true : false;
            rangeItem.set('selected', selected);
        });
    }

});

module.exports = RangeTable;
