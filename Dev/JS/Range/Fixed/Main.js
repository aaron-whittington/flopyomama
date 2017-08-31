//TODO: move to fixed range folder, change document.ready to export
var FixedRangeList = require('./FixedRangeList');
var FixedRangeListView = require('./FixedRangeListView');
var FixedRangeEditorView = require('./FixedRangeEditorView');
var FixedRange = require('./FixedRange');

module.exports = function() {
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
};
