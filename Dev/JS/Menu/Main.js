var MenuItemGroup = require('./MenuItemGroup');
var MenuListModel = require('./MenuListModel');
var MenuView = require('./MenuView');
var nsConvert = require('../Core/Convert');

//TODO remove these extra document readies, rename the files to CreateInstance, 
//and then instantiate from the flopYoMama class.
module.exports = function() {
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
        var flopYoMama = window.flopYoMama;
        var aCards = nsConvert.fGetRandomCards(7);

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
};
