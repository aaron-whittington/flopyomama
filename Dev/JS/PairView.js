
var Backbone = require('backbone');

var PairView = Backbone.View.extend({
    initialize: function() {
        //this.render();	
    },
    tagName: 'td',
    className: function() {
        if (_.isUndefined(this.model))
            return "";
        var sClass = 'offsuit';
        if (this.model.bPPair()) {
            sClass = 'pPair';
        } else if (this.model.get('suited')) {
            sClass = 'suit';
        }
        return sClass;
    },
    render: function() {
        ////suit offsuit pPair
        var oData = this.renderData();
        var output = Mustache.render(this.template, oData);
        this.$el.html(output);
        return output;
    },
    renderData: function() {
        return {
            'class': this.className(),
            'id': this.model.toString(),
            'id_prefix': 'op_range_',
            'string': this.model.toString()
        };
    },
    template: "<td class='{{class}}' id='{{id_prefix}}{{id}}'>\
					<div class='pair_wrapper'>\
					<div class='static_bg'>&nbsp;</div>\
					<div class='inner_pair'>{{string}}</div>\
				</td>"
});

module.exports = PairView;
