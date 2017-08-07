var _=require('underscore');
var AWCollection = require('../Core/AWCollection');
var FixedRange = require('./FixedRange');

var FixedRangeList = AWCollection.extend({
    model: FixedRange,
    initialize: function() {
        this.initLocalData();
        this.loadAll();
        this.on('remove', this.toLocalData);
        this.on('add', this.toLocalData);
    },
    initLocalData: function() {
        //do nothing, if it's already there
        var test = nsUtil.fGetLocalStorage(FixedRangeList.displayKey);

        if (nsUtil.fType(test) === 'array') {
            return;
        } else {
            var toSet = _.keys(FixedRangeList.default);
            nsUtil.fSetLocalStorage(FixedRangeList.displayKey, toSet);
        }
    },
    //loads list, accoring to displayKey, first trying from localStorage
    //and then trying from the defaults
    loadAll: function() {
        var toLoad = nsUtil.fGetLocalStorage(FixedRangeList.displayKey),
            that = this;
        this.remove();
        _.each(toLoad, function(key) {
            var test = nsUtil.fGetLocalStorage(FixedRangeList.itemPrefix + key);
            if (test) {
                that.add(test);
            } else if (FixedRangeList.default[key]) {
                that.add(FixedRangeList.default[key]);
            } else {
                alert("Error: could not load fixed range: " + key);
            }
        });
    },
    //writes the list of keys to localstorage
    //based on the current state of the collection
    toLocalData: function() {
        var ids = this.pluck('id');
        nsUtil.fSetLocalStorage(FixedRangeList.displayKey, ids);
    }
});

FixedRangeList.itemPrefix = "fixed_range_";
FixedRangeList.displayKey = "fixed_range_list";

//ranges stored in js for the start
FixedRangeList.default = {
    "nit": {
        "name": "Nit",
        "desc": "A very tight player",
        "sliderVal": 7,
        "sliderScale": "statistical",
        "custom": null
    },
    "tag": {
        "name": "Tag",
        "desc": "Strong player: tight and agressive",
        "sliderVal": 11,
        "sliderScale": "sklansky",
        "custom": null
    },
    "lag": {
        "name": "Lag",
        "desc": "Strong player: loose and agressive",
        "sliderVal": 19,
        "sliderScale": "sklansky",
        "custom": [{
                "key": "44",
                "selected": true
            },
            {
                "key": "33",
                "selected": true
            },
            {
                "key": "22",
                "selected": true
            }
        ]
    },
    "agrofish": {
        "name": "Agrofish",
        "desc": "A very agressive bad player",
        "sliderVal": 25,
        "sliderScale": "statistical",
        "custom": [{
                "key": "K5s",
                "selected": false
            },
            {
                "key": "K4s",
                "selected": false
            },
            {
                "key": "33",
                "selected": true
            },
            {
                "key": "22",
                "selected": true
            }
        ]
    },
    "pairs": {
        "name": "Pairs",
        "desc": "Plays only pocket pairs",
        "sliderVal": 0,
        "sliderScale": "statistical",
        "custom": [{
                "key": "AA",
                "selected": true
            },
            {
                "key": "KK",
                "selected": true
            },
            {
                "key": "QQ",
                "selected": true
            },
            {
                "key": "JJ",
                "selected": true
            },
            {
                "key": "TT",
                "selected": true
            },
            {
                "key": "99",
                "selected": true
            },
            {
                "key": "88",
                "selected": true
            },
            {
                "key": "77",
                "selected": true
            },
            {
                "key": "66",
                "selected": true
            },
            {
                "key": "55",
                "selected": true
            },
            {
                "key": "44",
                "selected": true
            },
            {
                "key": "33",
                "selected": true
            },
            {
                "key": "22",
                "selected": true
            }
        ]
    }
};

module.exports = FixedRangeList;