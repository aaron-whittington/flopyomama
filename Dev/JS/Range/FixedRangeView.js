var AWView = require('../Core/AWView');
var $ = require('jquery');
//view of ranges for clicking loading
var FixedRangeView = AWView.extend({
    initialize: function() {
        this.compiledTemplate = Mustache.compile(this.template);
        this.render();
    },
    template: '<li class="fixed_range {{{id}}}" title="{{{desc}}}">' +
        '<a>{{{name}}}</a>' +
        '</li>',
    render: function() {
        var oData = this.renderData();
        var output = this.compiledTemplate(oData);
        $('#new_fixed').before(output);
        this.$el = $(".fixed_range." + oData.id);
    },
    events: {
        "click": "handleClick"
    },
    handleClick: function(e) {
        this.model.trigger('activate');
    },
    renderData: function() {
        return {
            id: this.model.getIdName(),
            name: this.model.get('name'),
            desc: this.model.get('desc')
        }
    }
});

module.exports = FixedRangeView;