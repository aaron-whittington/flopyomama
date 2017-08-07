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
/*
$(function() {

    var standardGroup = new MenuItemGroup();
    var rangeMenuActionGroup = new MenuItemGroup('clearboard', false);
    var randomMenu = new MenuListModel([{
            id: "hand",
            value: "random_hand",
            displayValue: "Hand",
            group: standardGroup,
            active: true
        },
        {
            divider: true
        },
        {
            id: "flop",
            value: "random_flop",
            displayValue: "Flop",
            group: standardGroup,
            active: true
        },
        {
            id: "turn",
            value: "random_turn",
            displayValue: "Turn",
            group: standardGroup
        },
        {
            id: "river",
            value: "random_river",
            displayValue: "River",
            group: standardGroup
        },
        {
            divider: true
        },
        {
            value: "clear_board",
            displayValue: "Clear Board",
            group: rangeMenuActionGroup,
            action: 'clearBoard',
            clearBoard: function(e) {
                flopYoMama.knownCardsView.deleteBoard();
                flopYoMama.knownCards.trigger('finalize');
            },
            selectable: false
        }
    ]);
    randomMenu.set("id", "random_menu");

    var randomModelView = new MenuView({
        model: randomMenu,
        id: "random_menu"
    });
    randomModelView.render();
    $("#rand_ctrl").after(randomModelView.el);
    //loggingModelView.render();

    $('body').on('click touchstart', '#rand', function() {
        var aCards = fGetRandomCards(7);

        if (randomMenu._collection.get("hand").get("active")) {
            flopYoMama.knownCardsView.setBoardCard(aCards.slice(0, 2), 0);
        }

        if (randomMenu._collection.get("flop").get("active")) {
            flopYoMama.knownCardsView.setBoardCard(aCards.slice(2, 5), 2);
        }

        if (randomMenu._collection.get("turn").get("active")) {
            flopYoMama.knownCardsView.setBoardCard(aCards.slice(5, 6), 5);
        }

        if (randomMenu._collection.get("river").get("active")) {
            flopYoMama.knownCardsView.setBoardCard(aCards.slice(6, 7), 6);
        }

        flopYoMama.knownCards.trigger('finalize');

    });
});*/
