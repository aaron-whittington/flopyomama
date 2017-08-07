var Bacbone = require('backbone');

var RangeTypeSelectView = Backbone.View.extend({
    initialize: function() {
        this.listenTo(this.model, "change:value", this.render);
        this.render();
    },
    render: function() {
        var f = this.model.get("fRangeFunction");
        var id = this.model.getScaleIdFromFn(f);
        nsUI.fToggleCheckableMenu($('#' + id), true, true);
    },
    events: {
        "click": "handleClick"
    },
    handleClick: function(e) {
        var fRangeFunction,
            item = $(e.target).parent(),
            bActivated = nsUI.fToggleCheckableMenu(item, true);

        if (bActivated) {
            var id = $(item).attr('id');

            fRangeFunction = this.model.getFnFromScaleId(id);

            this.model.set("fRangeFunction", fRangeFunction);
        }
    }
});

module.exports = RangeTypeSelectView;