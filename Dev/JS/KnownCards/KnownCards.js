var AWModel = require('../Core/AWModel');
var nsHtml = require('../Core/Html');
var CardList = require('../Card/CardList');
var Deck = require('../Card/Deck');
var nsUi = require('../Core/UI');
var nsUtil = require('../Core/Util');

var KnownCards = AWModel.extend({
    defaults: {
        hand: new CardList(),
        board: new CardList(),
        deck: new Deck()
    },
    allKnown: function(bToAtts) {
        var cl = new CardList(this.get('hand').models.concat(this.get('board').models));
        if (bToAtts) {
            return cl.map(function(m) {
                return m.attributes;
            });
        } else {
            return cl;
        }

    },
    allUnknown: function(bToAtts) {
        var allKnown = this.allKnown();
        return this.get('deck').getDifference(allKnown, bToAtts);
    },
    initialize: function() {
        //was nsUI.fAfterBoardChnage
        this.on('finalize', function() {
            nsHtml.fRedrawBoardSelectionTable();
            nsUI.fEvaluateKnownCards();
            this.saveBoardState();
            flopYoMama.updateRoute();
        });

        //manually set the hand and the board ... change to manual  
        this.on('update', function(hand, board) {
            if (hand)
                this.set('hand', new CardList(hand), {
                    silent: true
                });
            if (board)
                this.set('board', new CardList(board), {
                    silent: true
                });

            this.trigger('change');
        });

        this.on('change', function() {
            this.saveBoardState();
        });
        //initialize from router
        if (routerValues.hand || routerValues.board) {
            this.set('hand', new CardList(routerValues.hand));
            this.set('board', new CardList(routerValues.board));
        }
        //read from the localstorage 
        else {
            var boardArray = nsUtil.fGetLocalStorage("board_array"),
                i;

            if (boardArray) {

                for (i = 0; i < 2; i++) {
                    if (boardArray[i])
                        this.get('hand').add(new Card(boardArray[i]));
                }

                for (i = 2; i < 7; i++) {
                    if (boardArray[i])
                        this.get('board').add(new Card(boardArray[i]));
                }
            }
        }
    },
    saveBoardState: function() {
        var boardArray = [],
            i, mod;
        for (i = 0; i < 2; i++) {
            mod = this.get('hand').at(i);
            boardArray.push(mod ? mod.attributes : null);
        }
        for (i = 2; i < 7; i++) {
            mod = this.get('board').at(i - 2);
            boardArray.push(mod ? mod.attributes : null);
        }
        nsUtil.fSetLocalStorage("board_array", boardArray);
    },
    //returns, an object with prop bHand, bFlop, bRiver, bTurn, 
    //signifying that that part of the board has been set
    getBoardState: function() {
        return {
            bHand: this.get('hand').length === 2,
            bFlop: this.get('board').length >= 3,
            bTurn: this.get('board').length >= 4,
            bRiver: this.get('board').length == 5
        };
    }
});

module.exports = KnownCards;