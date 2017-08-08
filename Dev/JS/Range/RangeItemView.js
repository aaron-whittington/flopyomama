var AWView = require('../Core/AWView');
var _ = require('underscore');

var RangeItemView = AWView.extend({
    setModel: function(model) {
        this.model = model; //set this early
        //we could put this in our standard awview logik
        var elTest = $(Mustache.render('#{{.}}', this.idPrefix() + this.id()));
        if (_.isElement(elTest[0])) {
            this.el = elTest[0];
            this.$el = elTest;
        }
    },
    initialize: function(oData) {
        this.setModel(oData.model);
        this.compiledTemplate = Mustache.compile(this.template);
    },
    tagName: 'td',
    className: function() {
        var aClass = [];
        var sClass = 'offsuit';
        var pair = this.model.get("pair");
        if (pair.bPPair()) {
            sClass = 'pPair';
        } else if (pair.get('suited')) {
            sClass = 'suit';
        }
        aClass.push(sClass);
        if (this.model.get('selected'))
            aClass.push('selected');
        if (this.model.get('custom'))
            aClass.push('custom');

        return aClass.join(' ');
    },
    render: function() {
        ////suit offsuit pPair
        var oData = this.renderData();
        var output = this.compiledTemplate(oData); //Mustache.render(this.template, oData);
        var sClass = this.className();
        this.el.innerHTML = output; //faster native performance
        this.el.className = sClass; //probably faster than jquery
        return output;
    },
    id: function() {
        return this.model.get('pair').toString();
    },
    idPrefix: function() {
        return 'op_range_';
    },
    renderData: function() {
        return {
            'class': this.className(),
            'id': this.id(),
            'id_prefix': this.idPrefix(),
            'string': this.id()
        };
    },
    template: "<div class='pair_wrapper'>\
				<div class='static_bg'>&nbsp;</div>\
				<div class='inner_pair'>{{string}}</div>"
});

module.exports = RangeItemView;
