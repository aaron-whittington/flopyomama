var AWView = require('../Core/AWView');
var FixedRangeList = require('./FixedRangeList');
var FixedRangeView = require('./FixedRangeView');

FixedRangeListView = AWView.extend({
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

/*
$(document).ready(function() {
    var def = new FixedRangeList();
    var view = new FixedRangeListView({
        collection: def
    });

    var editorView = null;
    $('body').on('show.bs.modal', '#fixed_range_editor', function() {
        editorView = new FixedRangeEditorView({
            collection: def,
            model: FixedRange.fromCurrent(flopYoMama.slider, flopYoMama.rangeTable)
        });
    });
    $('body').on('hide.bs.modal', '#fixed_range_editor', function() {
        editorView.destroy();
    });

    $('#save_fixed_ranges').click(function() {
        editorView.trySave();
    });
});
*/
