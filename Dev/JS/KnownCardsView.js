var $ = require('jquery');
var nsUtil = require('./Util');

var KnownCardsView = Backbone.View.extend({
    initialize: function() {
        this.listenTo(this.model, 'change', function() {
            this.render();
        });
        this.$el = $('#known');
    },
    render: function() {
        var hand = this.model.get('hand').models,
            board = this.model.get('board').models,
            i,
            val;

        for (i = 0; i < 2; i++) {
            val = hand.length > i ? hand[i].attributes : null;
            if (val)
                this.setBoardCard(val, i);
            else
                this.deleteBoard(i);
        }

        for (i = 0; i < 5; i++) {
            val = board.length > i ? board[i].attributes : null;
            if (val)
                this.setBoardCard(val, i + 2);
            else
                this.deleteBoard(i + 2);
        }
    },
    //This physically sets the string to the given node.
    setBoardString: function(jqKnown, s) {
        var oCard;
        /*nothing selected*/
        if (jqKnown.length < 1) {
            return false;
        } else {
            jqKnown.val(s);

            jqKnown.removeClass("suit_C suit_D suit_H suit_S");

            if (s.length === 2) {
                oCard = nsConvert.fConvertStringToCardObject(s);
                jqKnown.addClass("suit_" + nsConvert.suitToChar(oCard.suit));
            }
            return true;
        }
    },
    getCurrentBoardString: function() {
        var current = $('.known.btn:focus');
        return current.length === 1 ? current.val() : undefined;
    },
    setCurrentBoardString: function(s) {
        var current = $('.known.btn:focus');
        return this.setBoardString(current, s);
    },
    //Sets a board place(s) to the card at the given position.
    //If no position is given, it sets the board card to the current focus.
    //Position is 0-based.
    //Otherwise throws an exception. 
    //TODO: this should be moved into the model. */
    setBoardCard: function(oCard, position) {

        /*if position not sent try to set it on the focused one */
        if (typeof position === "undefined") {
            var current = $('.known.btn:focus');

            if (current.length !== 1)
                throw "fSetBoardCard, no position given, and no current focus.";

            var sNum = current.attr("id").split("_")[1];
            var iNum = parseInt(sNum, 10);
            position = (iNum - 1) % 7;
        }

        var insertNode = $('#known_' + (position + 1)),
            i;

        if (nsUtil.fType(oCard) !== 'array') {

            if (nsUtil.fType(oCard) === 'object')
                oCard = nsConvert.fConvertCardObjectToString(oCard);

            //single card
            if ((nsUtil.fType(oCard) === 'string' && oCard.length === 2)) {
                this.setBoardString(insertNode, oCard);
                this.updateModel();
            } else {
                var numberOfCards = oCard.length / 2;
                for (i = 0; i < numberOfCards; i++) {
                    var singleCard = oCard[i * 2] + oCard[i * 2 + 1];
                    this.setBoardCard(singleCard, (position + i) % 7);
                }
                this.updateModel();
            }
        } else {
            for (i = 0; i < oCard.length; i++) {
                this.setBoardCard(oCard[i], (position + i) % 7);
            }
            this.updateModel();
        }
    },
    updateModel: function() {
        var hand = new CardList($('#known_1').val() + $('#known_2').val());
        //silent once, since we don't need to update until we do the board, too
        this.model.get('hand').reset(hand.models, {
            silent: true
        });

        var board = new CardList($('#known_3').val() +
            $('#known_4').val() +
            $('#known_5').val() +
            $('#known_6').val() +
            $('#known_7').val());

        this.model.get('board').reset(board.models, {
            silent: true
        });
    },
    handleKeyPressKnown: function(keyCode, e) {

        /*allow native tabs*/
        if (keyCode !== TAB_CODE) {
            e.preventDefault();
        }
        if (keyCode === RIGHT_ARROW) {
            this.selectNext();
        } else if (keyCode === LEFT_ARROW) {
            this.selectPrev();
        }
        if (keyCode === BACKSPACE_CODE) {
            if (!this.deleteSelected())
                this.selectPrev();
        }

        if (keyCode === DELETE_CODE) {
            this.deleteSelected();
            e.stopPropagation();
        }
        var val, s;

        if (typeof RANK_CODES[keyCode] !== "undefined") {
            val = this.getCurrentBoardString();
            if (typeof val !== "undefined") {

                var rank = RANK_CODES[keyCode];

                s = '' + rank;

                if (val.length > 1)
                    s += val[1];
                this.setCurrentBoardString(s);
            }
        } else if (typeof SUIT_CODES[keyCode] !== "undefined") {
            val = this.getCurrentBoardString();
            /*we must have a current field and the length must be at least 1*/
            if (typeof val != "undefined" && val.length > 0) {

                var suit = SUIT_CODES[keyCode];
                s = '' + val[0] + suit;
                console.log("now typing suit s= " + s);
                if (this.validateKeypress(s)) {
                    this.setCurrentBoardString(s);
                    this.selectNext(); //move to next position
                }
            }
        }
        this.updateModel();
        this.model.trigger('finalize');
    },
    validateKeypress: function(sCard) {
        var oCard = nsConvert.fConvertStringToCardObject(sCard);
        var aKnownCards = this.model.allKnown(true);

        var html = this.getCurrentBoardString();
        if (typeof html === "undefined")
            return;

        var oCurrentCard = nsConvert.fConvertStringToCardObject(html);
        /*we allow typing of the same card*/
        if (fIdenticalCards(oCard, oCurrentCard))
            return true;


        for (var j = 0; j < aKnownCards.length; j++) {
            if (fIdenticalCards(oCard, aKnownCards[j]))
                return false;
        }
        return true;
    },
    deleteSelected: function() {
        var html = this.getCurrentBoardString();
        if (typeof html === "undefined")
            return false; /*didn't delete something*/

        if (html === EMPTY_CARD_STRING)
            return false;

        this.setCurrentBoardString(EMPTY_CARD_STRING);
        return true;
    },
    deleteBoard: function() {
        var that = this;
        var fDeleteSingleBoard = function(id) {
            if (nsUtil.fType(id) === 'number') {
                btn = $('.known').eq(id);
                that.setBoardString(btn, EMPTY_CARD_STRING);
            } else if (nsUtil.fType(id) === 'string') {
                $('.known').each(function() {
                    if ($(this).val() === id)
                        that.setBoardString($(this), EMPTY_CARD_STRING);
                });
            }
        };
        var btn;

        if (arguments.length === 0)
            this.setBoardString($('.known'), EMPTY_CARD_STRING);

        for (var i = 0; i < arguments.length; i++) {
            fDeleteSingleBoard(arguments[i]);
        }
        this.updateModel()
    },
    //selects the board with the card defined by search
    selectKnown: function(search) {
        $('.known').each(function() {
            if ($(this).val() === search) {
                $(this).focus();
            }
        });
    },
    //moves all the way to the next card
    selectNext: function(bPreferEmpty) {
        var jQCurrentSelected = $(".known.btn:focus");
        var currentSelected = null;
        if (jQCurrentSelected.length < 1)
            return;
        else
            currentSelected = jQCurrentSelected.first().attr('id').split('_')[1];

        if (bPreferEmpty) {
            for (var i = 1; i < 7; i++) {
                currentSelected++;
                if (currentSelected > 7)
                    currentSelected = 1;
                var tryNode = $('#known_' + currentSelected + ' span');
                var sHtml = tryNode.html();
                if (sHtml === EMPTY_CARD_STRING) {
                    $('#known_' + currentSelected).focus();
                    return;
                }
            }
            return; //if we don't find a place just go home for now
        }

        currentSelected++;
        if (currentSelected > 7)
            currentSelected = 1;
        nsUtil.fLog('current selected ' + currentSelected);
        $('#known_' + currentSelected).focus();
    },
    selectPrev: function() {
        var jQCurrentSelected = $(".known.btn:focus");
        var currentSelected = null;
        if (jQCurrentSelected.length < 1)
            return;
        else
            currentSelected = jQCurrentSelected.first().attr('id').split('_')[1];

        currentSelected--;
        if (currentSelected < 1)
            currentSelected = 7;

        $('#known_' + currentSelected).focus();
    }
});

module.exports = KnownCardsView;
