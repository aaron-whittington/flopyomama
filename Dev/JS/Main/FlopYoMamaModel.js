var nsUI = require('../Core/Ui');
var nsUtil = require('../Core/Util');
var nsFilter = require('../Filter/Filter');
var Deck = require('../Card/Deck');
var KnownCards = require('../KnownCards/KnownCards');
var KnownCardsView = require('../KnownCards/KnownCardsView');
var Slider = require('../Slider/Slider');
var SliderView = require('../Slider/SliderView');
var RangeTable = require('../Range/RangeTable'); 
var RangeTableView = require('../Range/RangeTableView');
var RangeTypeSelectView = require('../Range/RangeTypeSelectView');
var AWModel = require('../Core/AWModel');
var TableRouter = require('../Core/Route');
var Backbone = require('backbone');
var _ = require('underscore');

var FlopYoMama = AWModel.extend({
    updateRoute: function() {
            var hand = this.knownCards.get('hand'),
                board = this.knownCards.get('board');

            var custom = this.rangeTable.getCustom();
            var aCustom = _.map(custom, function(e) {
                return e.toCustomString();
            });
            var sCustom = aCustom.join(',');
            var filter = nsFilter.fGetActiveFilter() || "";

            var routerValue = "hand=" + hand +
                "&board=" + board +
                "&slider=" + this.slider.get('value') +
                "&range=" + this.slider.getScaleId() +
                "&custom=" + sCustom +
                "&filter=" + filter;
            this.router.navigate(routerValue, {
                trigger: false
            });
    },
    setUp: function() {
        var that = this;

        /*router*/
        this.router = new TableRouter();
        //this triggers the routing once (with the values the user passed
        //to the url)

        Backbone.history.start({
            pushState: false
        });


        /*known cards*/
        this.allCards = new Deck();
        this.knownCards = new KnownCards();
        this.knownCardsView = new KnownCardsView({
            model: this.knownCards
        });
        this.knownCardsView.render();

        /*slider*/
        routerValueSlider = this.router.getRouterValues().slider;

        this.slider = new Slider({
            value: routerValueSlider
        });
        this.sliderView = new SliderView({
            model: this.slider,
            el: $("#range_slider")[0]
        });

        this.rangeTypeSelectView = new RangeTypeSelectView({
            model: this.slider,
            el: $("#sklansky").parent()[0]
        });

        /*range table*/
        this.rangeTable = new RangeTable();
        this.rangeTable.listenToSlider(this.slider);
        this.rangeTableView = new RangeTableView({
            model: this.rangeTable
        });

        //Clear custom selection
        $('#clear_selection').click(function() {
            that.rangeTable.clearCustom();
            that.sliderView.update();
        });

        this.listenTo(this.rangeTable, 'finalize', this.finalizeHandler);

        this.slider.trigger('finalize');
    },
    initialize: function() {
    },
    finalizeHandler: function(args) {
        nsUtil.fLog('FlopYoMama.js: Main Ap Finalize');
        this.knownCards.evaluateKnownCards();
        this.updateRoute();

    }
});

module.exports = FlopYoMama;
