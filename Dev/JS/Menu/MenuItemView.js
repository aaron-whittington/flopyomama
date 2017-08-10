var AWView = require('../Core/AWView');
var MenuListModel = require('./MenuListModel');
var MenuItemGroup = require('./MenuItemGroup');
var MenuView = require('./MenuView');

var MenuItemView = AWView.extend({
    initialize: function(oData) {
        this.compiledTemplate = Mustache.compile(this.template); //this could be in awview base
        this.parentView = oData.parentView;

    },
    tagName: 'li',
    className: function() {
        var className = '';
        var classes = [];
        if (this.model.get('active')) {
            classes.push('active');
        }
        if (this.model.get('selected')) {
            classes.push('selected');
        }

        var sClasses = classes.join(' ');
        return sClasses;
    },
    events: {
        "click": "handleclick"
    },
    handleclick: function(e) {
        //alert("menu item view call handleclick");

        if (this.model.get('selectable')) {
            this.model.toggle('selected');
            this.model.toggle('active');
            console.log("model selected toggled");
        }
        var actionName = this.model.get('action');
        var action = this.model.get(actionName);
        if (action)
            action.call(e);

        e.stopPropagation();
        this.render();

    },
    render: function() {
        ////suit offsuit pPair
        var oData = this.renderData();
        var output;
        if (this.model.get('divider')) {
            this.$el.addClass("divider");
            return this;
        }

        output = this.compiledTemplate(oData); //Mustache.render(this.template, oData);
        this.$el.html(output);
        this.$el.attr('class', oData.class);

        return this;
    },
    idPrefix: function() {
        return this.parentView.id + '_';
    },
    id: "",
    icon: function() {
        var iconClass = null;
        if (this.model.get('active')) {
            iconClass = 'glyphicon-ok';
        } else if (this.model.get('action') !== null) {
            iconClass = 'glyphicon-cog';
        }
        if (iconClass)
            return Mustache.render(this.iconTemplate, {
                iconClass: iconClass
            });
        else
            return '';
    },
    iconTemplate: '<span class="glyphicon {{{iconClass}}}"></span>',
    renderData: function() {
        return {
            'class': this.className(),
            'id': this.id,
            'id_prefix': this.idPrefix(),
            'displayValue': this.model.get('displayValue'),
            'icon': this.icon()
        };
    },
    template: "<a>{{{displayValue}}}{{{icon}}}</a>"
});

module.exports = MenuItemView;
