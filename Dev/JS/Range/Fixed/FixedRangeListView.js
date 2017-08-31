var AWView = require('../../Core/AWView');
var FixedRangeList = require('./FixedRangeList');
var FixedRangeView = require('./FixedRangeView');

var FixedRangeListView = AWView.extend({
    model: FixedRangeView,
    initialize: function() {
        this.render();
        this.listenTo(this.collection, 'change', this.render);
        this.listenTo(this.collection, 'remove', this.render);
        this.listenTo(this.collection, 'add', this.render);
    },
    render: function() {
        $('.fixed_range').remove();
        this.collection.each(function(m) {
            var view = new FixedRangeView({
                model: m
            });
        });
    }
});

module.exports = FixedRangeListView;

