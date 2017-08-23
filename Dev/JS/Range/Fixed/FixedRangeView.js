var AWView = require('../../Core/AWView');
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
        $('#range_config_menu .divider').before(output);
        this.setElement($(".fixed_range." + oData.id));
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