var routerValues = {};

var TableRouter = Backbone.Router.extend({

    routes: {
        "help": "help", // #help
        "hand=(:v1)&board=(:v2)&slider=(:v3)&range=(:v4)&custom=(:v5)&filter=(:v6)": "main"
    },

    help: function() {

    }, 
    getRouterValues() {
        return routerValues;
    },
    main: function(hand, board, slider, range, custom, filter) {
        routerValues.hand = hand;
        routerValues.board = board;
        routerValues.slider = slider;
        routerValues.custom = custom;
        routerValues.filter = filter;

        if (typeof flopYoMama !== "undefined" && flopYoMama.knownCards) {
            window.flopYoMama.knownCards.trigger('update', hand, board);
        }

        if (typeof flopYoMama !== "undefined" && flopYoMama.slider) {
            window.flopYoMama.sliderView.trigger('update', slider);
        }

        if (typeof flopYoMama !== "undefined" && flopYoMama.rangeTable) {
            window.flopYoMama.rangeTable.setCustom(custom);
        }
    }
});

module.exports = TableRouter;
