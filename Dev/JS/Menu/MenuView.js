
var AWView = require('../Core/AWView');
var MenuItemView = require('./MenuItemView');
var _ = require('underscore');

var MenuView = AWView.extend({
    initialize: function() {
        this.compiledTemplate = Mustache.compile(this.template); //this could be in awview base

        var that = this;
        that.views = []; ///CAN'T FIGURE OUT WHY THIS IS BEING PERSISTED FROM BASE
        this.model._collection.forEach(function(mod) {
            that.views.push(new MenuItemView({
                'model': mod,
                'parentView': that
            }));
        });
    },
    id: "",
    tagName: 'ul',
    idPrefix: function() {
        return "menu-";
    },
    views: [],
    className: function() {
        return "ctrls dropdown-menu";
    },
    after: 'rand_ctrl',
    events: {
        'click': "handleMainClick"
    },
    handleMainClick: function() {
        /*called when the UL is clicked. OK 
        alert("handleMainClick called in MenuView")*/
    },
    render: function() {
        var oData = {
            id: this.id,
            className: this.className(),
            html: [],
            tagName: this.tagName
        };
        var menuView = this;

        _.forEach(this.views, function(view) {
            var viewEl = view.render().el;
            menuView.$el.append(viewEl);
            //oData.html.push(view.render());
        });

        //var rendered = this.compiledTemplate(oData);
        //this.$el.html(rendered);
        this.$el.attr("class", this.className());
        this.$el.attr("id", this.id);
        return this;

    },
    template: "\
					{{#html}}\
						{{{.}}}\
					{{/html}}\
				"
});

module.exports = MenuView;
