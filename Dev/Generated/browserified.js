(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var AWModel = require('../Core/AWModel');
var AWCollection = require('../Core/AWCollection');
var AWCollectionModel = require('../Core/AWCollectionModel');
var nsConvert = require('../Core/Convert');

var Card = AWModel.extend({
    className: 'Card',
    _stringToPrm: function(aArgs) {
        var cardString = aArgs[0];
        if (cardString.length !== 2)
            throw "card constructor called with invalid prop: " + aArgs[0];
        var rankChar = cardString[0].toUpperCase();
        var suitChar = cardString[1].toUpperCase();
        var rank = nsConvert.rankCharToNumber(rankChar);
        var suit = nsConvert.suitCharToNumber(suitChar);
        return {
            rank: rank,
            suit: suit
        };
    },
    _numToPrm: function(aArgs) {
        return {
            rank: aArgs[0],
            suit: aArgs[1]
        };
    },
    initialize: function() {
        var test = arguments;
    },
    rankNumberToChar: function() {
        var i = this.get('rank');
        return nsConvert.rankNumberToChar(i);
    }, //maybe put these ones in a view...
    suitToDisplayChar: function() {
        var i = this.get('suit');
        return nsConvert.suitToDisplayChar(i);
    },
    suitToChar: function() {
        var i = this.get('suit');
        return nsConvert.suitToChar(i);
    },
    toString: function() {
        return this.rankNumberToChar() + this.suitToChar();
    },
    toDisplayString: function() {
        return this.rankNumberToChar() + this.suitToDisplayChar();
    }
});

var CardList = AWCollection.extend({
    className: 'CardList',
    _stringToPrm: function(aArgs) {
        //var prm = arguments;
        var aoCards = []
        var sCards = aArgs[0];
        if (sCards.indexOf(',') === -1) {
            var length = sCards.length;
            for (var i = 0; i < length; i += 2) {
                aoCards.push(new Card(sCards.substring(i, i + 2)));
            }
        } else {
            var aSplit = sCards.split(','); //separator
            var length = aSplit.length;
            for (var i = 0; i < length; i++) {
                aoCards.push(new Card(aSplit[i]));
            }
        }
        return aoCards;
    },
    model: Card,
    _objToPrm: function(aArgs) {
        var aoCards = [];
        var prm = aArgs[0];
        var length = prm.length;
        for (var i = 0; i < length; i++) {
            aoCards.push(new Card(prm[i]));
        }
        return aoCards;
    }
});


var CardListModel = AWCollectionModel.extend({
    className: 'CardListModel',
    collection: CardList
});

var CardListList = AWCollection.extend({
    className: 'CardListList',
    model: CardListModel
});

module.exports = Card;

},{"../Core/AWCollection":7,"../Core/AWCollectionModel":8,"../Core/AWModel":9,"../Core/Convert":11}],2:[function(require,module,exports){
var Card = require('./Card');
var AWCollection = require('../Core/AWCollection');

var CardList = AWCollection.extend({
    className: 'CardList',
    _stringToPrm: function(aArgs) {
        //var prm = arguments;
        var aoCards = []
        var sCards = aArgs[0];
        if (sCards.indexOf(',') === -1) {
            var length = sCards.length;
            for (var i = 0; i < length; i += 2) {
                aoCards.push(new Card(sCards.substring(i, i + 2)));
            }
        } else {
            var aSplit = sCards.split(','); //separator
            var length = aSplit.length;
            for (var i = 0; i < length; i++) {
                aoCards.push(new Card(aSplit[i]));
            }
        }
        return aoCards;
    },
    model: Card,
    _objToPrm: function(aArgs) {
        var aoCards = [];
        var prm = aArgs[0];
        var length = prm.length;
        for (var i = 0; i < length; i++) {
            aoCards.push(new Card(prm[i]));
        }
        return aoCards;
    }
});

module.exports = CardList;

},{"../Core/AWCollection":7,"./Card":1}],3:[function(require,module,exports){
var CardList =  require('./CardList');
var Card = require('./Card');
var Backbone = require('backbone');

var ImmutableDeck = CardList.extend({
    initialize: function() {
        for (var suit = 4; suit > 0; suit--) {
            for (var rank = 14; rank > 1; rank--) {
                this.add(new Card(rank, suit));
            }
        }
        this.locked = true;
    },
    add: function() {
        if (this.locked)
            throw "you can't add or remove cards from an immutable deck";

        Backbone.Collection.prototype.add.apply(this, arguments);
    },
    remove: function() {

        if (this.locked)
            throw "you can't add or remove cards from an immutable deck";
        Backbone.Collection.prototype.remove.apply(this, arguments);
    }
});

var Deck = CardList.extend({
    initialize: function() {
        var id = new ImmutableDeck();
        this.models = id.models;
    },
    //deck - cards to remove  
    getDifference: function(toRemove, bToAtts) {
        var cl = this.filter(function(c) {
            var found = toRemove.where({
                rank: c.get('rank'),
                suit: c.get('suit')
            });
            return found.length < 1;
        });

        if (bToAtts) {
            return cl.map(function(m) {
                return m.attributes;
            });
        } else {
            return cl;
        }
    }
});

module.exports = Deck;

},{"./Card":1,"./CardList":2,"backbone":64}],4:[function(require,module,exports){
"use strict";
var g = {};
g.RANK_CODES = {};
//bugs 9 key doesn't work;
/*keyCodes 2 to 9*/
for (var i = 50; i < 50 + 8; i++) {
    g.RANK_CODES[i] = i - 48;
}

/*tjqka*/
g.RANK_CODES[84] = 'T';
g.RANK_CODES[74] = 'J';
g.RANK_CODES[81] = 'Q';
g.RANK_CODES[75] = 'K';
g.RANK_CODES[65] = 'A';

/*suits*/
g.SUIT_CODES = {};
g.SUIT_CODES[67] = '\u2663'; //club
g.SUIT_CODES[68] = '\u2666'; //diamond
g.SUIT_CODES[72] = '\u2665'; //heart
g.SUIT_CODES[83] = '\u2660'; //spade

g.BACKSPACE_CODE = 8;
g.DELETE_CODE = 46;
g.TAB_CODE = 9;
g.LEFT_ARROW = 37;
g.RIGHT_ARROW = 39;

module.exports = g;


},{}],5:[function(require,module,exports){
module.exports = {
    TOTAL_STARTING_COMBINATIONS: 1326
}; 

},{}],6:[function(require,module,exports){

module.exports = {
   EMPTY_CARD_STRING : ''
};


},{}],7:[function(require,module,exports){
var  _ = require('underscore');
var Backbone = require('backbone');
var nsUtil = require('./Util');

//collection with custom constructors
var AWCollection = Backbone.Collection.extend({
    className: 'AWCollection',
    //call constructor methods with args from special classes 
    constructor: function() {
        var prm = arguments,
            aPrms;
        if (prm.length > 0 && prm[0] != null) {
            //special case, constructor called from AWCollectionModel
            if (prm[0].bAWUnpack) {
                prm = prm[0];
            }
            //nsUtil.fLog(JSON.stringify(this));

            if (_.isString(prm[0])) {
                aPrms = this._stringToPrm(prm);
            } else if (_.isNumber(prm[0])) {
                aPrms = this._numToPrm(prm);
            } else if (_.isObject(prm[0]) && !_.isArray(prm[0])) {
                aPrms = this._objToPrm(prm);
            }
        }

        //send it down the chain
        if (!_.isUndefined(aPrms)) {
            Backbone.Collection.apply(this, [aPrms]);
        } else {
            Backbone.Collection.apply(this, prm);
        }
    },
    _numToPrm: function() {

    },
    _objToPrm: function() {

    },
    _stringToPrm: function() {

    },
    _prepareModel: function(attrs, options) {
        if (attrs instanceof Backbone.Model) {
            if (!attrs.collection) attrs.collection = this;
            return attrs;
        }
        options || (options = {});
        options.collection = this;
        var model = new this.model(attrs, options);
        if (!model._validate(attrs, options)) {
            this.trigger('invalid', this, attrs, options);
            return false;
        }
        return model;
    },
    toString: function() {
        var s = ''
        this.forEach(function(oItem) {
            s += oItem.toString();
        });
        return s;
    },
    toDisplayString: function(bSeparator) {
        var s = '';
        this.forEach(function(oItem) {
            s += oItem.toDisplayString();
            if (bSeparator)
                s += ' ';
        });
        return s;
    },
    test: function() {
        var oJson = this.toJSON();
        json = JSON.stringify(oJson);
        sInter = this.toString();
        sExter = this.toDisplayString();
        nsUtil.fLog('TEST: ' + this.className + ' id: ' + this.id);
        nsUtil.fLog('	JSON:	' + json);
        nsUtil.fLog('	toString:	' + sInter);
        nsUtil.fLog('	toDisplayString:	' + sExter);
    }
});

module.exports = AWCollection;

},{"./Util":16,"backbone":64,"underscore":67}],8:[function(require,module,exports){
var AWModel = require('./AWModel');
var AWCollection = require('./AWCollection');
var Backbone = require('backbone');

//wraps a collection so it can be used as a model
var AWCollectionModel = AWModel.extend({
    className: 'AWCollectionModel',
    _collection: null,
    getCollection: function() {
        return this._collection;
    },
    constructor: function() {
        var prm = arguments;
        prm.bAWUnpack = true;
        this._collection = new this.collection(
            prm
        );

        Backbone.Model.apply(this, prm);
    },
    collection: AWCollection,
    _numToPrm: function() {
        return this._collection._numToPrm();
    },
    _objToPrm: function() {
        return this._collection._objToPrm();
    },
    _stringToPrm: function() {
        return this._collection._stringToPrm();
    },
    toString: function() {
        return this._collection.toString();
    },
    toDisplayString: function() {
        return this._collection.toDisplayString(true);
    },
    test: function() {
        this._collection.test();
    },
    toJSON: function() { //i'd actually have to implement here all the collection classes
        return this._collection.toJSON();
    }
});

module.exports = AWCollectionModel;

},{"./AWCollection":7,"./AWModel":9,"backbone":64}],9:[function(require,module,exports){
var _ = require('underscore');
var Backbone = require('backbone');
var nsUtil = require('./Util');
//modell with custom constructors
var AWModel = Backbone.Model.extend({
    //call constructor methods with args from special classes 
    className: 'AWModel',
    constructor: function() {
        var prm = arguments;
        var oPrms;
        if (prm.length > 0) {
            if (_.isString(prm[0])) {
                oPrms = this._stringToPrm(prm);
            } else if (_.isNumber(prm[0])) {
                oPrms = this._numToPrm(prm);
            } else if (_.isArray(prm[0])) {
                oPrms = this._arrToPrm(prm);
            }
        }

        //send it down the chain
        if (!_.isUndefined(oPrms)) {
            Backbone.Model.apply(this, [oPrms]);
        }
        //argument[0] was an object so we do the default initialization
        else {
            Backbone.Model.apply(this, prm);
        }
    },
    toggle: function(attr) {
        //todo: implement for arrays, ggf. strings, objects
        var val = !this.get(attr);
        this.set(attr, val);
        return val;
    },
    /*The _*ToPrm functions are used so that subclasses can use constructors
     * with types other than object (which is the backbone default)*/
    _numToPrm: function() {

    },
    _arrToPrm: function() {

    },
    _stringToPrm: function() {

    },
    //some attributes do not need to be serialized 
    //for example, I don't want the 
    attributesToSave: function() {
        return this.attributes;
    },
    _loadFromURL: function() {


    },
    _loadFromLocalStorage: function() {

    },
    load: function() {


    },
    toString: function() {

    },
    toDisplayString: function() {
        return this.toString();
    },
    test: function() {
        json = JSON.stringify(this.toJSON());
        sInter = this.toString();
        sExter = this.toDisplayString();
        nsUtil.fLog('TEST: ' + this.className + ' id: ' + this.id);
        nsUtil.fLog('	JSON:	' + json);
        nsUtil.fLog('	toString:	' + sInter);
        nsUtil.fLog('	toDisplayString:	' + sExter);
    }
});

module.exports = AWModel;

},{"./Util":16,"backbone":64,"underscore":67}],10:[function(require,module,exports){
"strict mode"
var Backbone = require('backbone');
var AWView = Backbone.View.extend({
    className: 'AWView',
    constructor: function() {
        var prm = arguments;
        Backbone.View.apply(this, prm);
    }
});

module.exports = AWView;
},{"backbone":64}],11:[function(require,module,exports){
 /*takes AAo und generates AcAd,AsAh ...and so on*/
var _ = require('underscore');
var nsConvert = {};

/*TODO: remove reference to global knownCards object*/
nsConvert.fGetRandomCards = function(i) {

    var aAll = flopYoMama.knownCards.allUnknown(true),
        aReturnCards = [],
        aReturnCardIndex = [];
    while (aReturnCards.length < i) {
        var random = Math.floor((Math.random() * aAll.length));
        if (jQuery.inArray(random, aReturnCardIndex) < 0) {
            aReturnCardIndex.push(random);
            aReturnCards.push(aAll[random]);
        }
    }
    return aReturnCards;
};

//takes a string such as A'\u2663' to the proper card object
nsConvert.fConvertStringToCardObject = function(s) {
    var oCard;
    if (typeof s === "string") {
        oCard = {};
        oCard.rank = nsConvert.rankCharToNumber(s[0]);
        oCard.suit = nsConvert.suitCharToNumber(s[1]);
    } else { //param is an array
        var returnArray = [];
        for (var i = 0; i < s.length; i++)
            returnArray.push(nsConvert.fConvertStringToCardObject(s[i]));

        return returnArray;
    }

    return oCard;
}

nsConvert.fConvertCardObjectToString = function(oCard) {
    return nsConvert.rankNumberToChar(oCard.rank) + nsConvert.suitToDisplayChar(oCard.suit);
}


//remove known board cards from pair array
nsConvert.fFilterCardPairArray = function(pairArray, aKnown, aFilterPairs) {
    var cardArrayLength = pairArray.length;
    var aKnownLength = aKnown.length;
    var returnArray = []
    for (var i = 0; i < pairArray.length; i++) {
        var pair = pairArray[i];
        var card1 = pair[0];
        var card2 = pair[1];
        var bCardOk = true;
        for (var j = 0; j < aKnownLength; j++) {
            var known = aKnown[j];
            if (((known.suit === card1.suit) && (known.rank === card1.rank)) ||
                ((known.suit === card2.suit) && (known.rank === card2.rank))) {
                bCardOk = false;
                break;
            }
        }
        if (aFilterPairs)
            for (var j = 0; j < aFilterPairs.length; j++) {
                var filterPair = aFilterPairs[j];
                if (((filterPair[0].suit === card1.suit) && (filterPair[0].rank === card1.rank) &&
                        (filterPair[1].suit === card2.suit) && (filterPair[1].rank === card2.rank)) ||
                    ((filterPair[1].suit === card1.suit) && (filterPair[1].rank === card1.rank) &&
                        (filterPair[0].suit === card2.suit) && (filterPair[0].rank === card2.rank))) {
                    bCardOk = false;
                    break;
                }
            }

        if (bCardOk)
            returnArray.push(pair);
    }
    return returnArray;
}

//card char /int conversion
_.extend(nsConvert, {
    rankCharToNumber: function(c) {
        if (c === 'A')
            return 14;
        if (c === 'K')
            return 13;
        if (c === 'Q')
            return 12;
        if (c === 'J')
            return 11;
        if (c === 'T')
            return 10;
        return parseInt(c);
    },
    suitCharToNumber: function(c) {
        if (c === '\u2663') //c
            return 1;
        if (c === '\u2666') //d
            return 2;
        if (c === '\u2665') //h
            return 3;
        if (c === '\u2660') //s
            return 4;
        if (c === 'C')
            return 1;
        if (c === 'D')
            return 2;
        if (c === 'H')
            return 3;
        if (c === 'S')
            return 4;

        return null;
    },
    rankNumberToChar: function(i) {
        if (i === 14)
            return 'A';
        if (i === 13)
            return 'K';
        if (i === 12)
            return 'Q';
        if (i === 11)
            return 'J';
        if (i === 10)
            return 'T';
        return i.toString();
    }, //maybe put these ones in a view...
    suitToDisplayChar: function(i) {
        if (i === 1)
            return '\u2663';
        if (i === 2)
            return '\u2666';
        if (i === 3)
            return '\u2665';
        if (i === 4)
            return '\u2660';

        return null;
    },
    suitToChar: function(i) {

        if (i === 1)
            return 'C';
        if (i === 2)
            return 'D';
        if (i === 3)
            return 'H';
        if (i === 4)
            return 'S';

        return null;
    }
}); //expose this stuff

module.exports = nsConvert;

},{"underscore":67}],12:[function(require,module,exports){

var nsUtil = require('./Util');
var nsConvert = require('./Convert');

var nsHtml = {};

nsHtml.fGetBoardSelectionTable = function(knownCards) {
    var sReturn = "<div id='board_selection_table'>";
    var aCards = knownCards.get('deck').models;

    for (var suit = 4; suit > 0; suit--) {
        sReturn += "<div style='white-space: nowrap;'>";
        aCards.forEach(function(c) {
            if (c.get('suit') != suit) {
                return;
            }

            var found = knownCards.allKnown().where({
                'suit': c.get('suit'),
                'rank': c.get('rank')
            }).length > 0;

            sReturn += nsHtml.fWrapCard(c.attributes, found, found);
        });
        sReturn += "</div>";
    }
    sReturn += "<div>";
    return sReturn + "<span class='glyphicon glyphicon-remove'></span></div>";
};

//this is inefficient if we've just got a little change
nsHtml.fRedrawBoardSelectionTable = function(knownCards) {
    $('#board_selection_table').parent().html(nsHtml.fGetBoardSelectionTable(knownCards));
};

nsHtml.fWrapCard = function(id, bDisabled, bSelected) {
    var disabledString = bDisabled ? ' disabled ' : '';
    var selectedString = bSelected ? ' selected ' : '';

    var oCard = id;

    if (nsUtil.fType(id) === 'string') {
        oCard = nsConvert.fConvertStringToCardObject(id); //here we could do conversion
    }
    var innerString = nsConvert.rankNumberToChar(oCard.rank) + nsConvert.suitToDisplayChar(oCard.suit);
    var span = '<span class="card suit_' + nsConvert.suitToChar(oCard.suit) + ' rank_' + oCard.rank + selectedString + disabledString + '">' +
        innerString + '</span>';

    return span;
};

nsHtml.fAbbreviateDrawingHandStrings = function(sDrawing) {
    var aSplit = sDrawing.split("-"),
        i;

    for (i = 0; i < aSplit.length; i++) {
        aSplit[i] = aSplit[i].trim();
    }

    var returnString = ''; //nsHtml.fAbbreviateHandType(aSplit[0]);

    for (i = 0; i < aSplit.length; i++) {
        returnString = returnString + "&nbsp;" + nsHtml.fAbbreviateHandType(aSplit[i]);
    }

    return returnString;
};

nsHtml.fAbbreviateInnerString = function(rankString) {
    var abrv = '';

    switch (rankString) {
        case "High Card":
            abrv = 'HC';
            break;
        case "Pair":
            abrv = 'Pa';
            break;
        case "Two Pair":
            abrv = '2P';
            break;
        case "Three Of A Kind":
            abrv = '3K';
            break;
        case "Straight":
            abrv = 'St';
            break;
        case "Flush":
            abrv = 'Fl';
            break;
        case "Full House":
            abrv = 'FH';
            break;
        case "Four Of A Kind":
            abrv = '4K';
            break;
        case "Straight Flush":
            abrv = 'SF';
            break;
        case "Top Pair":
            abrv = 'TP';
            break;
        case "Backdoor Straight Draw":
            abrv = "SD(Bd)";
            break;
        case "Backdoor Flush Draw":
            abrv = "FD(Bd)";
            break;
        case "Gutshot Straight Draw":
            abrv = "SD(Gs)";
            break;
        case "Open Ended Straight Draw":
            abrv = "SD(OE)";
            break;
        case "Flush Draw":
            abrv = "FD";
            break;
        default:
            abrv = 'UNKNOWN !!!!';
            break;
    }
    return abrv;
};

nsHtml.fAbbreviateHandType = function(rankString) {

    var abrv = nsHtml.fAbbreviateInnerString(rankString);
    return "<abbr data-toggle='tooltip' title='" + rankString + "'>" + abrv + "</abbr>";

};

nsHtml.fDrawMultProgressBar = function(sId, sClass, flWin, flDraw, flLoss, flOuterWidth) {

    if (!sId)
        sId = "";
    if (!sClass)
        sClass = "";
    var sOuterWidth = "";
    if (flOuterWidth) {
        var minWidth = 1.5; //prevent invisible scrollbars
        flOuterWidth = Math.max(minWidth, flOuterWidth);
        sOuterWidth = "style='width:" + flOuterWidth + "%;'";
    }


    var html = '';
    html = html + '<div id="' + sId + '" class="progress ' + sClass + '"' + sOuterWidth + '>';
    html = html + '<div class="progress-bar progress-bar-success" style="width:' + flWin + '%"></div>';
    html = html + '<div class="progress-bar" style="width:' + flDraw + '%"></div>';
    html = html + '<div class="progress-bar progress-bar-danger" style="width: ' + flLoss + '%"></div>';
    html = html + '</div>';
    return html;
};

nsHtml.fUpdateMultProgressBar = function(sel, flWin, flDraw, flLoss) {
    $(sel).children().each(function(i) {
        if (i === 0)
            $(this).css('width', flWin + '%');
        if (i === 1)
            $(this).css('width', flDraw + '%');
        if (i === 2)
            $(this).css('width', flLoss + '%');

    });
};

nsHtml.fSetupTextureHover = function(oResult) {
    var oStat = oResult.oVillainStat;

    $('#textures .row').mouseenter(function() {
        $('#op_range').addClass('board_highlight');
        var rankString = nsHtml.oTextureResultDic[$(this).attr('id')];
        var oPairRecord = oStat[rankString].oPairRecord;
        for (var prop in oPairRecord) {
            $("#op_range_" + prop).addClass('highlight');
        }
    });

    $('#textures .row').mouseleave(function() {
        $('#op_range').removeClass('board_highlight');
        $("#op_range_table td").removeClass('highlight');
    });

    //oVillainStat: Object
    //	High Card: Object
    //		count: 3
    //		oPairRecord: Object
    //			KJs: 1
    //			KQs: 1
    //			KTs: 1
};

nsHtml.oTextureResultDic = {};

nsHtml.fGetTextureHtml = function(oResult) {
    var oStat = oResult.oVillainStat;
    var iCount = oResult.count;
    var returnHtml = '';

    var aPropArray = [],
        prop;
    for (prop in oStat) {
        aPropArray.push(prop);
    }

    aPropArray.sort(function(a, b) {
        return oStat[b].count - oStat[a].count;
    });
    var flHighestPercent = 0.0;
    for (var i = 0; i < aPropArray.length; i++) {
        prop = aPropArray[i];
        var cardRecord = oStat[prop];
        var hits = cardRecord.count;
        var flTotalPercent = hits / iCount * 100.0;
        if (i === 0) {
            flHighestPercent = flTotalPercent;
        }
        var id = 'texture_result_' + i;
        nsHtml.oTextureResultDic[id] = prop;
        var sTotalPercent = (flTotalPercent).toFixed(1) + '%';
        var pb = nsHtml.fDrawMultProgressBar("texture_result_" + i, 'sub_result_pb', 0.0, 100.0, 0.0, flTotalPercent / flHighestPercent * 100.0);
        var abbr = nsHtml.fAbbreviateHandType(prop);
        returnHtml = returnHtml + '<div class=row id="' + id + '"><div class="col-lg-6"> ' +
            ' <p class="text-info">' + '<span class="glyphicon glyphicon-star-empty"></span>' + abbr + ' <span class="stat_percent">(' + sTotalPercent + ')</span> </p></div><div class="col-lg-6">' +
            pb + ' </div></div>'; //fDrawMultProgressBar	
    }
    return returnHtml;
};

nsHtml.PIE_THRESHOLD = 1.5;

nsHtml.fGetPieCharLegendColor = function() {
    var color = $('#palette .btn-default').css('color');
    //nsUtil.fLog('legend color ' + color);
    return color;
};

nsHtml.fGetPieChartColors = function(i) {
    var counter = 0;
    var returnArray = [];
    var round = 0;

    var colorer = function(index, node) {
        var color = $(node).css('background-color');
        //nsUtil.fLog('color: ' + color + ' round:' + round + 'class ' + $(this).attr('class'));
        var even = counter % 2 === 0;
        if (round === 0)
            color = even ? color : Chromath.lighten(color, 0.3).toHexString();
        else if (round === 1)
            color = even ? Chromath.lighten(color, 0.4).toHexString() : Chromath.darken(color, 0.4).toHexString();
        else if (round === 2)
            color = even ? Chromath.darken(color, 0.6).toHexString() : Chromath.lighten(color, 0.6).toHexString();
        else if (round === 3)
            color = Chromath.lighten(color, 0.2).toHexString();
        else if (round === 4)
            color = Chromath.lighten(color, 0.3).toHexString();
        else if (round === 5)
            color = Chromath.lighten(color, 0.4).toHexString();

        if (counter % 7 === 6)
            color = Chromath.desaturate(color, 1).toHexString();

        //nsUtil.fLog('color transformed: ' + color);
        returnArray.push(color);
        counter++;
    };

    while (counter < i) {


        $('#palette .btn').not('.btn-default').not('.btn-link').not('.btn-primary').each(colorer);

        round++;
    }



    return returnArray;
};

nsHtml.fDrawTexturePie = function(oResult) {

    //rendering not done correctly in hidden divs
    var jqOldActive;
    var texturesActive = $('#textures').hasClass('active');

    if (!texturesActive) {
        jqOldActive = $('#inner-stats .tab-pane.active');

        jqOldActive.removeClass('active');

        $('#textures').addClass('active');
    }

    var oStat = oResult.oVillainStat,
        iCount = oResult.count,
        returnHtml = '',
        aPropArray = [],
        prop;

    for (prop in oStat) {
        aPropArray.push(prop);
    }

    aPropArray.sort(function(a, b) {
        return oStat[b].count - oStat[a].count;
    });
    var flHighestPercent = 0.0;

    $("#textures svg").remove();

    var pieData = [],
        aLegend = [],
        asPercent = [];
    for (var i = 0; i < aPropArray.length; i++) {


        prop = aPropArray[i];
        var cardRecord = oStat[prop];
        var hits = cardRecord.count;
        pieData.push(hits);

        var abbr = nsHtml.fAbbreviateInnerString(prop) + '\xA0' + '\xA0' + '\xA0' + '\xA0'; // some extra space;
        aLegend.push(abbr);

        var id = 'texture_result_' + i;
        nsHtml.oTextureResultDic[id] = prop;


        /*save percentages*/
        var flTotalPercent = hits / iCount * 100.0;
        var sTotalPercent = (flTotalPercent).toFixed(1) + '%';
        asPercent.push(sTotalPercent);

    }
    $('#textures #pie_hover_title').remove();
    $('#textures').prepend('<p id="pie_hover_title" style="position:absolute;left:5px;top:5px"></p >'); //to do: styling in css

    var r = Raphael("textures", 320, 260);
    var aColors = nsHtml.fGetPieChartColors(pieData.length);
    var pie = r.piechart(200, 140, 110, pieData, {
        legend: aLegend,
        legendpos: 'west',
        minPercent: nsHtml.PIE_THRESHOLD,
        colors: aColors,
        legendcolor: nsHtml.fGetPieCharLegendColor()
    });


    pie.hover(function() {
        $('#op_range').addClass('board_highlight');
        this.sector.stop();
        this.sector.scale(1.1, 1.1, this.cx, this.cy);

        var jsNode = $(this.sector[0]);
        var index = jsNode.index('#textures svg path');
        if (index === -1) //if just one category graphael only draws a circle, no paths
            index = 0;
        $('#pie_hover_title').html(aPropArray[index] + ' ' + asPercent[index]); //todo write the percentage here

        var rankKey = 'texture_result_' + index;
        var rankString = nsHtml.oTextureResultDic[rankKey];
        var oPairRecord = oStat[rankString].oPairRecord;
        for (var prop in oPairRecord) {
            $("#op_range_" + prop).addClass('highlight');
        }

        if (this.label) {
            this.label[0].stop().attr({
                r: 7.5,
                "font-weight": 800
            });

        }
    }, function() {
        $('#op_range').removeClass('board_highlight');
        $('#pie_hover_title').html('');
        this.sector.animate({
            transform: 's1 1 ' + this.cx + ' ' + this.cy
        }, 500, "bounce");
        $("#op_range_table td").removeClass('highlight');
        if (this.label) {
            this.label[0].animate({
                r: 5
            }, 500, "bounce");
            this.label[1].attr({
                "font-weight": 400
            });
        }
    });
    if (!texturesActive) {
        //rendering not done correctly in hidden divs
        $('#textures').removeClass('active');
        jqOldActive.addClass('active');
    }

};

nsHtml.fGetResultStatHtml = function(oHeroStat, oDoneRecord) {
    //sort the props
    var aPropArray = [],
        prop;
    for (prop in oHeroStat) {
        aPropArray.push(prop);
    }
    aPropArray.sort(function(a, b) {
        return oHeroStat[b].wonCount + oHeroStat[b].lossCount + oHeroStat[b].drawCount -
            (oHeroStat[a].wonCount + oHeroStat[a].lossCount + oHeroStat[a].drawCount);
    });


    //generate the html
    var heroStatHtml = '';

    for (i = 0; i < aPropArray.length; i++) {
        prop = aPropArray[i];
        var firstProp = aPropArray[0];
        var totalCountFirstProp = oHeroStat[firstProp].wonCount + oHeroStat[firstProp].lossCount + oHeroStat[firstProp].drawCount;
        var flTotalPercentFirstProp = totalCountFirstProp / oDoneRecord.total * 100.0;


        var winCount = oHeroStat[prop].wonCount;
        var lossCount = oHeroStat[prop].lossCount;
        var drawCount = oHeroStat[prop].drawCount;
        var totalCount = winCount + lossCount + drawCount;


        var flWinPercent = (winCount / totalCount * 100.0);
        var flLossPercent = (lossCount / totalCount * 100.0);
        var flDrawPercent = (drawCount / totalCount * 100.0);
        var flTotalPercent = (totalCount / oDoneRecord.total * 100.0);

        var sWinPercent = (winCount / totalCount * 100.0).toFixed(1) + '%';
        var sLossPercent = (lossCount / totalCount * 100.0).toFixed(1) + '%';
        var sDrawPercent = (drawCount / totalCount * 100.0).toFixed(1) + '%';
        var sTotalPercent = (totalCount / oDoneRecord.total * 100.0).toFixed(1) + '%';
        var flOuterWidth = flTotalPercent / flTotalPercentFirstProp * 100.0;

        var abbrv = nsHtml.fAbbreviateHandType(prop);
        var pb = nsHtml.fDrawMultProgressBar("hero_result_" + i, 'sub_result_pb', flWinPercent, flDrawPercent, flLossPercent, flOuterWidth);


        heroStatHtml = heroStatHtml + '<div class=row><div class="col-lg-4"> ' +
            ' <p class="text-info">' + '<span class="glyphicon glyphicon-star-empty"></span>' + abbrv + ' <span class="stat_percent">(' +
            sTotalPercent + ')</span> </p></div><div class="col-lg-8">' + pb + ' </div></div>'; //fDrawMultProgressBar

        //need timeout because of damned cats								
    }
    return heroStatHtml;

};

nsHtml.fDrawResultsStatPie = function(oHeroStat, oDoneRecord, sId) {
    //sort the props
    var jqOldActive = $('#inner-stats  .tab-pane.active');
    $('#inner-stats .tab-pane').removeClass('active'); //rendering not done correctly in hidden divs
    $('#' + sId).addClass('active');

    var aPropArray = [],
        prop;
    for (prop in oHeroStat) {
        aPropArray.push(prop);
    }
    aPropArray.sort(function(a, b) {
        return oHeroStat[b].wonCount + oHeroStat[b].lossCount + oHeroStat[b].drawCount -
            (oHeroStat[a].wonCount + oHeroStat[a].lossCount + oHeroStat[a].drawCount);
    });


    var flHighestPercent = 0.0;

    $("#" + sId + " svg").remove();

    var pieData = [],
        aLegend = [],
        asTitle = [];
    var asPercent = [],
        asPercentWin = [],
        asPercentDraw = [];
    var asPercentLoss = [];
    var sOthersLegend = '';
    var sOthers = '';
    var i, sWinPercent, sDrawPercent, sTotalPercent, flOuterWidth;
    for (i = 0; i < aPropArray.length; i++) {
        prop = aPropArray[i];
        var firstProp = aPropArray[0];
        var totalCountFirstProp = oHeroStat[firstProp].wonCount + oHeroStat[firstProp].lossCount + oHeroStat[firstProp].drawCount;
        var flTotalPercentFirstProp = totalCountFirstProp / oDoneRecord.total * 100.0;


        var winCount = oHeroStat[prop].wonCount;
        var lossCount = oHeroStat[prop].lossCount;
        var drawCount = oHeroStat[prop].drawCount;
        var totalCount = winCount + lossCount + drawCount;


        var flWinPercent = (winCount / totalCount * 100.0);
        var flLossPercent = (lossCount / totalCount * 100.0);
        var flDrawPercent = (drawCount / totalCount * 100.0);
        var flTotalPercent = (totalCount / oDoneRecord.total * 100.0);

        sWinPercent = (winCount / totalCount * 100.0).toFixed(1) + '%';
        sLossPercent = (lossCount / totalCount * 100.0).toFixed(1) + '%';
        sDrawPercent = (drawCount / totalCount * 100.0).toFixed(1) + '%';
        sTotalPercent = (totalCount / oDoneRecord.total * 100.0).toFixed(1) + '%';
        flOuterWidth = flTotalPercent / flTotalPercentFirstProp * 100.0;

        pieData.push(totalCount);

        var abbr;

        abbr = nsHtml.fAbbreviateInnerString(prop) + '\xA0' + '\xA0' + '\xA0' + '\xA0'; // some extra space
        aLegend.push(abbr); //no way to make some room



        /*save percentages*/
        asPercent.push(sTotalPercent);
        asPercentWin.push(sWinPercent);
        asPercentDraw.push(sDrawPercent);
        asPercentLoss.push(sLossPercent);

        var sTitle;
        if (flTotalPercent < nsHtml.PIE_THRESHOLD) {
            sTitle = '%OTHERS%';
        } else {
            sTitle = aPropArray[i] + ' ' + asPercent[i] +
                ' Win: ' + asPercentWin[i] + ' Draw: ' + asPercentDraw[i] + ' Loss: ' + asPercentLoss[i];
        }
        asTitle.push(sTitle);
    }

    for (i = 0; i < asTitle.length; i++) {
        if (asTitle[i] === '%OTHERS%')
            sOthers = sOthers + ' ' + aPropArray[i] + ' Win: ' + sWinPercent + ' ';
        //should figure it out here
    }

    for (i = 0; i < asTitle.length; i++) {
        if (asTitle[i] === '%OTHERS%')
            asTitle[i] = sOthers;
    }


    //pie = r.piechart(320, 240, 100, [55, 20, 13, 32, 5, 1, 2, 10], { legend: ["%%.%% - Enterprise Users", "IE Users"], legendpos: "west", href: ["http://raphaeljs.com", "http://g.raphaeljs.com"]});

    $('#' + sId).prepend('<p id="pie_hover_title_' + sId + '" style="position:absolute;top:5px;left:5px;"></p>'); //todo styling in css
    var r = Raphael(sId, 320, 260);

    var aColors = nsHtml.fGetPieChartColors(pieData.length);
    var pie = r.piechart(200, 140, 110, pieData, {
        legend: aLegend,
        legendpos: 'west',
        minPercent: nsHtml.PIE_THRESHOLD,
        colors: aColors,
        legendcolor: nsHtml.fGetPieCharLegendColor()
    });

    pie.hover(function() {
        this.sector.stop();
        this.sector.scale(1.1, 1.1, this.cx, this.cy);

        var jsNode = $(this.sector[0]);
        var index = jsNode.index('#' + sId + ' svg path');
        if (index === -1) //if just one category graphael only draws a circle, no paths
            index = 0;
        var sHtml = asTitle[index];
        $('#pie_hover_title_' + sId).html(sHtml); //todo write the percentage here

        if (this.label) {
            this.label[0].stop();
            this.label[0].attr({
                r: 7.5
            });
            this.label[1].attr({
                "font-weight": 800
            });
        }
    }, function() {
        $('#pie_hover_title_' + sId).html('');
        this.sector.animate({
            transform: 's1 1 ' + this.cx + ' ' + this.cy
        }, 500, "bounce");
        if (this.label) {
            this.label[0].animate({
                r: 5
            }, 500, "bounce");
            this.label[1].attr({
                "font-weight": 400
            });
        }
    });
    $('#inner-stats .tab-pane').removeClass('active'); //rendering not done correctly in hidden divs
    jqOldActive.addClass('active');
};

nsHtml.fGetPairFromString = function(sHtml, selected) {

    var oPair = new Pair(sHtml);
    var aUnjoined = oPair.toArray();
    var aKnownCards = nsUI.fGetKnownCards();
    var returnString = "<div id='expanded_pair_" + sHtml + "' class='expanded_pair'>";
    for (i = 0; i < aUnjoined.length; i++) {
        var inKnownCards = false;
        for (var j = 0; j < aKnownCards.length; j++) {
            if (aKnownCards[j].suit === aUnjoined[i][0].suit &&
                aKnownCards[j].rank === aUnjoined[i][0].rank)
                inKnownCards = true;
            else if (aKnownCards[j].suit === aUnjoined[i][1].suit &&
                aKnownCards[j].rank === aUnjoined[i][1].rank)
                inKnownCards = true;
        }

        returnString = returnString + nsHtml.fWrapPair(nsHtml.fWrapCard(aUnjoined[i][0]) +
            nsHtml.fWrapCard(aUnjoined[i][1]), inKnownCards, selected) + '    ';
    }
    returnString += "</div>";
    return returnString;
};

nsHtml.fWrapPair = function(pairString, bDisabled, bSelected) {
    var disabledString = bDisabled ? 'disabled' : '';
    var selectedString = bSelected ? 'selected' : '';

    return "<div class = 'pair_string " + disabledString + " " + selectedString + " '>" + pairString + "</div>";
};


nsHtml.fSetMainStatBar = function(totalWonPer, totalDrawPer, totalLossPer) {
    $('#win_percent_bar div').each(function(i) {
        if (i === 0)
            $(this).css('width', totalWonPer + '%');
        if (i === 1)
            $(this).css('width', totalDrawPer + '%');
        if (i === 2)
            $(this).css('width', totalLossPer + '%');

    });
};

nsHtml.fInitResultPopovers = function() {
    //$(".sub_result_pb").popover('destroy');
    $("#inner-stats .sub_result_pb").popover({
        content: function() {
            var returnString = '';
            var parentWidth = parseFloat($(this).css('width')) / 100.0;
            $(this).children().each(function(i) {
                if (i === 0)
                    returnString = returnString + 'win: ' + (parseFloat($(this).css('width')) / parentWidth).toFixed(1) + '%';
                if (i === 1)
                    returnString = returnString + ' draw: ' + (parseFloat($(this).css('width')) / parentWidth).toFixed(1) + '%';
                if (i === 2)
                    returnString = returnString + ' loss: ' + (parseFloat($(this).css('width')) / parentWidth).toFixed(1) + '%';
            });
            return returnString;
        },
        placement: 'bottom',
        trigger: 'hover',
        html: true
    });

};

module.exports = nsHtml;

},{"./Convert":11,"./Util":16}],13:[function(require,module,exports){

var nsMath= {};

nsMath.combine = function(aN, k) {
    if (k === 0)
        return [];

    var aDisplace = [];

    for (i = 0; i < k; i++)
        aDisplace[i] = 0;

    var returnArray = [];
    var max = aN.length - aDisplace.length; //w
    var currentColumn = aDisplace.length - 1;
    var fAddFoundArray = function() {
        var addArray = [];
        var aDisplaceLength = aDisplace.length;
        for (i = 0; i < aDisplaceLength; i++) {
            addArray[i] = aN[i + aDisplace[i]];
        }
        returnArray.push(addArray);
    };
    fAddFoundArray();

    while (aDisplace[0] !== max) {
        //print result

        //find first column less than max
        for (i = aDisplace.length - 1; i >= 0; i--) {
            if (aDisplace[i] < max) {

                var currentAdd = aDisplace[i] + 1;
                aDisplace[i] = currentAdd;
                for (j = i + 1; j < aDisplace.length; j++) aDisplace[j] = Math.min(currentAdd, aDisplace[j]);

                break;
            } //end iff
        } //end for
        fAddFoundArray();
    } //end while
    return returnArray;
}; // end func

nsMath.numberOfCombinations = function(n, k) {
    return nsMath.factorial(n) / (nsMath.factorial(k) * nsMath.factorial(n - k));
};

nsMath.factorial = function(n) {
    if (n <= 1) return 1;
    return n *nsMath.factorial(n - 1);
};

nsMath.shuffle = function(aArray, iMaxSub) {
    var returnArray = [];
    var arrayLength = aArray.length;
    if (arrayLength === 0)
        return aArray;
    if (typeof iMaxSub === "undefined")
        iMaxSub = arrayLength;

    var randomIndex;
    for (var i = arrayLength; i > 0; i--) {
        randomIndex = Math.floor((Math.random() * (i - 1)));
        returnArray.push(aArray[randomIndex]);
        if (returnArray.length >= iMaxSub)
            return returnArray;
        aArray.splice(randomIndex, 1);
    }

    return returnArray;
};

module.exports = nsMath;

},{}],14:[function(require,module,exports){
var routerValues = {};
var Backbone = require('backbone');
var TableRouter = Backbone.Router.extend({

    routes: {
        "help": "help", // #help
        "hand=(:v1)&board=(:v2)&slider=(:v3)&range=(:v4)&custom=(:v5)&filter=(:v6)": "main"
    },

    help: function() {

    }, 
    getRouterValues() {
        return routerValues;
    },
    main: function(hand, board, slider, range, custom, filter) {
        routerValues.hand = hand;
        routerValues.board = board;
        routerValues.slider = slider;
        routerValues.custom = custom;
        routerValues.filter = filter;

        if (typeof flopYoMama !== "undefined" && flopYoMama.knownCards) {
            window.flopYoMama.knownCards.trigger('update', hand, board);
        }

        if (typeof flopYoMama !== "undefined" && flopYoMama.slider) {
            window.flopYoMama.sliderView.trigger('update', slider);
        }

        if (typeof flopYoMama !== "undefined" && flopYoMama.rangeTable) {
            window.flopYoMama.rangeTable.setCustom(custom);
        }
    }
});

module.exports = TableRouter;

},{"backbone":64}],15:[function(require,module,exports){
"use strict";
var globalUi = require('../Constants/Ui');
var nsUI = {};

//this can stay in the ui and not move to the known cards because 
//it may hand key presses outside of the known cards
nsUI.fHandleKeyPress = function(keyCode, e, knownCardsView) {
    var d = e.srcElement || e.target;

    if (!$(d).hasClass('known')) {
        //nsUI.fHandleKeyPressAnywhereElse(keyCode,e);
        return;
    } else {
        knownCardsView.handleKeyPressKnown(keyCode, e);
    }
};


nsUI.fDeleteLongStatistics = function() {
    $('#hero_stat, #villain_stat').html('');
    nsUI.fSetWinPercentBarZero();
};

nsUI.fSetWinPercentBarZero = function() {
    var oldTransition = $('#win_percent_bar').children().first().css('transition');
    $(this).children().css('transition', 'none').css('-webkit-transition', 'none');
    $('#win_percent_bar').children().css('width', '0px');
    setTimeout(function() {
        $('#win_percent_bar').children().css('transition', oldTransition).css('-webkit-transition', oldTransition);
    }, 1);
};


nsUI.fGetKnownCards = function() {
    var jqCards = $('.known');
    var aCards = [];
    jqCards.each(function() {
        var raw = $(this).val();
        if (raw !== globalUi.EMPTY_CARD_STRING)
            aCards.push(nsConvert.fConvertStringToCardObject(raw));
    });
    return aCards;
};

nsUI.fToggleCheckableMenu = function(node, bTurnOffOthers, bForceTrue) {

    if (!bForceTrue) {
        $(node).toggleClass('active');
    } else {
        $(node).addClass('active');
    }

    if ($(node).hasClass('active')) {

        if ($(node).find('.glyphicon-ok').length == 0)
            $(node).find('a').append('<span class = "glyphicon glyphicon-ok"></span>');

        if (bTurnOffOthers) {
            $(node).siblings().removeClass('active').find('.glyphicon-ok').remove();
        }

        return true;
    } else {
        $(node).find('.glyphicon-ok').remove();
        return false;
    }
};

nsUI.clBootstrapCombobox = function(sId, aOptions, aDisplay, sHelpText, iSeparatorIndex) {
    var sHtml = '<div class="input-group" id ="' + sId + '">';
    sHtml += '<div class="input-group-btn">';
    sHtml += '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>';
    sHtml += '<ul class="dropdown-menu">';
    for (var i = 0; i < aOptions.length; i++) {
        sHtml += '<li id="' + aOptions[i] + '"><a href="#">' + aDisplay[i] + '</a></li>';
        // <li class="divider"></li>
    }
    sHtml += '</ul>';
    sHtml += '<button type="button" class="validate btn btn-default dropdown-toggle" data-toggle="dropdown"></button>';
    sHtml += '</ul>';
    sHtml += '</div>';
    sHtml += '<input type="text" class="form-control" placeholder="' + sHelpText + '">';
    sHtml += '</div>';
    return sHtml;
};

nsUI.fAddEventsToCombobox = function(sId, fVal) {

    //restore after autocomplete
    $('#' + sId + ' .btn').click(function() {
        $('#' + sId + ' .input-group-btn').removeClass('open');
        $('#' + sId + ' li').css('display', 'block').removeClass('active');
        $('#' + sId + ' ul').css('left', 0 + 'px');
    });


    $('#' + sId).on('click', 'li', function() {
        var val = $(this).attr('id');
        var display = $(this).children().first().html();
        $('#' + sId + ' input').val(display);

        $(this).addClass('active');
        $(this).siblings().removeClass('active');

        fVal();
    });
    var aOpen = [];
    var aNotOpen = [];
    var bExact = false;
    $('#' + sId + ' input').keyup(function(e) {

        //todo autocomplete
        bExact = false;
        aOpen = [];
        aNotOpen = [];
        $('#' + sId + ' li').each(function() {
            var liLower = $(this).find('a').html();
            liLower = liLower.toLowerCase();
            var thisLower = $('#' + sId + ' input').val().toLowerCase();
            if (liLower === thisLower && thisLower.length > 0) {
                $(this).addClass('active');
                $(this).siblings().removeClass('active');
                bExact = true;

            } else if (liLower.indexOf(thisLower) > -1 && thisLower.length > 0) { //found a hit
                aOpen.push(this);
            } else
                aNotOpen.push(this);

        });
        if (!bExact) {
            if (aOpen.length > 0) {
                $('#' + sId + ' .input-group-btn').addClass('open');
                var position = $('#' + sId + ' input').position();
                $(aOpen).css('display', 'block');
                $(aNotOpen).css('display', 'none').removeClass('active'); //active and it assumes the value is that
                //seems to be buggy when two hits
                $('#' + sId + ' ul').css('left', position.left + 'px');
                $('#' + sId + ' li').removeClass('active');
            } else {
                $('#' + sId + ' .input-group-btn').removeClass('open');
                $('#' + sId + ' li').css('display', 'block').removeClass('active');
                $('#' + sId + ' ul').css('left', 0 + 'px');
                //if (!bExact) //wenn genauer treffer lassen wir die li active
                //$('#' + sId + ' li').removeClass('active');
            }
        }

        fVal();
    });

    //tab key for autocomoplete
    $('#' + sId + ' input').keydown(function(e) {
        var keyCode = e.keyCode ? e.keyCode : e.which; //TAB_CODE
        if (keyCode === TAB_CODE && $('#' + sId + ' .input-group-btn').hasClass('open')) {
            var sHtml = $(aOpen[0]).find('a').html();
            $(aOpen[0]).addClass('activated');
            $('#' + sId + ' input').val(sHtml);
            $('#' + sId + ' .input-group-btn').removeClass('open');
            nsUtil.fLog('autocomplete ' + sHtml);
            $(this).triggerHandler('keyup');
        }

    });


    var fStandardValidate = function() {
        var val = $('#' + sId + ' input').val();
        var valButton = $('#' + sId).find('.validate');
        if (val === '') {
            valButton.html('<span class="glyphicon glyphicon-remove"></span>');
            return false;
        } else if (val === $('#' + sId + ' li.active a').html())
            valButton.html('<span class="glyphicon glyphicon-ok"></span>');
        else
            valButton.html('<span class="glyphicon glyphicon-plus-sign"></span>');

        nsUtil.fLog('triggering validated');
        $('#' + sId).trigger('validated');
        return true;
    };

    if (typeof fVal === 'undefined')
        fVal = fStandardValidate;

    fVal();
};

module.exports = nsUI;

},{"../Constants/Ui":6}],16:[function(require,module,exports){

var nsUtil = {};

nsUtil.combineObjects = function(a, b, fn) {

    //combines the two objects and performs the function with the properties of the arguments
    var returnObject = {},
        prop;
    for (prop in a) {
        returnObject[prop] = fn(a[prop], b[prop]);
    }
    for (prop in b) {
        if (typeof a[prop] === "undefined")
            returnObject[prop] = fn(a[prop], b[prop]);
    }
    return returnObject;
};


var TYPES = {
        'undefined': 'undefined',
        'number': 'number',
        'boolean': 'boolean',
        'string': 'string',
        '[object Function]': 'function',
        '[object RegExp]': 'regexp',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object Error]': 'error'
    },
    TOSTRING = Object.prototype.toString;

//todo replace with underscore
nsUtil.fType = function(o) {
    return TYPES[typeof o] || TYPES[TOSTRING.call(o)] || (o ? 'object' : 'null');
};

//sets an object ot local storage as json, with automatic wrapping
//if object is an array
nsUtil.fSetLocalStorage = function(k, v) {

    var vType = nsUtil.fType(v);
    var sJson;
    if (vType === 'array')
        sJson = JSON.stringify({
            json_array_data_conversion: v
        }); //wrapper for arrays
    else
        sJson = JSON.stringify(v);
    localStorage.setItem(k, sJson);
};

nsUtil.fClone = function(o) {
    return JSON.parse(JSON.stringify(o));
};

nsUtil.fImportLocalStorage = function(sFile) {
    var oParsed = JSON.parse(sFile);
    for (var prop in oParsed) {
        var gotOne = oParsed[prop];
        localStorage.setItem(prop, gotOne);
    }
};

nsUtil.fExportLocalStorage = function(fTest) {
    if (nsUtil.fType != 'function') {
        fTest = function() {
            return true;
        };
    }
    var item, o = {};
    for (prop in localStorage) {
        item = localStorage.getItem(prop);
        if (fTest(prop, item)) {
            o[prop] = item;
        }
    }
    return JSON.stringify(o);
}

nsUtil.fGetLocalStorage = function(v) {
    var sJson = localStorage.getItem(v);

    try {
        var o = JSON.parse(sJson);
    } catch (e) {
        console.log("unexpected localStorage key, val: " + v + ", " + sJson);
        return null;
    }
    if (typeof(o) === "object" && o !== null && o.json_array_data_conversion) {
        return o.json_array_data_conversion;
    } else
        return o;
};

nsUtil.fLog = function(text) {
    console.log(text);
};

module.exports = nsUtil;

},{}],17:[function(require,module,exports){
var nsFilter = require('../Filter/Filter');
var nsFilterHtml = require('../Filter/FilterHtml');
var nsUtil = require('../Core/Util');

$(function() {

    nsFilter.fInit();
    nsFilterHtml.fReBuildFilterMenu();

    //filter settings before slider, because slider triggers eval

    var localFilterSettings = nsUtil.fGetLocalStorage("filter_settings");
    if (localFilterSettings !== null && localFilterSettings !== '') {
        nsUI.fToggleCheckableMenu($('#' + localFilterSettings), true);
        nsUtil.fLog('toggle: ' + localFilterSettings);
    }

    $('#filter_editor').bind('hide.bs.modal', function() {
        if (nsFilterHtml.fUpdateUI()) {
            if (confirm('You have unsaved changes. Do you wish to discard them?'))
                return true;
            else return false;
        }
    });

    $('#discard_filter').click(function() {
        if (confirm('Discard changes?')) {
            nsFilter.sEditedJSON = nsFilter.sOriginalJSON;
            nsFilterHtml.fLoadFilterFromObject(nsFilter.sOriginalJSON);
            nsFilterHtml.fUpdateUI();
        }
    });

    $('#delete_filter').click(function() {
        //todo add name
        if (confirm('Really delete this filter?')) {
            nsFilter.fDeleteFilter();
            nsFilterHtml.fReBuildFilterMenu();
            nsFilter.fClearFilter();
            $('#filter_editor').trigger('show.bs.modal');
        }
    });

    $('#save_filter').click(function() {
        nsFilter.fSaveFilter();
        nsFilterHtml.fReBuildFilterMenu();
        nsFilter.sEditedJSON = nsFilter.sOriginalJSON;
        nsFilterHtml.fUpdateUI();
    });

    //new subfilter clicks	
    $('#filter_editor').on('click', '.new_subfilter', function() {
        var thisRow = $(this).parents('.filter_ctrl_row');
        nsFilterHtml.fAddSubRow(thisRow);
        nsFilter.fSetEditedJson();
        nsFilterHtml.fUpdateUI();
    });

    //delete subfilter clicks
    $('#filter_editor').on('click', '.delete_subfilter', function() {
        var thisRow = $(this).parents('.filter_ctrl_row');
        var next = thisRow.next();
        if (thisRow.next().is('.filter_group_subgroup')) {
            if (thisRow.next().children().length > 0)
                if (confirm('Deleting a group requires deleting all sub-elements! Continue?')) {
                    next.remove();
                    thisRow.remove();
                }
        } //wrapper for subfilters already there
        else { //need new subfilter container
            thisRow.remove();

        }

        nsFilter.fSetEditedJson();
        nsFilterHtml.fUpdateUI();
    });

    //dropdown menu clicks
    $('#filter_editor').on('click', '#filter_loaded .dropdown-menu li', function() {
        var labelButton = $(this).parent().parent().prev();
        var hasDeleteButton = false;
        var buttonContainer = $(this).parent().parent().parent().parent();
        var thisRow = $(this).parents('.filter_ctrl_row');

        if ($(this).parents('.filter_group_subgroup').length > 0)
            hasDeleteButton = true;
        var displayVal = $(this).find('a').html();
        var val = $(this).find('a').attr('class');
        var bNothingChanged = $(this).hasClass('selected');

        $(this).addClass('selected active').siblings().removeClass('selected active');

        //do nothing if val isn't new
        if (!bNothingChanged) {
            //changing the type of the row				
            if ($(this).parent().is('.sub_filter_type')) {
                var sHtml = nsFilterHtml.fSubFilterButtonGroup(val, hasDeleteButton);

                //changing the type of the row may require deleting subnodes
                if (thisRow.next().is('.filter_group_subgroup')) {
                    if (thisRow.next().children().length > 0)
                        if (confirm('Changing this group type will delete sub-elements! Continue?')) {
                            thisRow.next().remove();
                            buttonContainer.html(sHtml);
                        }
                } else
                    buttonContainer.html(sHtml);
            } else {
                labelButton.html(displayVal);
            }
            nsFilter.fSetEditedJson();
            nsFilterHtml.fUpdateUI();
        }
    });

    //open empty modal		
    $('body').on('show.bs.modal', '#filter_editor', function() {
        nsFilterHtml.fLoadNew();

        setTimeout(function() {
            nsUI.fAddEventsToCombobox('sel_filter');

            $('#sel_filter').keypress(function() {
                nsFilterHtml.fUpdateUI();
            });
            nsFilter.sEditedJSON = '';
            nsFilter.sOriginalJSON = '';
            nsFilterHtml.fUpdateUI();
            $('#sel_filter').bind('validated', function() {
                if (nsFilter.sOriginalJSON !== nsFilter.sEditedJSON)
                    return;
                $('#filter_loaded').remove();
                var filterId;
                var sId = $('#sel_filter li.active').attr('id');

                if (sId)
                    filterId = sId.substring('sel_'.length);
                else
                    filterId = '';

                sInnerHtml = nsFilterHtml.fFilterHtmlFromSelect(filterId);
                $('#filter_editor .modal-body').append(sInnerHtml);

                var original = nsFilter.fCurrentToJSON();
                nsFilter.sEditedJSON = original;
                nsFilter.sOriginalJSON = original;
            });
        }, 1);
    });
});
},{"../Core/Util":16,"../Filter/Filter":18,"../Filter/FilterHtml":19}],18:[function(require,module,exports){
var nsUtil = require('../Core/Util');

var nsFilter = {};
nsFilter.bEdited = false;
nsFilter.sOriginalJSON = '';
nsFilter.sEditedJSON = '';

/*standard empty filters*/
nsFilter.nsStandard = {};
nsFilter.nsStandard.oGroup = {
    "sub_filter_type": "class_group",
    "group_log_op": "log_op_or"
};
nsFilter.nsStandard.oMadeHand = {
    "sub_filter_type": "class_made_hand",
    "comparator_op": "at_least",
    "made_hand_op": "made_hand_0"
};
nsFilter.nsStandard.oDrawingHand = {
    "sub_filter_type": "class_drawing_hand",
    "comparator_op": "at_least",
    "drawing_hand_op": "drawing_hand_3"
};

/*standard filters*/
nsFilter.nsStandardFilters = {};
nsFilter.nsStandardFilters['filter_strong_hand'] = {
    "oValues": {
        "sub_filter_type": "class_group",
        "group_log_op": "log_op_or"
    },
    "sub": [{
            "oValues": {
                "sub_filter_type": "class_made_hand",
                "comparator_op": "at_least",
                "made_hand_op": "made_hand_2"
            }
        },
        {
            "oValues": {
                "sub_filter_type": "class_drawing_hand",
                "comparator_op": "at_least",
                "drawing_hand_op": "drawing_hand_3"
            }
        }
    ],
    "name": 'Strong Hand'
};

nsFilter.nsStandardFilters['filter_junk'] = {
    "oValues": {
        "sub_filter_type": "class_group",
        "group_log_op": "log_op_and"
    },
    "sub": [{
            "oValues": {
                "sub_filter_type": "class_made_hand",
                "comparator_op": "at_most",
                "made_hand_op": "made_hand_0"
            }
        },
        {
            "oValues": {
                "sub_filter_type": "class_drawing_hand",
                "comparator_op": "at_most",
                "drawing_hand_op": "drawing_hand_2"
            }
        }
    ],
    "name": 'Junk'
};

nsFilter.nsStandardFilters['filter_bluffy'] = {
    "oValues": {
        "sub_filter_type": "class_group",
        "group_log_op": "log_op_or"
    },
    "sub": [{
        "oValues": {
            "sub_filter_type": "class_filter",
            "sub_filter_op": "filter_strong_hand"
        }
    }, {
        "oValues": {
            "sub_filter_type": "class_filter",
            "sub_filter_op": "filter_junk"
        }
    }],
    'name': 'Bluffy'
};

nsFilter.nsStandardFilters['filter_monster'] = {
    "oValues": {
        "sub_filter_type": "class_made_hand",
        "comparator_op": "at_least",
        "made_hand_op": "made_hand_3"
    },
    'name': 'Monster'
}

nsFilter.sFilterNamesKey = 'filters_saved';

//Check if the local storage looks like it's empty. If it's not empty, 
//it initializes it based on the values of the standard filters. 
nsFilter.fInit = function() {
    var loc = nsUtil.fGetLocalStorage(nsFilter.sFilterNamesKey);
    if (loc == null || typeof(loc) == "undefined") {
        loc = _.keys(nsFilter.nsStandardFilters);
        nsUtil.fSetLocalStorage(nsFilter.sFilterNamesKey, loc);
    }
};

//save filter
nsFilter.fSaveFilter = function() {
    var oJson = nsFilter.fCurrentToJSON();
    var sName = 'filter_' + nsFilterHtml.fGetCurrentFilterNameIntern();
    nsUtil.fSetLocalStorage(sName, oJson);
    var aExisting = nsUtil.fGetLocalStorage(nsFilter.sFilterNamesKey);
    if (!aExisting)
        aExisting = [];
    if (aExisting.indexOf(sName) === -1)
        aExisting.push(sName);
    nsUtil.fSetLocalStorage(nsFilter.sFilterNamesKey, aExisting);
};

//delete filter. only removes the filter from the saved filters
//list (does not delete the json.) if name is undefined it uses
//the name of the current filter
nsFilter.fDeleteFilter = function(name) {
    if (typeof name === "undefined") {
        name = nsFilterHtml.fGetCurrentFilterNameIntern();
    }
    name = 'filter_' + name;
    //update the saved key so it no longer contains name
    var aSavedKeys = nsUtil.fGetLocalStorage(nsFilter.sFilterNamesKey);
    if (!aSavedKeys) {
        return;
    }
    var index = aSavedKeys.indexOf(name);
    if (index > -1) {
        aSavedKeys.splice(index, 1);
    }
    nsUtil.fSetLocalStorage(nsFilter.sFilterNamesKey, aSavedKeys);

};

//returns the active filter as an object
nsFilter.fActiveFilter = function(sName, bUnpack) {
    if (typeof(sName) === 'undefined' || sName === null)
        sName = nsFilter.fGetActiveFilter();

    nsUtil.fLog('now unpacking ' + sName)

    var oFilter = nsUtil.fGetLocalStorage(sName);

    if (!oFilter) //get it from the standard names if not
        oFilter = nsFilter.nsStandardFilters[sName];

    if (!oFilter) {
        return;
    }
    oFilter = nsUtil.fClone(oFilter);

    if (bUnpack === true) {
        oFilter = nsFilter.fUnpack(oFilter);
    }

    return oFilter;
};

//note that this also modifies oFilter						
nsFilter.fUnpack = function(oFilter) {
    var returnVal = oFilter;
    var vals = returnVal.oValues;
    var type = vals.sub_filter_type;
    if (type === "class_filter") {
        return nsFilter.fActiveFilter(vals.sub_filter_op, true);
    } else if (type === "class_group") {
        for (var i = 0; i < returnVal.sub.length; i++) {
            var sub = returnVal.sub[i];
            returnVal.sub[i] = nsFilter.fUnpack(sub);
        }
        return returnVal;
    } else
        return returnVal;
};
/************************************************** JSON PACKAGING ****************************************************************************/

nsFilter.fCurrentToJSON = function() {
    var oRow = $('#filter_loaded').children().first();
    var oReturn = nsFilter.fCurrentToJSONRec(oRow);
    oReturn['name'] = $('#sel_filter input').val();
    //var sReturn = JSON.stringify(oReturn);	
    return oReturn;
};


nsFilter.fCurrentToJSONRec = function(oRow) {

    var oReturn = {
        oValues: {}
    };
    var oButtonGroup = oRow.find('.btn-group').first();
    var nSelected = oButtonGroup.find('li.selected');

    nSelected.each(function() {
        var sSelected = $(this).parent('ul').attr('selection-type');
        oReturn.oValues[sSelected] = $(this).find('a').attr('class');
    });

    if (oRow.next().is('.filter_group_subgroup')) {
        oReturn.sub = [];
        var filterSub = oRow.next().children('.row');
        filterSub.each(function() {
            var rec = nsFilter.fCurrentToJSONRec($(this));
            oReturn.sub.push(rec);
        });
    }

    return oReturn;
};

nsFilter.nsEvaluate = {};

nsFilter.oFilterRecord = {};

nsFilter.fClearFilter = function() {
    $("#op_range_table td").removeClass('filtered filtered_out');
    $("#op_range_table .glyphicon-filter").remove();
    nsFilter.oFilterRecord = {};
};

nsFilter.fGetActiveFilter = function() {
    var jqActiveFilter = $('#filter_config_menu li.active');
    if (jqActiveFilter.length === 0)
        return null;

    var sName = $(jqActiveFilter).attr('id');
    return sName;
};

nsFilter.fDrawFilterToBoard = function(oFilterRecord) {
    for (var sPairName in oFilterRecord) {
        var aPair = oFilterRecord[sPairName];
        if (aPair.length > 0) {
            $('#op_range_' + sPairName).addClass('filtered');

            var oPair = new Pair(sPairName);
            var aAllPairs = oPair.toArray(nsUI.fGetKnownCards());

            if (aAllPairs.length === aPair.length)
                $('#op_range_' + sPairName).addClass('filtered_out');

            if ($('#op_range_' + sPairName + ' .glyphicon-filter').length === 0)
                $('#op_range_' + sPairName + ' .static_bg').append('<span class="glyphicon glyphicon-filter"></span>');
        }
    }
};

nsFilter.nsEvaluate.fEval = function(sName, varCards) {
    /*here i should read them from the fileStorage if present*/
    var oFilter = nsFilter.fActiveFilter(sName);
    return nsFilter.nsEvaluate.fEvaluateFilter(oFilter, varCards);
};

nsFilter.nsEvaluate.oCurrentHand = null;

//returns true if the filter hits
nsFilter.nsEvaluate.fEvaluateFilter = function(oFilter, varCards) {
    //varCards can actually be an array or the finished object...
    var oHand = {};
    if (nsUtil.fType(varCards) === 'array')
        oHand = nsDrawingHand.fGetDrawingHands(varCards);
    else
        oHand = varCards;

    var ns = nsFilter.nsEvaluate;
    //code smell: quit doing side effects, Aaron	
    ns.oCurrentHand = oHand; //save this to prevent having to do it again

    if (!oFilter)
        return true; //always passes null filter

    var returnVal = false;
    switch (oFilter.oValues.sub_filter_type) {
        case 'class_made_hand':
            returnVal = ns.fEvaluateMadeHand(oFilter.oValues, oHand);
            break;
        case 'class_drawing_hand':
            returnVal = ns.fEvaluateDrawingHand(oFilter.oValues, oHand);
            break;
        case 'class_filter':
            returnVal = ns.fEvaluateSubFilter(oFilter.oValues, oHand);
            break;
        case 'class_group':
            returnVal = ns.fEvaluateGroup(oFilter, oHand);
            break;
        default:
            returnVal = false; //should throw exception here
            console.error('filter failed');
            break;
    }


    //nsUtil.fLog('hand rank is ' + oHand.rank + ' and return value ' + returnVal )
    return returnVal;
};

nsFilter.nsEvaluate.fEvaluateGroup = function(oFilter, oHand) {
    var sub = oFilter.sub;
    //boilerplate for clarity (??)
    if (oFilter.oValues.group_log_op === 'log_op_and') { //must all be true
        for (var i = 0; i < sub.length; i++) {
            var bSubResult = nsFilter.nsEvaluate.fEvaluateFilter(sub[i], oHand);
            if (bSubResult === false)
                return false;

        }
        return true;
    } else if (oFilter.oValues.group_log_op === 'log_op_or') { //only one must be true	
        for (var i = 0; i < sub.length; i++) {
            var bSubResult = nsFilter.nsEvaluate.fEvaluateFilter(sub[i], oHand);
            if (bSubResult === true)
                return true;
        }
        return false;
    }
};

nsFilter.nsEvaluate.fEvaluateSubFilter = function(oValues, oHand) {
    var sName = oValues.sub_filter_op; //"strong_hand"
    var aSplit = sName.split('_');
    var aSliced = aSplit.slice(2);
    var sFinal = aSliced.join('_');
    return nsFilter.nsEvaluate.fEval(sFinal, oHand);
};

nsFilter.nsEvaluate.fEvaluateMadeHand = function(oValues, oHand) {
    var iFilterRank = parseInt(oValues.made_hand_op.split('_')[2]);
    if (oValues.comparator_op === 'at_least') {
        if (oHand.rank >= iFilterRank)
            return true;
        else
            return false;
    } else if (oValues.comparator_op === 'at_most') {
        if (oHand.rank <= iFilterRank)
            return true;
        else
            return false;
    }

    //should never get here
};

nsFilter.nsEvaluate.fEvaluateDrawingHand = function(oValues, oHand) {
    var iFilterRank = parseInt(oValues.drawing_hand_op.split('_')[2]);

    var iDrawingHandRank = -1;
    if (oHand.drawingHands.length > 0)
        iDrawingHandRank = oHand.drawingHands[0].rank; //THESE SHOULD ALREADY BE SORTED

    if (oValues.comparator_op === 'at_least') {
        if (iDrawingHandRank >= iFilterRank)
            return true;
        else
            return false;
    } else if (oValues.comparator_op === 'at_most') {
        if (iDrawingHandRank <= iFilterRank)
            return true;
        else
            return false;
    }
};

nsFilter.fSetEditedJson = function() {
    nsFilter.sEditedJSON = JSON.stringify(nsFilter.fCurrentToJSON());
};

module.exports = nsFilter;

},{"../Core/Util":16}],19:[function(require,module,exports){

var nsFilter = require('./Filter');
var nsUtil = require('../Core/Util');
var nsFilterHtml = {};

nsFilterHtml.fGetFilterUI = function() {
    var sHtml = '<div class="row form-group">';
    sHtml += '<label id="sel_filter_label" for="sel_filter" class="col-lg-3 control-label">Select filter</label>';
    sHtml += '<div class="col-lg-9">';
    sHtml += nsFilterHtml.fGetFilterCombobox();
    sHtml += '</div>';
    sHtml += '</div>';
    return sHtml;
};

nsFilterHtml.fReBuildFilterMenu = function() {
    //first delete existing
    $('#filter_config_menu li.filter').remove();
    var sHtml = '';

    var aSavedKeys = nsUtil.fGetLocalStorage(nsFilter.sFilterNamesKey);

    //if (isNot(aSavedKeys))
    if (!aSavedKeys)
        aSavedKeys = [];

    for (var i = 0; i < aSavedKeys.length; i++) {
        var sName = aSavedKeys[i];
        var oFilter = nsFilter.fActiveFilter(sName);
        //nsUtil.fLog('FReBuildFilter Menu filter ' + JSON.stringify(oFilter));
        var name = oFilter.name;
        if (!name) {
            name = 'Name Unknown';
        }

        sHtml += "<li id ='" + sName + "' class='filter'>";
        sHtml += "<a href='#" + sName + "'>" + name + "</a>";
        sHtml += '</li>';
    }
    $('#filter_config_menu').prepend(sHtml);
};

nsFilterHtml.fGetFilterCombobox = function() {
    var aValues = [],
        aDisplay = [];
    $('#filter_config_menu .filter').each(function() {
        /*var aSplit = $(this).attr('id').split('_');
        aSplit.pop();
        var value = aSplit.join('_');*/
        var value = 'sel_' + $(this).attr('id');
        var sRaw = $(this).find('a').html();
        var index = sRaw.indexOf('<');
        var sSub;
        if (index > 0)
            sSub = sRaw.substring(0, index);
        else
            sSub = sRaw;
        aDisplay.push(sSub);
        aValues.push(value);
    });
    return nsUI.clBootstrapCombobox('sel_filter', aValues, aDisplay, 'Click button or type (new) name');
};

nsFilterHtml.fWrapSubFilterButtonGroup = function(sBtnGroup) {
    var colOffsetTag = '',
        iIndent = 0;
    var colTag = 'col-lg-' + (12 - iIndent);

    sHtml = '';
    sHtml += '<div class="row filter_ctrl_row">';
    sHtml += '<div class="filter_ctrl_col ' + colTag + ' ' + colOffsetTag + '">';
    sHtml += sBtnGroup;
    sHtml += '</div>';
    sHtml += '</div>';
    return sHtml;
};

//fuer untergruppen damit wir einen baum struktur behalten
nsFilterHtml.fWrapSubFilterGroup = function(sGroupGroup) {
    sHtml = '<div class = "filter_group_subgroup"><img class="brace" src="Style/GullBraceLeft.svg">' + sGroupGroup + '</div>';
    return sHtml;
};

nsFilterHtml.fFilterHtmlFromSelect = function(sVal) {
    var sHtml = '<div id="filter_loaded" class="well">';

    var oSettings = nsFilter.fActiveFilter(sVal);
    if (typeof oSettings !== 'undefined' && oSettings !== null) {
        //get the json object		
        sHtml += nsFilterHtml.fLoadFilterFromObject(oSettings);

    } else { //new
        sHtml += nsFilterHtml.fWrapSubFilterButtonGroup(nsFilterHtml.fSubFilterButtonGroup(nsFilter.nsStandard.oGroup));
    }
    sHtml += '</div>';
    return sHtml;
};

nsFilterHtml.fLoadNew = function() {
    var sHtml = nsFilterHtml.fGetFilterUI();
    $('#filter_editor .modal-body').html(sHtml);
};


nsFilterHtml.fUpdateUI = function() {
    var sString = 'Select filter';
    var bReturn = true;
    if (nsFilter.sOriginalJSON !== nsFilter.sEditedJSON) {
        sString = 'Edit name';
        $('#sel_filter .btn').not('.close').addClass('disabled');
        $('#sel_filter .validate.btn').addClass('btn-warning').removeClass('btn-default btn-primary');

        if ($('#sel_filter input').val().length > 0) //name validation
            $('#save_filter').removeClass('btn-default btn-success disabled');

        $('#discard_filter').removeClass('disabled');
        $('#delete_filter').addClass('disabled');
    } else {
        $('#sel_filter .btn').removeClass('btn-default btn-warning disabled');
        $('#sel_filter .validate.btn').addClass('btn-primary').removeClass('btn-default btn-warning');
        $('#save_filter').addClass('disabled');
        $('#discard_filter').addClass('disabled');
        $('#delete_filter').removeClass('disabled');
        bReturn = false;
    }

    $('#sel_filter_label').html(sString);
    return bReturn;
};

nsFilterHtml.fLoadFilterFromObject = function(oSettings, bDeleteButton) {
    var sHtml = '';
    if (typeof bDeleteButton === "undefined")
        bDeleteButton = false;
    sHtml += nsFilterHtml.fWrapSubFilterButtonGroup(nsFilterHtml.fSubFilterButtonGroup(oSettings.oValues, bDeleteButton));
    if (typeof(oSettings.sub) !== 'undefined') {
        var sInnerHtml = '';
        for (var i = 0; i < oSettings.sub.length; i++) {
            sInnerHtml += nsFilterHtml.fLoadFilterFromObject(oSettings.sub[i], true);
        }

        sInnerHtml = nsFilterHtml.fWrapSubFilterGroup(sInnerHtml);
        sHtml += sInnerHtml;
    }
    return sHtml;
};

nsFilterHtml.fAddSubRow = function(thisRow, sType) {
    if (typeof sType === 'undefined')
        sType = 'class_made_hand';
    var thisCol = thisRow.children().first();
    //var iThisIndent = nsFilter.fGetIndent(thisCol);
    var sHtml = nsFilterHtml.fSubFilterButtonGroup(sType, true);
    var sHtmlRow = nsFilterHtml.fWrapSubFilterButtonGroup(sHtml, 0);
    if (thisRow.next().is('.filter_group_subgroup')) {
        thisRow.next().append(sHtmlRow);
    } //wrapper for subfilters already there
    else { //need new subfilter container
        var sHtmlWrappedRow = nsFilterHtml.fWrapSubFilterGroup(sHtmlRow);
        thisRow.after(sHtmlWrappedRow);
    }
};

nsFilterHtml.fTypeStringToClass = function(sPrefix, sType) {
    return sPrefix + sType.replace(/\s+/g, '_').toLowerCase();
};

nsFilterHtml.fSubFilterButtonGroup = function(oValues, bRemoveButton) {
    var sType = nsUtil.fType(oValues);
    if (sType === "string")
        sSelected = oValues;
    else {
        if (typeof oValues === 'undefined' || typeof oValues.sub_filter_type === 'undefined')
            sSelected = 'class_group';
        else
            sSelected = oValues.sub_filter_type;
    }

    if (typeof oValues === 'undefined')
        oValues = {};

    sHtml = '';
    //generate a class for this type
    var sClass = nsFilterHtml.fTypeStringToClass('filter_btns_', sSelected);
    sHtml += '<div class="btn-group ' + sClass + '  filter_ctrl_btn_group">';

    if (typeof bRemoveButton === 'undefined')
        bRemoveButton = false;

    switch (sSelected) {
        case 'class_group':
            sHtml += nsFilterHtml.fGroupTypeFilterButtonGroup(oValues);
            break;
        case 'class_made_hand':
            sHtml += nsFilterHtml.fMadeHandTypeFilterButtonGroup(oValues);
            break;
        case 'class_drawing_hand':
            sHtml += nsFilterHtml.fDrawingHandTypeFilterButtonGroup(oValues);
            break;
        case 'class_filter':
            sHtml += nsFilterHtml.fFilterTypeFilterButtonGroup(oValues);
            break;
        default:
    }

    if (bRemoveButton)
        sHtml += nsFilterHtml.fRemoveFilterButton();

    sHtml += '</div>'; // end btn-group
    return sHtml;
};

nsFilterHtml.fGroupTypeFilterButtonGroup = function(oValues) {
    var sHtml = '';
    sHtml += nsFilterHtml.fSubFilterTypeButtons('class_group');
    sHtml += nsFilterHtml.fLogicalOpButtons(oValues.group_log_op);
    sHtml += nsFilterHtml.fNewSubFilterButton();
    return sHtml;
};

nsFilterHtml.fMadeHandTypeFilterButtonGroup = function(oValues) {
    var sHtml = '';
    sHtml += nsFilterHtml.fSubFilterTypeButtons('class_made_hand');
    sHtml += nsFilterHtml.fAtLeastFilterTypeButtons(oValues.comparator_op);
    sHtml += nsFilterHtml.fMadeHandFilterTypeButtons(oValues.made_hand_op);
    return sHtml;
};

nsFilterHtml.fDrawingHandTypeFilterButtonGroup = function(oValues) {
    var sHtml = '';
    sHtml += nsFilterHtml.fSubFilterTypeButtons('class_drawing_hand');
    sHtml += nsFilterHtml.fAtLeastFilterTypeButtons(oValues.comparator_op);
    sHtml += nsFilterHtml.fDrawingHandFilterTypeButtons(oValues.drawing_hand_op);
    return sHtml;
};

nsFilterHtml.fFilterTypeFilterButtonGroup = function(oValues) {
    var sHtml = '';
    sHtml += nsFilterHtml.fSubFilterTypeButtons('class_filter');
    sHtml += nsFilterHtml.fSubFilterSelectionButtons(oValues.sub_filter_op);
    return sHtml;
};

nsFilterHtml.fSubFilterTypeButtons = function(sSelected) {
    if (typeof sSelected === 'undefined')
        sSelected = 'class_group';

    var asClass = [];
    asClass[0] = 'class_group';
    asClass[1] = 'class_filter';
    asClass[2] = 'class_made_hand';
    asClass[3] = 'class_drawing_hand';

    var asDisplay = [];
    asDisplay[0] = 'Group';
    asDisplay[1] = 'Filter';
    asDisplay[2] = 'Made Hand';
    asDisplay[3] = 'Drawing Hand';

    var selectedIndex = 0,
        i;
    if (typeof sSelected !== 'undefined') {
        for (i = 0; i < asClass.length; i++) {
            if (sSelected === asClass[i]) {
                selectedIndex = i;
                break;
            }
        }
    }

    var sHtml = '';
    sHtml += '<button type="button" class="btn btn-primary ' + sSelected.toLowerCase() + '">'; //group type			
    //sHtml += '<strong>'; we'll do this by css to keep our code simple
    sHtml += asDisplay[selectedIndex];
    //sHtml += '</strong>';
    sHtml += '</button>';
    sHtml += '<div class="btn-group">'; //button group
    sHtml += '<button type="button" class="btn dropdown-toggle btn-primary" data-toggle="dropdown">';
    sHtml += '<span class="caret"></span>';
    sHtml += '</button>';
    sHtml += '<ul selection-type="sub_filter_type" class="dropdown-menu sub_filter_type">';
    for (i = 0; i < asClass.length; i++) {
        var sClass = "";
        if (sSelected === asClass[i])
            sClass = "selected active";

        sHtml += '<li class="' + sClass + '"><a href="#" class="' + asClass[i] + '">' + asDisplay[i] + '</a></li>';

    }
    sHtml += '</ul>';
    sHtml += '</div>'; //end button group
    return sHtml;
};

nsFilterHtml.fLogicalOpButtons = function(sSelected) {

    var asClass = [];
    asClass[0] = 'log_op_or';
    asClass[1] = 'log_op_and';

    var asDisplay = [];
    asDisplay[0] = 'OR';
    asDisplay[1] = 'AND';

    var selectedIndex = 0,
        i;
    if (typeof sSelected !== 'undefined') {
        for (i = 0; i < asClass.length; i++) {
            if (sSelected === asClass[i]) {
                selectedIndex = i;
                break;
            }
        }
    }

    var sHtml = '';
    sHtml += '<button type="button" class="btn btn-default log_op_or">';
    sHtml += asDisplay[selectedIndex];
    sHtml += '</button>';
    sHtml += '<div class="btn-group">';
    sHtml += '<button type="button" class="btn dropdown-toggle btn-default" data-toggle="dropdown">';
    sHtml += '<span class="caret"></span>';
    sHtml += '</button>';
    sHtml += '<ul selection-type="group_log_op"  class="group_log_op dropdown-menu">'; //drop down AND/OR
    for (i = 0; i < asClass.length; i++) {
        var sClass = "";
        if (i === selectedIndex)
            sClass = "selected active";
        sHtml += '<li class="' + sClass + '"><a href="#" class="' + asClass[i] + '"  >' + asDisplay[i] + '</a></li>';
    }
    sHtml += '</ul>';
    sHtml += '</div>';
    return sHtml;
};

nsFilterHtml.fAtLeastFilterTypeButtons = function(sSelected) {

    var asClass = [];
    asClass[0] = 'at_least';
    asClass[1] = 'at_most';

    var asDisplay = [];
    asDisplay[0] = 'At Least';
    asDisplay[1] = 'At Most';

    var selectedIndex = 0;
    if (typeof sSelected !== 'undefined') {
        for (var i = 0; i < asClass.length; i++) {
            if (sSelected === asClass[i]) {
                selectedIndex = i;
                break;
            }
        }
    }


    var sHtml = '';
    sHtml += '<button type="button" class="btn btn-default at_least">';
    sHtml += asDisplay[selectedIndex];
    sHtml += '</button>';
    sHtml += '<div class="btn-group">';
    sHtml += '<button type="button" class="btn dropdown-toggle btn-default" data-toggle="dropdown">';
    sHtml += '<span class="caret"></span>';
    sHtml += '</button>';
    sHtml += '<ul selection-type="comparator_op" class="comparator_op dropdown-menu">'; //drop down AND/OR
    for (var i = 0; i < asClass.length; i++) {
        var sClass = "";
        if (i === selectedIndex)
            sClass = "selected active";
        sHtml += '<li class="' + sClass + '"><a href="#" class="' + asClass[i] + '"  >' + asDisplay[i] + '</a></li>';
    }
    sHtml += '</ul>';
    sHtml += '</div>';
    return sHtml;
};

nsFilterHtml.fMadeHandFilterTypeButtons = function(sSelected) {

    /*oHand.HIGH_CARD = 0;
    oHand.PAIR = 1;
    oHand.TWO_PAIR = 2;
    oHand.THREE_OF_A_KIND = 3;
    oHand.STRAIGHT = 4;
    oHand.FLUSH = 5;
    oHand.FULL_HOUSE = 6;
    oHand.FOUR_OF_A_KIND = 7;
    oHand.STRAIGHT_FLUSH = 8;*/
    var asRank = [];
    var asClass = [];
    for (var iHandType = 0; iHandType < 9; iHandType++) {
        var oHand = {};
        oHand.rank = iHandType;
        var rankString = nsHand.fHandToString(oHand);
        asRank.push(rankString);
        asClass.push('made_hand_' + iHandType);
        //need ot store the int here somewhere
    }

    var selectedIndex = 0;
    if (typeof sSelected !== 'undefined') {
        for (var i = 0; i < asClass.length; i++) {
            if (sSelected === asClass[i]) {
                selectedIndex = i;
                break;
            }
        }
    }

    var sHtml = '';
    sHtml += '<button type="button" class="btn btn-default">';
    sHtml += asRank[selectedIndex];
    sHtml += '</button>';
    sHtml += '<div class="btn-group">';
    sHtml += '<button type="button" class="btn dropdown-toggle btn-default" data-toggle="dropdown">';
    sHtml += '<span class="caret"></span>';
    sHtml += '</button>';
    sHtml += '<ul selection-type="made_hand_op" class="made_hand_op dropdown-menu">'; //drop down AND/OR
    for (var i = 0; i < asRank.length; i++) {
        var sClass = "";
        if (i === selectedIndex)
            sClass = "selected active";
        sHtml += '<li class="' + sClass + '"><a href="#" class="' + asClass[i] + '" >' + asRank[i] + '</a></li>'; //need ot store the int here somewhere
    }

    sHtml += '</ul>';
    sHtml += '</div>';
    return sHtml;
};

nsFilterHtml.fGetCurrentFilterNameIntern = function() {
    var valDisplay = $('#sel_filter input').val();
    return valDisplay.split(' ').join('_').toLowerCase();
};

nsFilterHtml.fSubFilterSelectionButtons = function(sSelected) {

    var aValidSelections = [];
    var aValidSelectionStrings = [];
    var asClass = [];
    $('#filter_config_menu .filter').each(function() {

        var id = $(this).attr('id');
        var currentId = $('#sel_filter').val();
        var aTag = $(this).find('a').clone();;
        aTag.find('span').remove();
        var currentHtml = aTag.html();
        if (currentId !== id) {
            aValidSelections.push(id);
            aValidSelectionStrings.push(currentHtml);
            asClass.push(nsFilterHtml.fTypeStringToClass('', currentHtml));
        }
    });

    var selectedIndex = 0;
    if (typeof sSelected !== 'undefined') {
        for (var i = 0; i < asClass.length; i++) {
            if (sSelected === asClass[i]) {
                selectedIndex = i;
                break;
            }
        }
    }
    var currentNameSearch = nsFilterHtml.fGetCurrentFilterNameIntern();
    var sHtml = '';
    sHtml += '<button type="button" class="btn btn-default">';
    sHtml += aValidSelectionStrings[selectedIndex];
    sHtml += '</button>';
    sHtml += '<div class="btn-group">';
    sHtml += '<button type="button" class="btn dropdown-toggle btn-default" data-toggle="dropdown">';
    sHtml += '<span class="caret"></span>';
    sHtml += '</button>';
    sHtml += '<ul selection-type="sub_filter_op" class="dropdown-menu">'; //drop down AND/OR

    for (var i = 0; i < aValidSelections.length; i++) {

        if (currentNameSearch === asClass[i])
            continue; //filter cannot contain itself

        var sClass = "";
        if (i === selectedIndex)
            sClass = "selected active";
        sHtml += '<li class="' + sClass + '"><a href="#" class="' + asClass[i] + '">' + aValidSelectionStrings[i] + '</a></li>'; //need ot store the int here somewhere
    }
    sHtml += '</ul>';
    sHtml += '</div>';
    return sHtml;
};

nsFilterHtml.fDrawingHandFilterTypeButtons = function(sSelected) {

    /*
    nsDrawingHand.BACKDOOR_STRAIGHT_DRAW=0;
    nsDrawingHand.GUTSHOT_STRAIGHT_DRAW=1;
    nsDrawingHand.BACKDOOR_FLUSH_DRAW=2;
    nsDrawingHand.OPEN_ENDED_STRAIGHT_DRAW=3;
    nsDrawingHand.FLUSH_DRAW=4;*/
    var asRank = [];
    var asClass = [];
    for (var iHandType = 0; iHandType < 5; iHandType++) {
        var oHand = {};
        oHand.rank = iHandType;
        var rankString = nsDrawingHand.fDrawingHandToShortString(oHand);
        asRank.push(rankString);

        asClass.push('drawing_hand_' + iHandType);
        //need ot store the int here somewhere
    }
    var selectedIndex = 0;
    if (typeof sSelected !== 'undefined') {
        for (var i = 0; i < asClass.length; i++) {
            if (sSelected === asClass[i]) {
                selectedIndex = i;
                break;
            }
        }
    }

    var sHtml = '';
    sHtml += '<button type="button" class="btn btn-default">';
    sHtml += asRank[selectedIndex];
    sHtml += '</button>';
    sHtml += '<div class="btn-group">';
    sHtml += '<button type="button" class="btn dropdown-toggle btn-default" data-toggle="dropdown">';
    sHtml += '<span class="caret"></span>';
    sHtml += '</button>';
    sHtml += '<ul selection-type="drawing_hand_op" class="drawing_hand_op dropdown-menu">'; //drop down AND/OR

    for (var i = 0; i < asRank.length; i++) {
        var sClass = "";
        if (i === selectedIndex)
            sClass = "selected active";
        sHtml += '<li class="' + sClass + '"><a href="#" class="' + asClass[i] + '"  >' + asRank[i] + '</a></li>'; //need ot store the int here somewhere
    }
    sHtml += '</ul>';
    sHtml += '</div>';
    return sHtml;
};

nsFilterHtml.fNewSubFilterButton = function() {
    var sHtml = '';
    sHtml += '<button title="New Subfilter" class="new_subfilter btn-success btn" type="button">';
    sHtml += '<span class="glyphicon glyphicon-plus-sign"></span>';
    sHtml += '</button>';
    return sHtml;
};

nsFilterHtml.fRemoveFilterButton = function() {
    var sHtml = '';
    sHtml += '<button title="Delete subfilter" class="delete_subfilter btn-warning btn" type="button">';
    sHtml += '<span class="glyphicon glyphicon-minus-sign"></span>';
    sHtml += '</button>';
    return sHtml;
};

module.exports = nsFilterHtml;
},{"../Core/Util":16,"./Filter":18}],20:[function(require,module,exports){
var nsHand = require('./NSHand');
var oHand = require('./Hand');
var nsDrawingHand = {};

/*drawing hands*/
nsDrawingHand.bIgnoreBackdoorDraws = true;

//TODO put these in constants folder
nsDrawingHand.BACKDOOR_STRAIGHT_DRAW = 0;
nsDrawingHand.BACKDOOR_FLUSH_DRAW = 1;
nsDrawingHand.GUTSHOT_STRAIGHT_DRAW = 2;
nsDrawingHand.OPEN_ENDED_STRAIGHT_DRAW = 3;
nsDrawingHand.FLUSH_DRAW = 4;

nsDrawingHand.fDrawingHandToShortString = function(oDrawingHand) {
    var sLong = nsDrawingHand.fDrawingHandToString(oDrawingHand);
    var iDraw = sLong.indexOf('Draw');
    return sLong.substring(0, iDraw - 1);
}

nsDrawingHand.fDrawingHandToString = function(oDrawingHand) {
    var rankString = "";
    switch (oDrawingHand.rank) {
        case nsDrawingHand.BACKDOOR_STRAIGHT_DRAW:
            rankString = "Backdoor Straight Draw";
            break;
        case nsDrawingHand.BACKDOOR_FLUSH_DRAW:
            rankString = "Backdoor Flush Draw";
            break;
        case nsDrawingHand.GUTSHOT_STRAIGHT_DRAW:
            rankString = "Gutshot Straight Draw";
            break;
        case nsDrawingHand.OPEN_ENDED_STRAIGHT_DRAW:
            rankString = "Open Ended Straight Draw";
            break;
        case nsDrawingHand.FLUSH_DRAW:
            rankString = "Flush Draw";
            break;
        default:
            rankString = "ERROR UNKNOWN!!!";
    }

    return rankString;
};

nsDrawingHand.fHandToString = function(oDrawingHand) {
    var returnString = nsHand.fHandToString(oDrawingHand);

    for (i = 0; i < oDrawingHand.drawingHands.length; i++) {
        returnString = returnString + ' - ' + nsDrawingHand.fDrawingHandToString(oDrawingHand.drawingHands[i]);
    }
    return returnString;
};

nsDrawingHand.fGetDrawingHands = function(aCards) {
    aCards.sort(nsHand.fCompareCard);
    var bestMadeHand = nsHand.fGetBestHand(aCards);

    bestMadeHand.drawingHands = []; //should be in a constructor to oHand.
    //if we have a made hand as big as a straight or are dealing with all the cards, no drawing hands (maybe implement
    //straight to flush drawing in the future
    if (bestMadeHand.rank > oHand.THREE_OF_A_KIND || aCards.length > 6 || aCards.length < 5)
        return bestMadeHand;

    var fd = nsDrawingHand.fFindBestFlushDraw(aCards);
    //nsHand.fGet
    var sd = nsDrawingHand.fFindBestStraightDraw(aCards);

    if (fd !== null)
        bestMadeHand.drawingHands.push(fd);

    if (sd !== null)
        bestMadeHand.drawingHands.push(sd);

    return bestMadeHand;
};

//compare drawing hands, to be used as sort function
nsDrawingHand.fCompareHand = function(handA, handB) {
    if (handA.rank !== handB.rank)
        return handB.rank - handA.rank;
    //same rank
    if (handA.high !== handB.high)
        return handB.high - handA.high;

    if (handA.low !== handB.low)
        return handB.low - handA.low;

    return 0; //all the same;
};

nsDrawingHand.fFindBestFlushDraw = function(aCards) {
    var flushDraws = [];
    for (var suit = 1; suit <= 4; suit++) {
        var aCardsOfSuit = [];
        for (var i = 0; i < aCards.length; i++) {
            if (aCards[i].suit === suit)
                aCardsOfSuit.push(aCards[i]);
        }
        var minLength = aCards.length === 5 ? 3 : 4; //on the turn we don't want to count having 3 of a color
        if (aCardsOfSuit.length > 2) { //found one
            flushDraws.push(aCardsOfSuit);
            break;
        }
    }

    if (flushDraws.length > 0) {

        var returnHands = [];

        for (i = 0; i < flushDraws.length; i++) {
            if (aCards.length === 5) { //flop
                if (flushDraws[i].length === 4) {
                    returnHands.push({
                        rank: nsDrawingHand.FLUSH_DRAW,
                        high: flushDraws[i][0].rank,
                        low: flushDraws[i][flushDraws[i].length - 1].rank
                    });
                    continue;
                }
                if (flushDraws[i].length === 3) {
                    if (!nsDrawingHand.bIgnoreBackdoorDraws)
                        returnHands.push({
                            rank: nsDrawingHand.BACKDOOR_FLUSH_DRAW,
                            high: flushDraws[i][0].rank,
                            low: flushDraws[i][flushDraws[i].length - 1].rank
                        });
                    continue;
                }

            } else { //turn
                if (flushDraws[i].length === 4) {

                    returnHands.push({
                        rank: nsDrawingHand.FLUSH_DRAW,
                        high: flushDraws[i][0].rank,
                        low: flushDraws[i][flushDraws[i].length - 1].rank
                    });
                    continue;
                }
            }
        }

        returnHands.sort(nsDrawingHand.fCompareHand);
        if (returnHands.length > 0)
            return returnHands[0];
    }
    return null;
};


nsDrawingHand.fFindBestStraightDraw = function(aCards) {
    var iFirst;
    var aFoundDrawingStraights = [];
    for (iLowRank = 10; iLowRank >= 1; iLowRank--) {
        var aStraightRecord = []; //can contain duplicates // forget aces low
        for (memberInStraight = 0; memberInStraight < 5; memberInStraight++) {
            var findRank = iLowRank + memberInStraight;
            //special case for Aces low								
            if (iLowRank === 1) {
                if (memberInStraight === 0)
                    findRank = 14;
            }

            var aMembersOfRank = nsHand.fFindAllCardsWithRank(aCards, findRank);
            if (aMembersOfRank.length > 0)
                aStraightRecord[memberInStraight] = aMembersOfRank;
            else
                aStraightRecord[memberInStraight] = null;
        }

        aFoundDrawingStraights.push(aStraightRecord);
    }

    //now evaluate the straight draws

    var aFoundDraws = [];
    for (var i = 0; i < aFoundDrawingStraights.length; i++) {

        var aFoundDS = aFoundDrawingStraights[i];
        //find non null, high, and low
        var iHigh = -1;
        var iLow = -1;
        var numberNonNull = 0;
        var iFirstNonNull = -1;
        var aGaps = [];
        for (j = 0; j < aFoundDS.length; j++) {
            var cardsOfRank = aFoundDS[j];
            if (cardsOfRank !== null) {
                numberNonNull++;
                if (iLow === -1)
                    iLow = cardsOfRank[0].rank;

                iHigh = cardsOfRank[0].rank; //set it every time, and we will hit the last one, since they are currently in order from low to high
            } else
                aGaps.push(j);
        }
        var rank = -1;
        if (numberNonNull === 4) {

            if (aCards.length === 6) //on the turn always a backdoor straight draw ... we might distinguish between 2 sets of outs and 1 set of outs
                rank = nsDrawingHand.GUTSHOT_STRAIGHT_DRAW;
            else //check whether gushot or open ended
            {
                if (iHigh === 14 || iLow === 14) //aces high or low
                    rank = nsDrawingHand.GUTSHOT_STRAIGHT_DRAW;
                else {
                    if (aGaps[0] === 0 || aGaps[0] === 4) //gap comes at beginning or end
                        rank = nsDrawingHand.OPEN_ENDED_STRAIGHT_DRAW;
                    else
                        rank = nsDrawingHand.GUTSHOT_STRAIGHT_DRAW;
                }
            }
        } else if (numberNonNull === 3 && aCards.length === 5) { //backdoor straight draw with 3 cards only on flop

            if (!nsDrawingHand.bIgnoreBackdoorDraws)
                rank = nsDrawingHand.BACKDOOR_STRAIGHT_DRAW;

        }
        if (rank === -1)
            continue;

        aFoundDraws.push({
            rank: rank,
            high: iHigh,
            low: iLow
        });
    }


    aFoundDraws.sort(nsDrawingHand.fCompareHand);
    if (aFoundDraws.length > 0)
        return aFoundDraws[0];
    return null;
};

module.exports = nsDrawingHand;

},{"./Hand":21,"./NSHand":22}],21:[function(require,module,exports){


var oHand = {};

oHand = {
    rank: 0,
    high: -1,
    /*for all hands high card in the made portion of the hand*/
    low: -1,
    /*for two pair and fh, the low card in the made portion*/
    kickers: [],
    /*up to five cards for high-card hands*/
    subtype: -1,
    /*types such as over pair*/
    drawinghands: []
};

oHand.HIGH_CARD = 0;
oHand.PAIR = 1;
oHand.TWO_PAIR = 2;
oHand.THREE_OF_A_KIND = 3;
oHand.STRAIGHT = 4;
oHand.FLUSH = 5;
oHand.FULL_HOUSE = 6;
oHand.FOUR_OF_A_KIND = 7;
oHand.STRAIGHT_FLUSH = 8;

/*subtypes*/
oHand.TOP_Pair = 0;

module.exports = oHand;


},{}],22:[function(require,module,exports){

var oHand = require('./Hand');
var nsHand = {}; 

//nsHand.oHandStringCache = {};
nsHand.fHandToString = function(hand) {
    //actually made stuff slower var cache = nsHand.oHandStringCache[hand];
    //if (typeof cache !== 'undefined')
    //	return cache;

    var rankString = "";
    switch (hand.rank) {
        case oHand.HIGH_CARD:
            rankString = "High Card";
            break;
        case oHand.PAIR:
            rankString = "Pair";
            /*if (hand.subtype === oHand.TOP_Pair)
				rankString = "Top Pair";*/
            break;
        case oHand.TWO_PAIR:
            rankString = "Two Pair";
            break;
        case oHand.THREE_OF_A_KIND:
            rankString = "Three Of A Kind";
            break;
        case oHand.STRAIGHT:
            rankString = "Straight";
            break;
        case oHand.FLUSH:
            rankString = "Flush";
            break;
        case oHand.FULL_HOUSE:
            rankString = "Full House";
            break;
        case oHand.FOUR_OF_A_KIND:
            rankString = "Four Of A Kind";
            break;
        case oHand.STRAIGHT_FLUSH:
            rankString = "Straight Flush";
            break;
        default:
            rankString = "ERROR UNKNOWN!!!";
    }

    //nsHand.oHandStringCache[rankString] = rankString;	
    return rankString; //+ ' high: ' + hand.high;
};

/*gets the hand by order of ranking*/
nsHand.fGetBestHand = function(aCards) {
    var oNsHand = nsHand;
    if (aCards.length === 1) {
        return {
            rank: oHand.HIGH_CARD,
            high: aCards[0].rank,
            low: -1,
            kickers: []
        };
    }

    aCards.sort(nsHand.fCompareCard); //sort the cards for evaluating set types 

    var oBestStraight = oNsHand.fFindBestStraight(aCards); //get's straight flush or the best straight or null, if sf then stop here... if we find a straight, there can be no 4 of a kind or fullhouse, so we can skip
    if (oBestStraight !== null && oBestStraight.rank === oHand.STRAIGHT_FLUSH)
        return oBestStraight;

    var oBestSetHand = oNsHand.fFindBestSet(aCards); //always returns a hand even if not a made hand
    if (oBestSetHand.rank >= oHand.FULL_HOUSE)
        return oBestSetHand;

    var oBestFlushHand = oNsHand.fFindBestFlush(aCards);
    if (oBestFlushHand !== null)
        return oBestFlushHand;

    if (oBestStraight !== null)
        return oBestStraight;

    //return the best set which may just be high cards
    return oBestSetHand;
};

nsHand.fBigIntFirst = function(a, b) {
    return b - a;
};
//compare hands, to be used as sort function
nsHand.fCompareHand = function(handA, handB) {
    if (handA.rank !== handB.rank)
        return handB.rank - handA.rank;
    //same rank
    if (handA.high !== handB.high)
        return handB.high - handA.high;

    if (handA.low !== handB.low)
        return handB.low - handA.low;

    //compare kickers	
    if (typeof(handA.kickers) === "undefined" || handA.kickers.length === 0) //no kickers so the hands are equivalent
        return 0;

    handA.kickers.sort(nsHand.fBigIntFirst);
    handB.kickers.sort(nsHand.fBigIntFirst);

    for (var i = 0; i < handA.kickers.length; i++) {
        if (handB.kickers[i] !== handA.kickers[i])
            return handB.kickers[i] - handA.kickers[i];
    }

    return 0; //all the same;
};

nsHand.fFindBestFlush = function(aCards) {
    var flushes = [],
        i;
    for (var suit = 1; suit <= 4; suit++) {
        var aCardsOfSuit = [];
        for (i = 0; i < aCards.length; i++) {
            if (aCards[i].suit === suit)
                aCardsOfSuit.push(aCards[i]);

            if (aCardsOfSuit.length === 5) { //found one
                flushes.push(aCardsOfSuit); 
                break;
            }
        }
    }

    if (flushes.length > 0) {
        flushes.sort(nsHand.fCompareFlushes);
        var returnHand = {};
        returnHand.rank = oHand.FLUSH;
        returnHand.high = flushes[0][4].rank;
        returnHand.low = returnHand.high;
        returnHand.kickers = [];
        for (i = 0; i < 5; i++)
            returnHand.kickers.push(flushes[0][i].rank); //little hack...for comparing flushes we can treat the hand as kickers
        return returnHand;
    }
    return null;
};

nsHand.fCompareFlushes = function(flushA, flushB) {
    for (i = 0; i < 5; i++) {
        if (flushA[i].rank !== flushB[i].rank)
            return flushB[i].rank - flushA[i].rank;
    }
};

nsHand.fFindBestStraight = function(aCards) {
    var iFirst;
    var aFoundStraights = [];
    for (iLowRank = 10; iLowRank >= 1; iLowRank--) {
        var aStraightRecord = []; //can contain duplicates // forget aces low
        for (memberInStraight = 0; memberInStraight < 5; memberInStraight++) {
            var findRank = iLowRank + memberInStraight; //special case for Aces low

            if (iLowRank === 1) {
                if (memberInStraight === 0)
                    findRank = 14;
            }
            //nsUtil.fLog("lowrank " + iLowRank + " memberinstraight " + memberInStraight + " findrank " +findRank)
            //aces low lowRank = 1, member =0, findRank = 14
            //next round lowRank = 2 member =1, findRank =3 ??

            var aMembersOfRank = nsHand.fFindAllCardsWithRank(aCards, findRank);

            if (aStraightRecord.length === 0 && aMembersOfRank.length > 0)
                aStraightRecord[memberInStraight] = aMembersOfRank;
            else if (aStraightRecord.length > 0 && aMembersOfRank.length > 0 && (
                    aStraightRecord[aStraightRecord.length - 1][0].rank === findRank - 1 ||
                    (aStraightRecord[aStraightRecord.length - 1][0].rank === 14 && findRank === 2)
                ) //low aces
            )
                aStraightRecord[memberInStraight] = aMembersOfRank;
            else
                break; //go on to next rank, no straight found

        }
        if (aStraightRecord.length === 5)
            aFoundStraights.push(aStraightRecord);
    }


    //convert ordered arrays of cards to straight hands
    var aFoundHands = [];
    for (var i = 0; i < aFoundStraights.length; i++) {
        var oStraight = nsHand.fStraightFromAmbig(aFoundStraights[i]);
        aFoundHands.push(oStraight);
    }

    aFoundHands.sort(nsHand.fCompareHand);
    if (aFoundHands.length > 0)
        return aFoundHands[0];
    return null;
};

nsHand.fStraightFromAmbig = function(aCardListArray) {
    if (aCardListArray.length === 0)
        return;

    var aFoundSuits = [];
    var aFirstCards = aCardListArray[0];
    var countOfFlushSuits, i, j, k, l;
    /*load suit of first cards*/
    for (j = 0; j < aFirstCards.length; j++) {
        var suit = aFirstCards[j].suit;
        var bSuitAlreadyThere = false;
        for (k = 0; k < aFoundSuits.length; k++) {
            if (suit === aFoundSuits[k])
                bSuitAlreadyThere = true;
        }
        if (!bSuitAlreadyThere)
            aFoundSuits.push(suit);
    }

    for (i = 1; i < aCardListArray.length; i++) {
        var aCardsOfRank = aCardListArray[i];
        var aToRemove = [];
        for (j = 0; j < aFoundSuits.length; j++) {

            var searchForSuit = aFoundSuits[j];
            var bFound = false;
            for (k = 0; k < aCardsOfRank.length; k++) {
                if (aCardsOfRank[k].suit === searchForSuit)
                    bFound = true;
            }
            if (!bFound)
                aToRemove.push(aFoundSuits[j]);
        }

        for (k = 0; k < aToRemove.length; k++) {
            for (l = 0; l < aFoundSuits.length; l++) {
                if (aToRemove[k] === aFoundSuits[l])
                    aFoundSuits.splice(l, 1);
            }
        }
    }
    countOfFlushSuits = aFoundSuits.length;
    var oReturnHand = {};
    if (countOfFlushSuits > 0)
        oReturnHand.rank = oHand.STRAIGHT_FLUSH;
    else
        oReturnHand.rank = oHand.STRAIGHT;

    oReturnHand.low = aCardListArray[0][0].rank;
    if (oReturnHand.low === 14)
        oReturnHand.low = 1;
    oReturnHand.high = oReturnHand.low + 5;
    return oReturnHand;
};

nsHand.fFindAllCardsWithRank = function(aCards, rank) {
    var returnCards = [];

    for (i = 0; i < aCards.length; i++) {
        if (aCards[i].rank === rank) {
            returnCards.push(aCards[i]);
        }
    }
    return returnCards;
};

nsHand.fFindBestSet = function(aCards) {
    var aSets = [],
        oReturnHand, i;
    for (i = 14; i >= 2; i--) {
        var timesFound = 0;
        var foundRank = [];
        var notFoundRank = [];
        for (j = 0; j < aCards.length; j++) {
            if (aCards[j].rank === i) {
                timesFound++;
                foundRank.push(i);
            } else {
                notFoundRank.push(aCards[j].rank);
            }
        }
        if (timesFound >= 2)
            aSets.push({
                same: foundRank,
                kickers: notFoundRank
            });
    }

    //now aSets contains an array of , for example [2,2],[3,3,3],[A,A,A,A] (14) 
    aSets.sort(nsHand.fCompareSimpleSet);

    //got at least one "set"
    if (aSets.length > 0) {
        //sort the kickers
        for (i = 0; i < aSets.length; i++)
            aSets[i].kickers.sort(nsHand.fBigIntFirst);

        var bestOfAll = aSets[0];
        if (bestOfAll.same.length === 4) { //4 of a kind
            //return best 4 hand
            oReturnHand = {};
            oReturnHand.rank = oHand.FOUR_OF_A_KIND;
            oReturnHand.low = bestOfAll.same[0];
            oReturnHand.high = oReturnHand.low;

            oReturnHand.kickers = bestOfAll.kickers.slice(0, 1);
            return oReturnHand;
        }

        //found at least 3
        if (bestOfAll.same.length === 3) {
            //full house or 3 of a kind
            if (aSets.length > 1) {
                oReturnHand = {};
                oReturnHand.rank = oHand.FULL_HOUSE;
                oReturnHand.high = bestOfAll.same[0];
                oReturnHand.low = aSets[1].same[0];
                oReturnHand.kickers = []; // no kickers with FH
                return oReturnHand;
                //return full house with aSets[0] and aSets[1]
            } else // set of 3
            {
                oReturnHand = {};
                oReturnHand.rank = oHand.THREE_OF_A_KIND;
                oReturnHand.high = bestOfAll.same[0];
                oReturnHand.low = oReturnHand.high;

                oReturnHand.kickers = bestOfAll.kickers.slice(0, 2);
                return oReturnHand;
            }
        }

        //found at least a pair
        if (bestOfAll.same.length === 2) {
            if (aSets.length > 1) {
                oReturnHand = {};
                oReturnHand.rank = oHand.TWO_PAIR;
                oReturnHand.high = bestOfAll.same[0];
                oReturnHand.low = aSets[1].same[0];
                for (i = 0; i < bestOfAll.kickers.length; i++) {
                    if (bestOfAll.kickers[i] !== aSets[1].same[0]) {
                        oReturnHand.kickers = [bestOfAll.kickers[i]]; //this is an array of one elment though it looks funny one kicker for two pair
                        break;
                    }
                }
                return oReturnHand;
                //return two pair with aSets[0] and aSets[1]
            } else { //return one pair
                oReturnHand = {};
                oReturnHand.rank = oHand.PAIR;
                oReturnHand.high = bestOfAll.same[0];
                oReturnHand.low = oReturnHand.high;

                if (oReturnHand.high === aCards[0].rank)
                    oReturnHand.subtype = oHand.TOP_Pair;

                oReturnHand.kickers = bestOfAll.kickers.slice(0, 3);
                return oReturnHand;
            }
        }
    }

    //no sets found return high card
    aCards.sort(nsHand.fCompareCard);
    var kickers = [];
    for (i = 0; i < aCards.length; i++)
        kickers.push(aCards[i].rank); // = aCards.slice(0,5);

    oReturnHand = {};
    oReturnHand.rank = oHand.HIGH_CARD;
    oReturnHand.high = -1;
    oReturnHand.low = -1;
    oReturnHand.kickers = kickers;

    return oReturnHand;

};

nsHand.fCompareCard = function(aCard, bCard) {
    return bCard.rank - aCard.rank;
};

nsHand.fCompareSimpleSet = function(aSet, bSet) {
    if (aSet.same.length !== bSet.same.length) // four of a kind are always better than three 
        return bSet.same.length - aSet.same.length;

    return bSet.same[0] - aSet.same[0];
};

nsHand.fFindHighCards = function(aCards) {
    var highRank = [],
        cardsLength = aCards.length;
    for (i = 0; i < cardsLength; i++)
        highRank[i] = -1;
    for (i = 0; i < cardsLength; i++) {
        var foundIndex = -1,
            newCardsLength = aCards.length;
        for (j = 0; i < newCardsLength; j++) {
            var card = aCards[j];
            if (card.rank >= highRank)
                highRank[i] = card.rank;
            foundIndex = j;
        }
        aCards.splice(foundIndex, 1);
    }
    return highRank;
};

module.exports = nsHand;

},{"./Hand":21}],23:[function(require,module,exports){
var AWModel = require('../Core/AWModel');
var nsHtml = require('../Core/Html');
var CardList = require('../Card/CardList');
var Deck = require('../Card/Deck');
var nsUI = require('../Core/Ui');
var nsUtil = require('../Core/Util');
var nsRange = require('../Range/RangeLibrary');

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
        var that = this;
        //was nsUI.fAfterBoardChnage
        this.on('finalize', function() {
            nsHtml.fRedrawBoardSelectionTable(that);
            this.evaluateKnownCards();
            this.saveBoardState();
            window.flopYoMama.updateRoute();
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

    }, 
    evaluateKnownCards: function() {
        var aCards = this.allKnown(true);

        var bBoardState = this.getBoardState();

        if (bBoardState.bFlop) {
            nsRange.fGetTextures(this);
        } else {
              //todo this should be in the range view
            $('#textures').html(''); //delete the range textures
        }

        if (bBoardState.bFlop && bBoardState.bHand && nsPrefs.oAutomaticSearch.fGet()) {

             nsRange.fGetAllUnknownCombinationsThreaded(this);
        } else {
               nsUI.fDeleteLongStatistics();
        }

    }, 
    loadFromRouter: function() {
        throw 'not yet implemented';
        //initialize from router
        if (routerValues.hand || routerValues.board) {
            this.set('hand', new CardList(routerValues.hand));
            this.set('board', new CardList(routerValues.board));
        }
    },
    loadFromLocalSotrage: function() {
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

},{"../Card/CardList":2,"../Card/Deck":3,"../Core/AWModel":9,"../Core/Html":12,"../Core/Ui":15,"../Core/Util":16,"../Range/RangeLibrary":48}],24:[function(require,module,exports){
var nsUtil = require('../Core/Util');
var nsConvert = require('../Core/Convert');
var keyboard = require('../Constants/Keyboard');
var globalUi = require('../Constants/Ui');
var CardList = require('../Card/CardList');
var Backbone = require('backbone');


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
        if (keyCode !== keyboard.TAB_CODE) {
            e.preventDefault();
        }
        if (keyCode === keyboard.RIGHT_ARROW) {
            this.selectNext();
        } else if (keyCode === keyboard.LEFT_ARROW) {
            this.selectPrev();
        }
        if (keyCode === keyboard.BACKSPACE_CODE) {
            if (!this.deleteSelected())
                this.selectPrev();
        }

        if (keyCode === keyboard.DELETE_CODE) {
            this.deleteSelected();
            e.stopPropagation();
        }
        var val, s;

        if (typeof keyboard.RANK_CODES[keyCode] !== "undefined") {
            val = this.getCurrentBoardString();
            if (typeof val !== "undefined") {

                var rank = keyboard.RANK_CODES[keyCode];

                s = '' + rank;

                if (val.length > 1)
                    s += val[1];
                this.setCurrentBoardString(s);
            }
        } else if (typeof keyboard.SUIT_CODES[keyCode] !== "undefined") {
            val = this.getCurrentBoardString();
            /*we must have a current field and the length must be at least 1*/
            if (typeof val != "undefined" && val.length > 0) {

                var suit = keyboard.SUIT_CODES[keyCode];
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

        if (html === globalUi.EMPTY_CARD_STRING)
            return false;

        this.setCurrentBoardString(globalUi.EMPTY_CARD_STRING);
        return true;
    },
    deleteBoard: function() {
        var that = this;
        var fDeleteSingleBoard = function(id) {
            if (nsUtil.fType(id) === 'number') {
                btn = $('.known').eq(id);
                that.setBoardString(btn, globalUi.EMPTY_CARD_STRING);
            } else if (nsUtil.fType(id) === 'string') {
                $('.known').each(function() {
                    if ($(this).val() === id)
                        that.setBoardString($(this), globalUi.EMPTY_CARD_STRING);
                });
            }
        };
        var btn;

        if (arguments.length === 0)
            this.setBoardString($('.known'), globalUi.EMPTY_CARD_STRING);

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
                if (sHtml === globalUi.EMPTY_CARD_STRING) {
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

},{"../Card/CardList":2,"../Constants/Keyboard":4,"../Constants/Ui":6,"../Core/Convert":11,"../Core/Util":16,"backbone":64}],25:[function(require,module,exports){
FlopYoMama = require('./FlopYoMamaModel');
nsHtml = require('../Core/Html');
nsUi = require('../Core/Ui');
globalUi = require('../Constants/Ui');

$(document).ready(function() {
    /**********************************************PROGRESS BARS***************************************************************/

    $('#results_progress').bind('done', function() {
        $(this).removeClass('active');
        $(this).children('div').addClass('progress-bar-success').css('width', '100%');
    });

    $('#results_progress').bind('start', function() {
        $(this).addClass('active');

        $(this).children('div').removeClass('progress-bar-success').css('width', '0%');
        //$(this).children('div').css('width','0%');
    });

    $('#win_percent_bar div').popover({
        content: function() {
            var str = '';
            if ($(this).hasClass('progress-bar-success'))
                str += 'Hero wins: ';
            else if ($(this).hasClass('progress-bar-danger'))
                str += 'Hero loses: ';
            else
                str += 'Hero draws: ';

            var widthStr = $(this)[0].style.width;
            str += parseFloat(widthStr).toFixed(2) + '%';
            return str; //.css('width');
        },
        container: 'body',
        placement: 'auto bottom',
        trigger: 'hover',
        html: true
    });

    $('#win_percent_bar').bind('start', function() { //resets the progress bar to 0 without css transitions
        nsUI.fDeleteLongStatistics();
    });

    /**********************************RANGE GRID & SLIDER******************************************/



    /*window resizing*/
    var bResultsToggled = false,
        bRandToggled = false,
        bRangesToggled = false;
    var sResultsClass = $('#results_col').attr('class');

    $(window).resize(function(e) {
        var width = window.innerWidth,
            ranges, rand, results;
        if (innerWidth <= 992) { //result pop down
            if (!bResultsToggled) {
                results = $('#results_col').detach();
                results.removeClass().addClass('row').appendTo('#content');
                bResultsToggled = true;
            }
        } else if (bResultsToggled) {
            results = $('#results_col').detach();
            results.removeClass().addClass(sResultsClass).appendTo('#range_row');
            bResultsToggled = false;
        } else
            return;

        if (innerWidth <= 768) {
            if (!bRandToggled) {
                rand = $('#rand_buttons').detach();
                rand.appendTo('#my_cards');
                bRandToggled = true;
            }

            if (!bRangesToggled) {
                ranges = $('#range_col').detach();
                ranges.appendTo('#content');
                bRangesToggled = true;
            }
        } else {
            if (bRandToggled) {
                rand = $('#rand_buttons').detach();
                rand.appendTo('#board');
                bRandToggled = false;
            }

            if (bRangesToggled) {
                ranges = $('#range_col').detach();
                ranges.prependTo('#range_row');
                bRangesToggled = false;
            }
            return;
        }
    });
    $(window).triggerHandler('resize');

    $('body').on('click', '.expanded_pair .pair_string', function() {
        $(this).toggleClass('selected');

        var panel = $(this).parent();
        var pairString = panel.attr('id').split('_')[2];
        var iPairsTotal = panel.children().length;
        var iPairsActivated = panel.children('.selected').length;

        var tableCell = $("#op_range_" + pairString);
        var tableCellBg = tableCell.find('.static_bg');

        tableCellBg.find('.glyphicon-cog').remove();
        if (iPairsActivated > 0) {
            tableCell.addClass('selected');
            if (iPairsTotal !== iPairsActivated) {
                tableCellBg.append('<span class="glyphicon glyphicon-cog"></span>');
            }
        } else {
            tableCell.removeClass('selected');
        }
    });

    $('#range_slider').append('<div class="range_slider_bg">&nbsp;</div>');
    /**************************HAND FLOP BOARD************************/

    $("#known_cards").popover({
        content: function() {
            return nsHtml.fGetBoardSelectionTable(flopYoMama.knownCards);
        },
        container: '#known_cards',
        placement: 'bottom',
        trigger: 'manual',
        html: true
    });

    //toggle board selection table when we didn't hit a button
    $('#known_cards [id^=known]').click(function(e) {
        if (!$('#board_selection_table').is(':visible'))
            $("#known_cards").popover('show');
    });

    $('body').on('click', '#board_selection_table .glyphicon-remove', function(e) { //only toggle cards when we didn't hit a button		
        $("#known_cards").popover('hide');
    });

    /*
    TODO: if we want the event to fire only once the click is complete,
    we can save the focused object on the mousedown event
    var focusedBoardAtMousedown = null;
    $('body').on('mousedown','#board_selection_table .card',function(e){ 
    	
    });	*/
    //only toggle cards when we didn't hit a button		
    $('body').on('mousedown', '#board_selection_table .card', function(e) {

        //if it's selected remove it from the board and mark
        //it as not selected not disabled
        if ($(this).is('.selected')) {
            nsUI.fSelectKnown($(this).html());
            nsUI.fDeleteBoard($(this).html());
            //select this part of the board

            $(this).removeClass('disabled selected');
        } else { //if it's not selected, select it and added to the board, mark it as selected and disabled
            var sReplaced = flopYoMama.knownCardsView.setBoardCard($(this).html());
            if (sReplaced !== globalUi.EMPTY_CARD_STRING) { //we replaced a card so disable it in the board
                $('#board_selection_table .card').each(function() {
                    if ($(this).html() === sReplaced) {
                        $(this).removeClass('disabled selected');
                    }
                });
            }

            $(this).addClass('disabled selected');
            flopYoMama.knownCardsView.selectNext(true);
        }

        flopYoMama.knownCardsView.updateModel();
        flopYoMama.knownCards.trigger('finalize');
        return false; //prevent focusout events

    });

    //keypress misses some 

    $(document).bind('keydown', function(e) {
        var keyCode = e.keyCode ? e.keyCode : e.which;
        nsUI.fHandleKeyPress(keyCode, e, flopYoMama.knownCardsView);
    });

    //var $('#known_cards .selected').text-decoration: underline;

    /*filter menu*/
    $('#filter_config_menu').on('click', 'li:not(#new_edit_filter)', function(e) {
        e.preventDefault();
        nsUI.fToggleCheckableMenu(this, true);

        if ($(this).hasClass('active')) {
            nsUtil.fSetLocalStorage("filter_settings", $(this).attr('id'));
            var sTitleString = 'Filter ' + $(this).find('a').html();
            sTitleString = sTitleString.substring(0, sTitleString.indexOf('<'));
            $('#filter_config').attr('title', sTitleString); //can do this later... maybe give the filters a description
        } else {
            $('#filter_config').attr('title', 'Filter');
            nsUtil.fSetLocalStorage("filter_settings", '');
        }
        flopYoMama.updateRoute();
        flopYoMama.knownCards.evaluateKnownCards();
    });
    //do this AFTER all document.ready functions are called	
    setTimeout(function() {
        $('[title]').tooltip({
            container: 'body'
        });
    }, 1);
});

$(function() {
    $('#content').removeClass('preload');
    window.flopYoMama = new FlopYoMama(); 
    window.flopYoMama.setUp();
});

},{"../Constants/Ui":6,"../Core/Html":12,"../Core/Ui":15,"./FlopYoMamaModel":27}],26:[function(require,module,exports){
var FlopYoMama = require('./FlopYoMamaModel');
module.exports = new FlopYoMama();

},{"./FlopYoMamaModel":27}],27:[function(require,module,exports){
var nsUI = require('../Core/Ui');
var nsUtil = require('../Core/Util');
var nsFilter = require('../Filter/Filter');
var Deck = require('../Card/Deck');
var KnownCards = require('../KnownCards/KnownCards');
var KnownCardsView = require('../KnownCards/KnownCardsView');
var Slider = require('../Slider/Slider');
var SliderView = require('../Slider/SliderView');
var RangeTable = require('../Range/RangeTable'); 
var RangeTableView = require('../Range/RangeTableView');
var RangeTypeSelectView = require('../Range/RangeTypeSelectView');
var AWModel = require('../Core/AWModel');
var TableRouter = require('../Core/Route');
var Backbone = require('backbone');
var _ = require('underscore');

var FlopYoMama = AWModel.extend({
    updateRoute: function() {
            var hand = this.knownCards.get('hand'),
                board = this.knownCards.get('board');

            var custom = this.rangeTable.getCustom();
            var aCustom = _.map(custom, function(e) {
                return e.toCustomString();
            });
            var sCustom = aCustom.join(',');
            var filter = nsFilter.fGetActiveFilter() || "";

            var routerValue = "hand=" + hand +
                "&board=" + board +
                "&slider=" + this.slider.get('value') +
                "&range=" + this.slider.getScaleId() +
                "&custom=" + sCustom +
                "&filter=" + filter;
            this.router.navigate(routerValue, {
                trigger: false
            });
    },
    setUp: function() {
        var that = this;

        /*router*/
        this.router = new TableRouter();
        //this triggers the routing once (with the values the user passed
        //to the url)

        Backbone.history.start({
            pushState: false
        });


        /*known cards*/
        this.allCards = new Deck();
        this.knownCards = new KnownCards();
        this.knownCardsView = new KnownCardsView({
            model: this.knownCards
        });
        this.knownCardsView.render();

        /*slider*/
        routerValueSlider = this.router.getRouterValues().slider;

        this.slider = new Slider({
            value: routerValueSlider
        });
        this.sliderView = new SliderView({
            model: this.slider,
            el: $("#range_slider")[0]
        });

        this.rangeTypeSelectView = new RangeTypeSelectView({
            model: this.slider,
            el: $("#sklansky").parent()[0]
        });

        /*range table*/
        this.rangeTable = new RangeTable();
        this.rangeTable.listenToSlider(this.slider);
        this.rangeTableView = new RangeTableView({
            model: this.rangeTable
        });

        //Clear custom selection
        $('#clear_selection').click(function() {
            that.rangeTable.clearCustom();
            that.sliderView.update();
        });

        this.listenTo(this.rangeTable, 'finalize', this.finalizeHandler);

        this.slider.trigger('finalize');
    },
    initialize: function() {
    },
    finalizeHandler: function(args) {
        nsUtil.fLog('FlopYoMama.js: Main Ap Finalize');
        this.knownCards.evaluateKnownCards();
        this.updateRoute();

    }
});

module.exports = FlopYoMama;

},{"../Card/Deck":3,"../Core/AWModel":9,"../Core/Route":14,"../Core/Ui":15,"../Core/Util":16,"../Filter/Filter":18,"../KnownCards/KnownCards":23,"../KnownCards/KnownCardsView":24,"../Range/RangeTable":51,"../Range/RangeTableView":52,"../Range/RangeTypeSelectView":53,"../Slider/Slider":60,"../Slider/SliderView":61,"backbone":64,"underscore":67}],28:[function(require,module,exports){
MenuItemGroup = require('./MenuItemGroup');
MenuListModel = require('./MenuListModel');
MenuView = require('./MenuView');
nsConvert = require('../Core/Convert');

//TODO remove these extra document readies, rename the files to CreateInstance, 
//and then instantiate from the flopYoMama class.
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
});

},{"../Core/Convert":11,"./MenuItemGroup":30,"./MenuListModel":33,"./MenuView":34}],29:[function(require,module,exports){
var AWModel = require('../Core/AWModel');
var MenuItem = AWModel.extend({
    className: 'MenuItem',
    defaults: {
        selectable: true,
        selected: false,
        action: null,
        value: 1,
        dispayValue: this.value,
        divider: false,
        group: null
    },
    initialize: function(o) {

    }
});

module.exports = MenuItem;
},{"../Core/AWModel":9}],30:[function(require,module,exports){

var _ = require('underscore');
var MenuItemGroup = function(name, exclusive) {
    if (_.isUndefined(exclusive))
        exclusive = false;
    if (_.isUndefined(name))
        name = "main";
};

module.exports = MenuItemGroup;
},{"underscore":67}],31:[function(require,module,exports){
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

},{"../Core/AWView":10,"./MenuItemGroup":30,"./MenuListModel":33,"./MenuView":34}],32:[function(require,module,exports){
var MenuItem = require('./MenuItem');
var AWCollection = require("../Core/AWCollection");
var MenuList = AWCollection.extend({
    className: 'MenuCollection',
    model: MenuItem
});

module.exports = MenuList;
},{"../Core/AWCollection":7,"./MenuItem":29}],33:[function(require,module,exports){
"strict mode";
var MenuList = require('./MenuList');
var AWCollectionModel = require('../Core/AWCollectionModel');

var MenuListModel = AWCollectionModel.extend({
    className: 'MenuListModel',
    collection: MenuList
});

module.exports = MenuListModel;

},{"../Core/AWCollectionModel":8,"./MenuList":32}],34:[function(require,module,exports){

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

},{"../Core/AWView":10,"./MenuItemView":31,"underscore":67}],35:[function(require,module,exports){
var AWModel = require('../Core/AWModel');
var nsConvert = require('../Core/Convert');
var nsMath = require('../Core/Math');

var Pair = AWModel.extend({
    className: 'Pair',
    _stringToPrm: function(aArgs) {
        //var prm = arguments;
        var sCardPair = aArgs[0];
        this.sCardPair = sCardPair;
        var oPair = {};
        oPair.rank1 = nsConvert.rankCharToNumber(sCardPair[0]);
        oPair.rank2 = nsConvert.rankCharToNumber(sCardPair[1]);
        oPair.suited = (sCardPair.length === 3 && sCardPair[2] === 's');

        return oPair;
    },
    /*just counts the number oPairs*/
    initialize: function(oPair) {
        if (oPair.rank1 === oPair.rank2)
            oPair.comb = 6;
        else
            oPair.comb = oPair.suited ? 4 : 12;
        this.set('comb', oPair.comb);
    },
    endingChar: function() {
        if (this.get('suited'))
            return 's';
        else if (this.get('comb') === 12)
            return 'o';
        else
            return '';
    },
    toString: function() {
        var rank1 = this.get('rank1');
        var rank2 = this.get('rank2');
        var disRank1 = rank1 > rank2 ? rank1 : rank2;
        var disRank2 = rank1 < rank2 ? rank1 : rank2;
        return nsConvert.rankNumberToChar(disRank1) + '' +
            nsConvert.rankNumberToChar(disRank2) +
            this.endingChar();
    },
    bPPair: function() {
        return (this.get('rank1') === this.get('rank2'));
    },
    toArray: function(aFilter) {
        var aCards = [];
        var aAllKinds = [];

        var rank1 = this.get('rank1');
        var rank2 = this.get('rank2');
        var bSuited = this.get('suited');

        if (rank1 === rank2) {
            aCards.push({
                rank: rank2,
                suit: 1
            });
            aCards.push({
                rank: rank2,
                suit: 2
            });
            aCards.push({
                rank: rank2,
                suit: 3
            });
            aCards.push({
                rank: rank2,
                suit: 4
            });
            aAllKinds = nsMath.combine(aCards, 2);
        } else {
            aCards.push({
                rank: rank2,
                suit: 1
            });
            aCards.push({
                rank: rank2,
                suit: 2
            });
            aCards.push({
                rank: rank2,
                suit: 3
            });
            aCards.push({
                rank: rank2,
                suit: 4
            });
            aCards.push({
                rank: rank1,
                suit: 1
            });
            aCards.push({
                rank: rank1,
                suit: 2
            });
            aCards.push({
                rank: rank1,
                suit: 3
            });
            aCards.push({
                rank: rank1,
                suit: 4
            });
            aAllKinds = nsMath.combine(aCards, 2);
        }

        //order within each pair		
        for (var i = 0; i < aAllKinds.length; i++) {
            aAllKinds[i].sort(function(a, b) {
                if (a.rank !== b.rank)
                    return b.rank - a.rank;

                return b.suit - a.suit;
            });
        }
        //order the pairs
        aAllKinds.sort(function(aPair, bPair) {
            if (aPair[0].rank !== bPair[0].rank)
                return bPair[0].rank - aPair[0].rank;
            else if (aPair[0].suit !== bPair[0].suit)
                return bPair[0].suit - aPair[0].suit;
        });


        //filter out known cards
        aKnownFiltered = [];
        if (typeof aFilter === "object") {
            //nsUtil.fLog("applying pair filter");
            aKnown = aFilter;
            for (i = 0; i < aAllKinds.length; i++) {
                var bPairOk = true;
                for (j = 0; j < aKnown.length; j++) {
                    if ((aAllKinds[i][0].rank === aKnown[j].rank && //filter out pairs
                            aAllKinds[i][0].suit === aKnown[j].suit) ||
                        (aAllKinds[i][1].rank === aKnown[j].rank && //filter out pairs
                            aAllKinds[i][1].suit === aKnown[j].suit)) {
                        bPairOk = false;
                        continue;
                    }
                }
                if (bPairOk === true)
                    aKnownFiltered.push(aAllKinds[i]);
            }
        } else
            aKnownFiltered = aAllKinds;

        //pairs
        if (rank1 === rank2) {
            /*not going to use cardlistlist */
            //return new CardListList(aKnownFiltered);
            return aKnownFiltered;
        }
        //return new HandList(aKnownFiltered);	
        var suited = [];
        var nonsuited = [];
        //is this a bug?
        for (i = 0; i < aKnownFiltered.length; i++) {
            if (aKnownFiltered[i][0].rank !== aKnownFiltered[i][1].rank) //filter out pairs
                if (aKnownFiltered[i][0].suit === aKnownFiltered[i][1].suit)
                    suited.push(aKnownFiltered[i]);
                else
                    nonsuited.push(aKnownFiltered[i]);
        }

        var returnArray = suited;

        if (!bSuited)
            returnArray = nonsuited;

        var aoPairs = [];
        return returnArray;
    }
});

module.exports = Pair;

},{"../Core/AWModel":9,"../Core/Convert":11,"../Core/Math":13}],36:[function(require,module,exports){

var AWCollection = require('../Core/AWCollection');
var Pair = require('./Pair');

var PairList = AWCollection.extend({
    className: 'PairList',
    model: Pair
});

module.exports = PairList;

},{"../Core/AWCollection":7,"./Pair":35}],37:[function(require,module,exports){

var PairList = require('./PairList');
var AWCollectionModel = require('../Core/AWCollectionModel');
var PairListModel = AWCollectionModel.extend({
    className: 'PairListModel',
    collection: PairList
});
module.exports = PairListModel;

},{"../Core/AWCollectionModel":8,"./PairList":36}],38:[function(require,module,exports){

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

},{"backbone":64}],39:[function(require,module,exports){


(function(g){

    //two cards for hero, 
    var Preflop = function (a1, a2, b1, b2) {

        //order the cards in each hand by rank
        this.a1 = a1.get('rank') > a2.get('rank') ? a1 : a2;
        this.a2 = a1.get('rank') > a2.get('rank') ? a2 : a1;
        this.b1 = b1.get('rank') > b2.get('rank') ? b1 : b2;
        this.b2 = b1.get('rank') > b2.get('rank') ? b2 : b1;
        

        this.isNormalized = false;
        this.wasReversedByNormalization = false;

        // returns a suit-normalized and hand order normalized preflop
        // the suits may have changed and/or the order  
        var getNormalizedPreflop = function() {
            var normalizedPreflop;
            
            if(compareHands([this.a1,this.a2],[this.b1, this.b2]) > 0) {
                normalizedPreflop = new Preflop(this.b1, this.b2, this.a1, this.a2);
                normalizedPreflop.wasReversedByNormalization = true;
            } else {
                normalizedPreflop = new Preflop(this.a1, this.a2, this.b1, this.b2);
            }
            
            normalizedPreflop.standardizeSuits();
            
            normalizedPreflop.isNormalized = true;
            return normalizedPreflop; 
        }
        
        var compareHands = function(hand1, hand2) {
            //first compare first card of each hand ranks
            var diff = hand2[0].get('rank') - hand1[0].get('rank'); 
            if (diff != 0) {return diff;}

            //then compare ranks of the second cards, if equal
            var diff = hand2[1].get('rank') - hand1[1].get('rank'); 
            if (diff != 0) {return diff;}

            //rank was alike, for both cards, so now we compare suit of first card
            return hand2[0].get('suit') - hand1[0].get('suit');
        }

        var getKey = function() {
            if (!this.isNormalized) {
                throw 'you must call this method on a normalized Preflop';
            } 

            return this.a1.toString() + '-' +
                this.a2.toString() + '-' +
                this.b1.toString() + '-' +
                this.b2.toString();
        }

        this.standardizeSuits = function() {
            var cardList = new CardList(
                this.a1,
                this.a2,
                this.b1,
                this.b2
            );
            cardList.s
        }
    } 

    g.Preflop = Preflop;
})(window);



},{}],40:[function(require,module,exports){
var AWModel = require('../Core/AWModel');

var FixedRange = AWModel.extend({
    initialize: function() {

        //convert custom objects to custom BB models
        var newCust,
            oldCust = this.get('custom');
        if (oldCust && oldCust.length > 0) {
            if (!(oldCust[0] instanceof RangeItem)) {
                newCust = _.map(oldCust, function(o) {
                    return new RangeItem({
                        pair: o.key,
                        selected: o.selected,
                        custom: true
                    })
                });
                this.set('custom', newCust);
            }
        }

        if (!this.get('id')) {
            this.set('id', this.getIdName());
        }
        this.on('change:name', function(val) {
            this.set('id', this.getIdName());
        });

        this.on('activate', function() {

            var rangeTable = flopYoMama.rangeTable;
            rangeTable.clearCustom();

            //custom board places 
            var custom = this.get('custom');
            _.each(custom, function(o) {
                var key = o.get('key');
                var selected = o.get('selected');
                var mod = rangeTable.findPairString(key);
                mod.set('custom', true);
                mod.set('selected', selected);
            });

            var slider = flopYoMama.slider;
            var sliderView = flopYoMama.sliderView;

            var fnRange = slider.getFnFromScaleId(
                this.get('sliderScale')
            );

            flopYoMama.slider.set('fRangeFunction', fnRange, {
                silent: true
            });
            sliderView.update(this.get('sliderVal'), {
                silent: true
            });

        });

        this.on('save', function() {
            console.log("FIXED RANGE LIST PREFIX" + FixedRangeList.itemPrefix);
            var key = FixedRangeList.itemPrefix + this.get('id');
            nsUtil.fSetLocalStorage(key, this.toJSON());
        });
    },
    getIdName: function() {
        return this.get('name').toLowerCase().replace(/ /g, '_');
    }
});

FixedRange.fromCurrent = function(slider, rangeTable) {
    var range = new FixedRange({
        id: "new_id",
        name: name,
        sliderVal: slider.get('value'),
        sliderScale: slider.getScaleId(),
        custom: rangeTable.getCustom(true)
    });
    return range;
};
module.exports = FixedRange;
},{"../Core/AWModel":9}],41:[function(require,module,exports){
var AWView = require('../Core/AWView');
//item view for the fixed range editor
FixedRangeEditorItemView = AWView.extend({
    initialize: function() {
        this.compiledTemplate = Mustache.compile(this.template);
        //we have to render this when created, otherwise
        //teh click events will not work because the $el must be set up
        this.render();
    },
    render: function() {
        var oData = this.renderData();
        var output = this.compiledTemplate(oData);
        $('#fixed_range_editor .modal-body').append(output);
        this.$el = $(".fixed_range_editor." + oData.id);
    },
    renderData: function() {
        //generate the custom string 
        var cust = this.model.get('custom');
        var sCust = "";
        if (cust) {
            var as = _.map(cust, function(o) {
                return o.toCustomString();
            });

            var sCust = as.join(', ');
        }
        return {
            id: this.model.getIdName(),
            name: this.model.get('name'),
            desc: this.model.get('desc'),
            sliderVal: this.model.get('sliderVal'),
            sliderScale: this.model.get('sliderScale'),
            custom: sCust
        }
    },
    events: {
        'click .edit': 'handleEdit',
        'click .delete': 'handleDelete'
    },
    handleEdit: function() {
        var parent = this.options.parent;
        parent.model.set(this.model.toJSON());
    },
    handleDelete: function() {
        var model = this.model;
        //TODO: here, we can check if it's a default and give a different message
        //but we need to implement this for both this and the filter editor
        if (confirm("Really delete " + model.get('name') + '?')) {
            this.model.collection.remove(model);
        }
    },
    template: '<div class="row fixed_range_editor {{{id}}}" title="{{{desc}}}">' +
        '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">' +
        '<div class="btn-group" role="group" ' +
        'aria-label="buttons for editing this">' +
        '<button type="button" class="btn edit btn-default">' +
        '<span class="glyphicon glyphicon-pencil"/>' +
        '</button>' +
        '<button type="button" class="btn delete btn-danger">' +
        '<span class="glyphicon glyphicon-trash"/>' +
        '</button>' +
        '</div>' +
        '</div>' +
        '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">{{{name}}}</div>' +
        '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">{{{sliderScale}}} {{{sliderVal}}}%</div>' +
        '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">{{{custom}}}</div>' +
        '</div>'
});

//collection view for the fixed-range editor
FixedRangeEditorView = AWView.extend({
    initialize: function() {
        this.compiledTemplate = Mustache.compile(this.template);
        this.render();
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.collection, 'remove', this.render);
        this.listenTo(this.collection, 'add', this.render);
    },
    render: function() {
        this.destroy();
        var oData = this.renderData();
        var output = this.compiledTemplate(oData);
        $('#fixed_range_editor .modal-body').append(output);
        this.$el = $(".fixed_range_editor." + oData.id);
        var that = this;
        this.collection.each(function(m) {
            var view = new FixedRangeEditorItemView({
                model: m,
                parent: that
            });
        });
    },
    renderData: function() {
        console.log('fixedRangeEditor now rendering data');
        //the model is just the current range with no description
        //or name
        var mod = this.model;
        var atts = _.clone(mod.attributes);
        var cust = mod.get('custom');
        var sCust = "";
        if (cust) {
            var as = _.map(cust, function(o) {
                return o.toCustomString();
            });
            var sCust = as.join(', ');
        }
        atts.custom = sCust;
        return atts;
    },
    updateModelFromForm: function() {
        var modName = $('#fef_name').val();
        var modDesc = $('#fef_desc').val();
        //todo, put validation on the model
        if (modName.length < 2) {
            return false;
        }
        this.model.set({
            'name': modName,
            'desc': modDesc
        });
        return true;
    },
    trySave: function() {
        if (!this.updateModelFromForm()) {
            alert('Please enter a model name with at least 1 character.');
        } else {
            var that = this;
            var doSave = function() {

                that.model.trigger('save');

                //now update the collection. if one with the same id is there
                //remove it
                var foundOne = that.collection.findWhere({
                    id: that.model.get('id')
                });

                if (foundOne) {
                    that.collection.remove(foundOne);
                }

                //add it back to the collection 
                that.collection.add(that.model);

                //we have to close now or else fix up the fact
                //that we have the model now as this.model AND in the collection
                $('#fixed_range_editor').modal('hide');
            };

            var key = FixedRangeList.itemPrefix + this.model.get('id');
            var confirmMessage = "Do you wnat to overwrite existing range, " +
                this.model.get('name') + "?";
            var requireConfirm = false;
            if (nsUtil.fGetLocalStorage(key)) {
                requireConfirm = true;
            }

            if (requireConfirm) {
                if (confirm(confirmMessage)) {
                    doSave();
                }
            } else {
                doSave();
            }
        }
    },
    destroy: function() {
        $('#fixed_range_editor .modal-body').html("");
    },
    template: '<form class="fixed_range_editor_form">' +
        '<div class="form-group">' +
        '<label for="fef_name">Name</label>' +
        '<input type="text" id="fef_name" class="form-control" ' +
        'placeholder="Enter a name here" value={{{name}}}>' +
        '<label for="fef_desc">Description</label>' +
        '<textarea id="fef_desc" class="form-control" ' +
        'placeholder="Enter a description here">' +
        '{{{desc}}}' +
        '</textarea>' +
        '</div>' +
        '<div class="form-group">' +
        '<label for="fef_scale_val">Scale</label>' +
        '<input type="text" class="form-control" id="fef_scale_val"' +
        ' value="{{{sliderVal}}}%" disabled="disabled">' +
        '<label for="fef_scale_fn">Range</label>' +
        '<input type="text" class="form-control" id="fef_scale_fn"' +
        ' value="{{{sliderScale}}}" disabled="disabled">' +
        '<label for="fef_custom">Custom</label>' +
        '<textarea type="text" class="form-control" id="fef_custom" disabled="disabled">' +
        '{{{custom}}}' +
        '</textarea>' +
        '</div>' +
        '</form>' +
        '<div class="row fixed_range_editor_title">' +
        '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"><strong></strong></div>' +
        '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"><strong>Name</strong></div>' +
        '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"><strong>Scale</strong></div>' +
        '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6"><strong>Custom</strong></div>' +
        '</div>'
});
},{"../Core/AWView":10}],42:[function(require,module,exports){
var _=require('underscore');
var AWCollection = require('../Core/AWCollection');
var FixedRange = require('./FixedRange');

var FixedRangeList = AWCollection.extend({
    model: FixedRange,
    initialize: function() {
        this.initLocalData();
        this.loadAll();
        this.on('remove', this.toLocalData);
        this.on('add', this.toLocalData);
    },
    initLocalData: function() {
        //do nothing, if it's already there
        var test = nsUtil.fGetLocalStorage(FixedRangeList.displayKey);

        if (nsUtil.fType(test) === 'array') {
            return;
        } else {
            var toSet = _.keys(FixedRangeList.default);
            nsUtil.fSetLocalStorage(FixedRangeList.displayKey, toSet);
        }
    },
    //loads list, accoring to displayKey, first trying from localStorage
    //and then trying from the defaults
    loadAll: function() {
        var toLoad = nsUtil.fGetLocalStorage(FixedRangeList.displayKey),
            that = this;
        this.remove();
        _.each(toLoad, function(key) {
            var test = nsUtil.fGetLocalStorage(FixedRangeList.itemPrefix + key);
            if (test) {
                that.add(test);
            } else if (FixedRangeList.default[key]) {
                that.add(FixedRangeList.default[key]);
            } else {
                alert("Error: could not load fixed range: " + key);
            }
        });
    },
    //writes the list of keys to localstorage
    //based on the current state of the collection
    toLocalData: function() {
        var ids = this.pluck('id');
        nsUtil.fSetLocalStorage(FixedRangeList.displayKey, ids);
    }
});

FixedRangeList.itemPrefix = "fixed_range_";
FixedRangeList.displayKey = "fixed_range_list";

//ranges stored in js for the start
FixedRangeList.default = {
    "nit": {
        "name": "Nit",
        "desc": "A very tight player",
        "sliderVal": 7,
        "sliderScale": "statistical",
        "custom": null
    },
    "tag": {
        "name": "Tag",
        "desc": "Strong player: tight and agressive",
        "sliderVal": 11,
        "sliderScale": "sklansky",
        "custom": null
    },
    "lag": {
        "name": "Lag",
        "desc": "Strong player: loose and agressive",
        "sliderVal": 19,
        "sliderScale": "sklansky",
        "custom": [{
                "key": "44",
                "selected": true
            },
            {
                "key": "33",
                "selected": true
            },
            {
                "key": "22",
                "selected": true
            }
        ]
    },
    "agrofish": {
        "name": "Agrofish",
        "desc": "A very agressive bad player",
        "sliderVal": 25,
        "sliderScale": "statistical",
        "custom": [{
                "key": "K5s",
                "selected": false
            },
            {
                "key": "K4s",
                "selected": false
            },
            {
                "key": "33",
                "selected": true
            },
            {
                "key": "22",
                "selected": true
            }
        ]
    },
    "pairs": {
        "name": "Pairs",
        "desc": "Plays only pocket pairs",
        "sliderVal": 0,
        "sliderScale": "statistical",
        "custom": [{
                "key": "AA",
                "selected": true
            },
            {
                "key": "KK",
                "selected": true
            },
            {
                "key": "QQ",
                "selected": true
            },
            {
                "key": "JJ",
                "selected": true
            },
            {
                "key": "TT",
                "selected": true
            },
            {
                "key": "99",
                "selected": true
            },
            {
                "key": "88",
                "selected": true
            },
            {
                "key": "77",
                "selected": true
            },
            {
                "key": "66",
                "selected": true
            },
            {
                "key": "55",
                "selected": true
            },
            {
                "key": "44",
                "selected": true
            },
            {
                "key": "33",
                "selected": true
            },
            {
                "key": "22",
                "selected": true
            }
        ]
    }
};

module.exports = FixedRangeList;
},{"../Core/AWCollection":7,"./FixedRange":40,"underscore":67}],43:[function(require,module,exports){
var AWView = require('../Core/AWView');
var FixedRangeList = require('./FixedRangeList');
var FixedRangeView = require('./FixedRangeView');

FixedRangeListView = AWView.extend({
    model: FixedRangeView,
    initialize: function() {
        this.render();
        this.listenTo(this.collection, 'change', this.render);
        this.listenTo(this.collection, 'remove', this.render);
        this.listenTo(this.collection, 'add', this.render);
    },
    render: function() {
        $('.fixed_range').remove();
        this.collection.each(function(m) {
            var view = new FixedRangeView({
                model: m
            });
        });
    }
});

module.exports = FixedRangeListView;

/*
$(document).ready(function() {
    var def = new FixedRangeList();
    var view = new FixedRangeListView({
        collection: def
    });

    var editorView = null;
    $('body').on('show.bs.modal', '#fixed_range_editor', function() {
        editorView = new FixedRangeEditorView({
            collection: def,
            model: FixedRange.fromCurrent(flopYoMama.slider, flopYoMama.rangeTable)
        });
    });
    $('body').on('hide.bs.modal', '#fixed_range_editor', function() {
        editorView.destroy();
    });

    $('#save_fixed_ranges').click(function() {
        editorView.trySave();
    });
});
*/

},{"../Core/AWView":10,"./FixedRangeList":42,"./FixedRangeView":44}],44:[function(require,module,exports){
var AWView = require('../Core/AWView');
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
},{"../Core/AWView":10}],45:[function(require,module,exports){

var AWModel = require('../Core/AWModel');
var Pair = require('../Pair/Pair');

var RangeItem = AWModel.extend({
    className: 'RangeItem',
    defaults: {
        filter: [],
        selected: false,
        custom: false
    },
    initialize: function(o) {

        if (!(o.pair instanceof Pair)) {
            this.set('pair', new Pair(o.pair));
        }

        for (var prop in o.pair) {
            this.set(prop, o.pair[prop]);
        }
        this.set('key', this.get('pair').toString());
    },
    safeSetSelected: function(val) {
        if (!this.get('custom')) {
            this.set('selected', val);
        }
    },
    //string representing the custom status AK+ or AK- 
    //empty string represents non-custom fields
    toCustomString: function() {
        if (!this.get('custom')) {
            return "";
        }
        return this.get('pair').toString() +
            (this.get('selected') ? '+' : '-');
    }
});

module.exports = RangeItem;

},{"../Core/AWModel":9,"../Pair/Pair":35}],46:[function(require,module,exports){
var AWCollection = require('../Core/AWCollection');
var RangeItem = require('./RangeItem');

var RangeItemList = AWCollection.extend({
    className: 'RangeItemListNew',
    model: RangeItem
});

/*var RangeItemListModel = AWCollectionModel.extend({
    className: 'RangeItemListModel',
    collection: RangeItemList
});*/

module.exports = RangeItemList;
},{"../Core/AWCollection":7,"./RangeItem":45}],47:[function(require,module,exports){
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

},{"../Core/AWView":10,"underscore":67}],48:[function(require,module,exports){
var $ = require('jquery');
var Pair = require('../Pair/Pair');
var sklanskyRanges = require('./RangeScaleSklansky');
var procentualRanges = require('./RangeScaleProcentual'); 
var poker = require('../Constants/Poker');
var nsFilter = require('../Filter/Filter');
var nsUtil = require('../Core/Util');
var work = require('webworkify');

var nsRange = {};

nsRange.getSlanskyFromPercent = function(fPercent) {
    var aReturn = [];
    var iHandsAdded = 0;
    for (var sklanskyRange = 1; sklanskyRange < sklanskyRanges.length; sklanskyRange++) {
        for (var iHand = 0; iHand < sklanskyRanges[sklanskyRange].length; iHand++) {
            var nextHand = sklanskyRanges[sklanskyRange][iHand];
            var oPair = new Pair(nextHand);
            iHandsAdded += oPair.get("comb");

            if (iHandsAdded / poker.TOTAL_STARTING_COMBINATIONS < fPercent) {
                aReturn.push(nextHand);
            } else
                return aReturn;
        }
    }
    return aReturn;
};

nsRange.getStatisticalFromPercent = function(fPercent) {
    var aReturn = [];
    var iHandsAdded = 0;
    var lastEquity = 0;
    for (var i = 0; i < procentualRange.aStatData.length; i++) {
        var hand = procentualRange.aStatData[i].sPair;
        var oPair = new Pair(hand);
        iHandsAdded += oPair.get("comb");
        if (oPair.get("suited") === false && oPair.get("rank1") !== oPair.get("rank2"))
            hand = hand[0] + hand[1] + 'o'; //add offsuit symbol
        if (iHandsAdded / poker.TOTAL_STARTING_COMBINATIONS <= fPercent) {

            aReturn.push(hand);
            lastEquity = procentualRange.aStatData[i].flEq;
        } else if (lastEquity === procentualRange.aStatData[i].flEq) //when the equity is the same add them all (actually we should check this...)
            aReturn.push(hand);
        else
            return aReturn;

    }
    return aReturn;
};

nsRange.aCurrentWorkers = [];

nsRange.fKillCurrentWorkers = function() {
    for (var i = 0; i < nsRange.aCurrentWorkers.length; i++) {
        nsRange.aCurrentWorkers[i].terminate();
        nsRange.aCurrentWorkers[i] = null; //maybe help on firefox
    }
    nsRange.aCurrentWorkers = [];
};


nsRange.fGetAllUnknownCombinationsThreaded = function(knownCards) {
    return;
    $('.no_results').remove();
    var MAX_WORKERS = 4;
    var workerDoneCount = 0;
    var lastUpdatePercent = 0;
    if (typeof(Worker) === "undefined") {
        alert('Browser must support webworkers!');
        return;
    }

    nsRange.fKillCurrentWorkers();

    var aoStartingHands = nsRange.fGetStartingHandsFromRangeGrid();

    var aKnownCards = knownCards.allKnown(true);
    var aUnknownCards = knownCards.allUnknown(true);
    var aFixedBoardCards = knownCards.get('board').map(function(m) {
        return m.attributes;
    });
    var numberOfOpenBoardHandPlaces = 7 - aKnownCards.length;

    var oDoneRecord = {
        iCountWon: 0,
        iCountLost: 0,
        iCountDraw: 0,
        total: 0
    };
    var oHeroStat = {};
    var oVillainStat = {};

    var fStartWorker = function(aSplitStartingHands) {

        var state = window.history.state;
        if (state !== null) {
            var test = state.valueOf();
            var test2 = state.toString();

        }
        var worker = new work(require('../Worker/Worker'));

        nsRange.aCurrentWorkers.push(worker);

        worker.addEventListener('message', function(e) {
            if (e.data.type === 'progress') {
                //$('#results_progress>div').css("width",e.data.msg + "%"); 
                lastUpdatePercent = e.data.msg;
                //{iCountWon: iCountWon, iCountLost:iCountLost, iCountDraw:iCountDraw,total:numberDone})
                totalWonPer = e.data.msg.iCountWon / e.data.msg.total * 100.0 * e.data.msg.currentPercent; //here we'd have to divide by total number
                totalDrawPer = e.data.msg.iCountDraw / e.data.msg.total * 100.0 * e.data.msg.currentPercent;
                totalLossPer = e.data.msg.iCountLost / e.data.msg.total * 100.0 * e.data.msg.currentPercent;
                $('#win_percent_bar div').each(function(i) {
                    if (i === 0)
                        $(this).css('width', totalWonPer + '%');
                    if (i === 1)
                        $(this).css('width', totalDrawPer + '%');
                    if (i === 2)
                        $(this).css('width', totalLossPer + '%');

                });
            }

            if (e.data.type === 'console')
                nsUtil.fLog(e.data.msg);
            if (e.data.type === 'done') {
                workerDoneCount++;
                var oResult = e.data.msg;
                oDoneRecord.iCountWon += oResult.iCountWon;
                oDoneRecord.iCountLost += oResult.iCountLost;
                oDoneRecord.iCountDraw += oResult.iCountDraw;
                oDoneRecord.total += oResult.total;
                //self.fPostDone({iCountWon: iCountWon, iCountLost:iCountLost, iCountDraw:iCountDraw,total:numberDone});

                oHeroStat = nsUtil.combineObjects(oResult.oHeroStat, oHeroStat, function(a, b) {
                    if (typeof a === "undefined")
                        a = {
                            lossCount: 0,
                            wonCount: 0,
                            drawCount: 0
                        };
                    if (typeof b === "undefined")
                        b = {
                            lossCount: 0,
                            wonCount: 0,
                            drawCount: 0
                        };
                    return nsUtil.combineObjects(a, b, function(a, b) {
                        return a + b;
                    });
                });

                oVillainStat = nsUtil.combineObjects(oResult.oVillainStat, oVillainStat, function(a, b) {
                    if (typeof a === "undefined")
                        a = {
                            lossCount: 0,
                            wonCount: 0,
                            drawCount: 0
                        };
                    if (typeof b === "undefined")
                        b = {
                            lossCount: 0,
                            wonCount: 0,
                            drawCount: 0
                        };
                    return nsUtil.combineObjects(a, b, function(a, b) {
                        return a + b;
                    });
                });


                if (workerDoneCount === MAX_WORKERS) {
                    //$('#results_progress').trigger('done');
                    $('#win_percent_bar').trigger('done');
                    var totalWonPer = oDoneRecord.iCountWon / oDoneRecord.total * 100.0;
                    var totalLossPer = oDoneRecord.iCountLost / oDoneRecord.total * 100.0;
                    var totalDrawPer = oDoneRecord.iCountDraw / oDoneRecord.total * 100.0;
                    nsUtil.fLog('total win count: ' + oDoneRecord.iCountWon +
                        ' total loss count: ' + oDoneRecord.iCountLost + ' total draw count: ' + i + oDoneRecord.iCountDraw);
                    nsUtil.fLog('total win %: ' + totalWonPer +
                        ' total loss %: ' + totalLossPer + ' total draw %: ' +
                        totalDrawPer);


                    if (oDoneRecord.total === 0) {
                        var nothingFound = '<p class="no_results">All results filtered out.</p>';
                        $('#hero_stat').html(nothingFound);
                        $('#villain_stat').html(nothingFound);
                        $('#textures').html(nothingFound); //should actually be done in the textures method
                        return;
                    }

                    nsHtml.fSetMainStatBar(totalWonPer, totalDrawPer, totalLossPer);

                    var graphPref = nsPrefs.oGraphType.fGet();
                    if (graphPref === nsPrefs.nsConst.BAR_GRAPHS) {
                        var heroStatHtml = ""; //"<row><h4>Hero Results</h4></row>";
                        heroStatHtml += nsHtml.fGetResultStatHtml(oHeroStat, oDoneRecord);

                        var villainStatHtml = ""; //"</row><h4>Villain Results</h4></row>"; //todo fix boilerplate code
                        villainStatHtml += nsHtml.fGetResultStatHtml(oVillainStat, oDoneRecord);

                        $('#hero_stat').html(heroStatHtml);
                        $('#villain_stat').html(villainStatHtml);
                        nsHtml.fInitResultPopovers();
                    } else if (graphPref === nsPrefs.nsConst.PIE_GRAPHS) {
                        nsHtml.fDrawResultsStatPie(oHeroStat, oDoneRecord, 'hero_stat');
                        nsHtml.fDrawResultsStatPie(oVillainStat, oDoneRecord, 'villain_stat');
                    }


                }
            }
            //nsUtil.fLog('message received: ' + e.data);
        }, false);

        worker.postMessage({
            'cmd': 'start',
            'msg': '',
            aoStartingHands: aSplitStartingHands,
            aKnownCards: aKnownCards,
            aUnknownCards: aUnknownCards,
            numberOfOpenBoardHandPlaces: numberOfOpenBoardHandPlaces,
            aFixedBoardCards: aFixedBoardCards,
            oFilter: nsFilter.oFilterRecord,
            bMin: false
        });
    }; //end fStartWorker

    $('#win_percent_bar').trigger('start');

    var startHandL = aoStartingHands.length;
    var handsPerWorker = Math.floor(startHandL / MAX_WORKERS) + 1;

    nsUtil.fLog('start hand length ' + startHandL);
    for (var i = 0; i < MAX_WORKERS; i++) {
        var start = i === 0 ? 0 : i * handsPerWorker;
        var end = start + handsPerWorker;
        var aHandWorkerRange = aoStartingHands.slice(start, end);
        fStartWorker(aHandWorkerRange);

        nsUtil.fLog('worker start hand start index ' + start + " end index " + end);
    }
};

nsRange.fGetTextures = function(knownCards) {
    if (typeof(Worker) === "undefined") {
        alert('Browser must support webworkers!');
        return;
    }
    $('.no_results').remove();
    //aoStartingHands,aKnownCards,aFixedBoardCards
    var aoStartingHands = nsRange.fGetStartingHandsFromRangeGrid();
    var aKnownCards = knownCards.allKnown(true);
    var aFixedBoardCards = knownCards.get('board').map(function(m) {
        return m.attributes;
    });
    var oFilter = nsFilter.fActiveFilter(null, true);

    var fStartWorker = function() {

        var worker = new work(require('../Worker/WorkerTextures'));

        worker.addEventListener('message', function(e) {
            if (e.data.type === 'console')
                nsUtil.fLog(e.data.msg);
            if (e.data.type === 'done') {
                var oResult = e.data.msg;
                var graphPref = nsPrefs.oGraphType.fGet();
                nsFilter.fClearFilter();
                nsFilter.fDrawFilterToBoard(oResult.oFilterRecord);
                if (graphPref === nsPrefs.nsConst.BAR_GRAPHS) {
                    var sHtml = nsHtml.fGetTextureHtml(oResult);
                    $('#textures').html(sHtml);
                    nsHtml.fSetupTextureHover(oResult);
                } else if (graphPref === nsPrefs.nsConst.PIE_GRAPHS) {
                    nsHtml.fDrawTexturePie(oResult);
                }
            }
            nsUtil.fLog('message received from texture worker: ' + JSON.stringify(e.data));
        }, false);

        worker.postMessage({
            'cmd': 'start',
            'msg': '',
            aoStartingHands: aoStartingHands,
            aKnownCards: aKnownCards,
            aFixedBoardCards: aFixedBoardCards,
            oFilter: oFilter,
            bMin: false
        });
    }; //end fStartWorker

    fStartWorker();
};

nsRange.getStartingHandStrings = function() {
    var allStartingPairs = [];
    var jqSelected = $("#op_range_table .selected>.inner_pair").each(function() {
        allStartingPairs.push($(this).html());
    });
    return allStartingPairs;
};

nsRange.fGetStartingHandsFromRangeGrid = function(bAll) {
    var allStartingPairs = [];
    var selector = "#op_range_table td.selected";
    if (bAll === true)
        selector = "#op_range_table td";
    var jqSelected = $(selector).each(function() {
        var pairString = $(this).attr('id').split('_')[2]; //$(this).html();
        var oPair = new Pair(pairString);
        var actualPairs = oPair.toArray();
        allStartingPairs.push({
            oPair: oPair,
            aPair: actualPairs,
            sPair: pairString
        });
    });
    return allStartingPairs;
};

module.exports = nsRange;

},{"../Constants/Poker":5,"../Core/Util":16,"../Filter/Filter":18,"../Pair/Pair":35,"../Worker/Worker":62,"../Worker/WorkerTextures":63,"./RangeScaleProcentual":49,"./RangeScaleSklansky":50,"jquery":65,"webworkify":68}],49:[function(require,module,exports){

var range = {};
range.aStatData = [];
range.aStatData.push({
    sPair: "AA",
    flEq: 2.32,
    iSampleSize: 550632
});
range.aStatData.push({
    sPair: "KK",
    flEq: 1.67,
    iSampleSize: 551878
});
range.aStatData.push({
    sPair: "QQ",
    flEq: 1.22,
    iSampleSize: 549570
});
range.aStatData.push({
    sPair: "JJ",
    flEq: 0.86,
    iSampleSize: 550948
});
range.aStatData.push({
    sPair: "AKs",
    flEq: 0.77,
    iSampleSize: 367870
});
range.aStatData.push({
    sPair: "AQs",
    flEq: 0.59,
    iSampleSize: 368178
});
range.aStatData.push({
    sPair: "TT",
    flEq: 0.58,
    iSampleSize: 550156
});
range.aStatData.push({
    sPair: "AK",
    flEq: 0.51,
    iSampleSize: 1106047
});
range.aStatData.push({
    sPair: "AJs",
    flEq: 0.43,
    iSampleSize: 367811
});
range.aStatData.push({
    sPair: "KQs",
    flEq: 0.39,
    iSampleSize: 366191
});
range.aStatData.push({
    sPair: "99",
    flEq: 0.38,
    iSampleSize: 552062
});
range.aStatData.push({
    sPair: "ATs",
    flEq: 0.33,
    iSampleSize: 367393
});
range.aStatData.push({
    sPair: "AQ",
    flEq: 0.31,
    iSampleSize: 1101249
});
range.aStatData.push({
    sPair: "KJs",
    flEq: 0.29,
    iSampleSize: 365921
});
range.aStatData.push({
    sPair: "88",
    flEq: 0.25,
    iSampleSize: 550710
});
range.aStatData.push({
    sPair: "QJs",
    flEq: 0.23,
    iSampleSize: 368213
});
range.aStatData.push({
    sPair: "KTs",
    flEq: 0.2,
    iSampleSize: 368086
});
range.aStatData.push({
    sPair: "AJ",
    flEq: 0.19,
    iSampleSize: 1103946
});
range.aStatData.push({
    sPair: "A9s",
    flEq: 0.18,
    iSampleSize: 368279
});
range.aStatData.push({
    sPair: "QTs",
    flEq: 0.17,
    iSampleSize: 365398
});
range.aStatData.push({
    sPair: "KQ",
    flEq: 0.16,
    iSampleSize: 1103231
});
range.aStatData.push({
    sPair: "77",
    flEq: 0.16,
    iSampleSize: 553492
});
range.aStatData.push({
    sPair: "JTs",
    flEq: 0.15,
    iSampleSize: 367811
});
range.aStatData.push({
    sPair: "A8s",
    flEq: 0.1,
    iSampleSize: 368982
});
range.aStatData.push({
    sPair: "K9s",
    flEq: 0.09,
    iSampleSize: 367736
});
range.aStatData.push({
    sPair: "A7s",
    flEq: 0.08,
    iSampleSize: 369231
});
range.aStatData.push({
    sPair: "A5s",
    flEq: 0.08,
    iSampleSize: 367900
});
range.aStatData.push({
    sPair: "AT",
    flEq: 0.08,
    iSampleSize: 1105376
});
range.aStatData.push({
    sPair: "KJ",
    flEq: 0.07,
    iSampleSize: 1105604
});
range.aStatData.push({
    sPair: "66",
    flEq: 0.07,
    iSampleSize: 549696
});
range.aStatData.push({
    sPair: "Q9s",
    flEq: 0.06,
    iSampleSize: 367923
});
range.aStatData.push({
    sPair: "A4s",
    flEq: 0.06,
    iSampleSize: 367553
});
range.aStatData.push({
    sPair: "T9s",
    flEq: 0.05,
    iSampleSize: 367750
});
range.aStatData.push({
    sPair: "J9s",
    flEq: 0.04,
    iSampleSize: 369223
});
range.aStatData.push({
    sPair: "QJ",
    flEq: 0.03,
    iSampleSize: 1102901
});
range.aStatData.push({
    sPair: "A6s",
    flEq: 0.03,
    iSampleSize: 366998
});
range.aStatData.push({
    sPair: "55",
    flEq: 0.02,
    iSampleSize: 550840
});
range.aStatData.push({
    sPair: "A3s",
    flEq: 0.02,
    iSampleSize: 367269
});
range.aStatData.push({
    sPair: "KT",
    flEq: 0.01,
    iSampleSize: 1103705
});
range.aStatData.push({
    sPair: "K8s",
    flEq: 0.01,
    iSampleSize: 369893
});
range.aStatData.push({
    sPair: "A2s",
    flEq: 0,
    iSampleSize: 366466
});
range.aStatData.push({
    sPair: "T8s",
    flEq: 0,
    iSampleSize: 366732
});
range.aStatData.push({
    sPair: "K7s",
    flEq: 0,
    iSampleSize: 367647
});
range.aStatData.push({
    sPair: "98s",
    flEq: 0,
    iSampleSize: 368190
});
range.aStatData.push({
    sPair: "87s",
    flEq: -0.02,
    iSampleSize: 367787
});
range.aStatData.push({
    sPair: "QT",
    flEq: -0.02,
    iSampleSize: 1106012
});
range.aStatData.push({
    sPair: "Q8s",
    flEq: -0.02,
    iSampleSize: 367657
});
range.aStatData.push({
    sPair: "76s",
    flEq: -0.03,
    iSampleSize: 367110
});
range.aStatData.push({
    sPair: "A9",
    flEq: -0.03,
    iSampleSize: 1105684
});
range.aStatData.push({
    sPair: "J8s",
    flEq: -0.03,
    iSampleSize: 367615
});
range.aStatData.push({
    sPair: "JT",
    flEq: -0.03,
    iSampleSize: 1102233
});
range.aStatData.push({
    sPair: "44",
    flEq: -0.03,
    iSampleSize: 552443
});
range.aStatData.push({
    sPair: "97s",
    flEq: -0.04,
    iSampleSize: 369494
});
range.aStatData.push({
    sPair: "K6s",
    flEq: -0.04,
    iSampleSize: 366407
});
range.aStatData.push({
    sPair: "T7s",
    flEq: -0.05,
    iSampleSize: 367201
});
range.aStatData.push({
    sPair: "K5s",
    flEq: -0.05,
    iSampleSize: 368807
});
range.aStatData.push({
    sPair: "K4s",
    flEq: -0.05,
    iSampleSize: 368061
});
range.aStatData.push({
    sPair: "Q7s",
    flEq: -0.06,
    iSampleSize: 367512
});
range.aStatData.push({
    sPair: "65s",
    flEq: -0.07,
    iSampleSize: 367986
});
range.aStatData.push({
    sPair: "33",
    flEq: -0.07,
    iSampleSize: 551586
});
range.aStatData.push({
    sPair: "K9",
    flEq: -0.07,
    iSampleSize: 1103920
});
range.aStatData.push({
    sPair: "86s",
    flEq: -0.07,
    iSampleSize: 367805
});
range.aStatData.push({
    sPair: "A8",
    flEq: -0.07,
    iSampleSize: 1100445
});
range.aStatData.push({
    sPair: "J7s",
    flEq: -0.07,
    iSampleSize: 364541
});
range.aStatData.push({
    sPair: "54s",
    flEq: -0.08,
    iSampleSize: 367333
});
range.aStatData.push({
    sPair: "K2s",
    flEq: -0.08,
    iSampleSize: 368737
});
range.aStatData.push({
    sPair: "J9",
    flEq: -0.08,
    iSampleSize: 1102303
});
range.aStatData.push({
    sPair: "Q6s",
    flEq: -0.08,
    iSampleSize: 368294
});
range.aStatData.push({
    sPair: "Q9",
    flEq: -0.08,
    iSampleSize: 1107991
});
range.aStatData.push({
    sPair: "K3s",
    flEq: -0.08,
    iSampleSize: 368321
});
range.aStatData.push({
    sPair: "T9",
    flEq: -0.08,
    iSampleSize: 1103441
});
range.aStatData.push({
    sPair: "96s",
    flEq: -0.09,
    iSampleSize: 369159
});
range.aStatData.push({
    sPair: "64s",
    flEq: -0.09,
    iSampleSize: 369101
});
range.aStatData.push({
    sPair: "75s",
    flEq: -0.09,
    iSampleSize: 369303
});
range.aStatData.push({
    sPair: "Q5s",
    flEq: -0.09,
    iSampleSize: 369538
});
range.aStatData.push({
    sPair: "22",
    flEq: -0.09,
    iSampleSize: 553171
});
range.aStatData.push({
    sPair: "T8",
    flEq: -0.09,
    iSampleSize: 1107310
});
range.aStatData.push({
    sPair: "J8",
    flEq: -0.1,
    iSampleSize: 1104552
});
range.aStatData.push({
    sPair: "Q4s",
    flEq: -0.1,
    iSampleSize: 368471
});
range.aStatData.push({
    sPair: "98",
    flEq: -0.1,
    iSampleSize: 1103082
});
range.aStatData.push({
    sPair: "T7",
    flEq: -0.1,
    iSampleSize: 1103171
});
range.aStatData.push({
    sPair: "A7",
    flEq: -0.1,
    iSampleSize: 1104965
});
range.aStatData.push({
    sPair: "97",
    flEq: -0.1,
    iSampleSize: 1104506
});
range.aStatData.push({
    sPair: "T6",
    flEq: -0.11,
    iSampleSize: 1101165
});
range.aStatData.push({
    sPair: "Q3s",
    flEq: -0.11,
    iSampleSize: 367390
});
range.aStatData.push({
    sPair: "J5s",
    flEq: -0.11,
    iSampleSize: 368354
});
range.aStatData.push({
    sPair: "K8",
    flEq: -0.11,
    iSampleSize: 1106439
});
range.aStatData.push({
    sPair: "K7",
    flEq: -0.11,
    iSampleSize: 1101741
});
range.aStatData.push({
    sPair: "86",
    flEq: -0.11,
    iSampleSize: 1105837
});
range.aStatData.push({
    sPair: "53s",
    flEq: -0.11,
    iSampleSize: 366243
});
range.aStatData.push({
    sPair: "85",
    flEq: -0.11,
    iSampleSize: 1106745
});
range.aStatData.push({
    sPair: "85s",
    flEq: -0.11,
    iSampleSize: 367456
});
range.aStatData.push({
    sPair: "63s",
    flEq: -0.11,
    iSampleSize: 365732
});
range.aStatData.push({
    sPair: "76",
    flEq: -0.11,
    iSampleSize: 1105164
});
range.aStatData.push({
    sPair: "Q8",
    flEq: -0.11,
    iSampleSize: 1106395
});
range.aStatData.push({
    sPair: "75",
    flEq: -0.11,
    iSampleSize: 1105498
});
range.aStatData.push({
    sPair: "J4s",
    flEq: -0.11,
    iSampleSize: 366906
});
range.aStatData.push({
    sPair: "74s",
    flEq: -0.11,
    iSampleSize: 369655
});
range.aStatData.push({
    sPair: "J6s",
    flEq: -0.11,
    iSampleSize: 366958
});
range.aStatData.push({
    sPair: "T6s",
    flEq: -0.11,
    iSampleSize: 368322
});
range.aStatData.push({
    sPair: "96",
    flEq: -0.12,
    iSampleSize: 1105092
});
range.aStatData.push({
    sPair: "A5",
    flEq: -0.12,
    iSampleSize: 1104643
});
range.aStatData.push({
    sPair: "95",
    flEq: -0.12,
    iSampleSize: 1102769
});
range.aStatData.push({
    sPair: "95s",
    flEq: -0.12,
    iSampleSize: 368015
});
range.aStatData.push({
    sPair: "94",
    flEq: -0.12,
    iSampleSize: 1105939
});
range.aStatData.push({
    sPair: "53",
    flEq: -0.12,
    iSampleSize: 1105251
});
range.aStatData.push({
    sPair: "93",
    flEq: -0.12,
    iSampleSize: 1104310
});
range.aStatData.push({
    sPair: "J7",
    flEq: -0.12,
    iSampleSize: 1105297
});
range.aStatData.push({
    sPair: "92",
    flEq: -0.12,
    iSampleSize: 1107579
});
range.aStatData.push({
    sPair: "87",
    flEq: -0.12,
    iSampleSize: 1103007
});
range.aStatData.push({
    sPair: "Q7",
    flEq: -0.12,
    iSampleSize: 1104331
});
range.aStatData.push({
    sPair: "J6",
    flEq: -0.12,
    iSampleSize: 1104704
});
range.aStatData.push({
    sPair: "K6",
    flEq: -0.12,
    iSampleSize: 1103401
});
range.aStatData.push({
    sPair: "T5",
    flEq: -0.12,
    iSampleSize: 1107072
});
range.aStatData.push({
    sPair: "T5s",
    flEq: -0.12,
    iSampleSize: 368030
});
range.aStatData.push({
    sPair: "84",
    flEq: -0.12,
    iSampleSize: 1104856
});
range.aStatData.push({
    sPair: "83",
    flEq: -0.12,
    iSampleSize: 1106532
});
range.aStatData.push({
    sPair: "62",
    flEq: -0.12,
    iSampleSize: 1107570
});
range.aStatData.push({
    sPair: "82",
    flEq: -0.12,
    iSampleSize: 1101727
});
range.aStatData.push({
    sPair: "Q2s",
    flEq: -0.12,
    iSampleSize: 368355
});
range.aStatData.push({
    sPair: "T3",
    flEq: -0.12,
    iSampleSize: 1102033
});
range.aStatData.push({
    sPair: "T2",
    flEq: -0.12,
    iSampleSize: 1105503
});
range.aStatData.push({
    sPair: "42",
    flEq: -0.12,
    iSampleSize: 1101359
});
range.aStatData.push({
    sPair: "52",
    flEq: -0.12,
    iSampleSize: 1107694
});
range.aStatData.push({
    sPair: "74",
    flEq: -0.12,
    iSampleSize: 1101551
});
range.aStatData.push({
    sPair: "A4",
    flEq: -0.12,
    iSampleSize: 1104763
});
range.aStatData.push({
    sPair: "73",
    flEq: -0.12,
    iSampleSize: 1105302
});
range.aStatData.push({
    sPair: "63",
    flEq: -0.12,
    iSampleSize: 1103080
});
range.aStatData.push({
    sPair: "72",
    flEq: -0.12,
    iSampleSize: 1104285
});
range.aStatData.push({
    sPair: "A6",
    flEq: -0.12,
    iSampleSize: 1105125
});
range.aStatData.push({
    sPair: "65",
    flEq: -0.12,
    iSampleSize: 1104700
});
range.aStatData.push({
    sPair: "64",
    flEq: -0.12,
    iSampleSize: 1101489
});
range.aStatData.push({
    sPair: "T4",
    flEq: -0.12,
    iSampleSize: 1106174
});
range.aStatData.push({
    sPair: "Q4",
    flEq: -0.13,
    iSampleSize: 1103742
});
range.aStatData.push({
    sPair: "84s",
    flEq: -0.13,
    iSampleSize: 368694
});
range.aStatData.push({
    sPair: "K5",
    flEq: -0.13,
    iSampleSize: 1105669
});
range.aStatData.push({
    sPair: "Q3",
    flEq: -0.13,
    iSampleSize: 1106081
});
range.aStatData.push({
    sPair: "Q6",
    flEq: -0.13,
    iSampleSize: 1105012
});
range.aStatData.push({
    sPair: "Q2",
    flEq: -0.13,
    iSampleSize: 1104650
});
range.aStatData.push({
    sPair: "43s",
    flEq: -0.13,
    iSampleSize: 368525
});
range.aStatData.push({
    sPair: "J5",
    flEq: -0.13,
    iSampleSize: 1105844
});
range.aStatData.push({
    sPair: "43",
    flEq: -0.13,
    iSampleSize: 1106577
});
range.aStatData.push({
    sPair: "J4",
    flEq: -0.13,
    iSampleSize: 1106654
});
range.aStatData.push({
    sPair: "A3",
    flEq: -0.13,
    iSampleSize: 1105722
});
range.aStatData.push({
    sPair: "T4s",
    flEq: -0.13,
    iSampleSize: 370150
});
range.aStatData.push({
    sPair: "54",
    flEq: -0.13,
    iSampleSize: 1104529
});
range.aStatData.push({
    sPair: "J3",
    flEq: -0.13,
    iSampleSize: 1104433
});
range.aStatData.push({
    sPair: "K4",
    flEq: -0.13,
    iSampleSize: 1104957
});
range.aStatData.push({
    sPair: "J3s",
    flEq: -0.13,
    iSampleSize: 368616
});
range.aStatData.push({
    sPair: "J2",
    flEq: -0.13,
    iSampleSize: 1103759
});
range.aStatData.push({
    sPair: "Q5",
    flEq: -0.13,
    iSampleSize: 1106053
});
range.aStatData.push({
    sPair: "T3s",
    flEq: -0.13,
    iSampleSize: 369188
});
range.aStatData.push({
    sPair: "J2s",
    flEq: -0.14,
    iSampleSize: 367858
});
range.aStatData.push({
    sPair: "T2s",
    flEq: -0.14,
    iSampleSize: 369195
});
range.aStatData.push({
    sPair: "62s",
    flEq: -0.14,
    iSampleSize: 367206
});
range.aStatData.push({
    sPair: "92s",
    flEq: -0.14,
    iSampleSize: 367488
});
range.aStatData.push({
    sPair: "93s",
    flEq: -0.14,
    iSampleSize: 368278
});
range.aStatData.push({
    sPair: "73s",
    flEq: -0.14,
    iSampleSize: 368640
});
range.aStatData.push({
    sPair: "82s",
    flEq: -0.14,
    iSampleSize: 368039
});
range.aStatData.push({
    sPair: "52s",
    flEq: -0.14,
    iSampleSize: 367876
});
range.aStatData.push({
    sPair: "K2",
    flEq: -0.14,
    iSampleSize: 1106898
});
range.aStatData.push({
    sPair: "K3",
    flEq: -0.14,
    iSampleSize: 1104211
});
range.aStatData.push({
    sPair: "42s",
    flEq: -0.14,
    iSampleSize: 369977
});
range.aStatData.push({
    sPair: "32",
    flEq: -0.14,
    iSampleSize: 1103272
});
range.aStatData.push({
    sPair: "83s",
    flEq: -0.15,
    iSampleSize: 368814
});
range.aStatData.push({
    sPair: "72s",
    flEq: -0.15,
    iSampleSize: 368039
});
range.aStatData.push({
    sPair: "94s",
    flEq: -0.15,
    iSampleSize: 367617
});
range.aStatData.push({
    sPair: "A2",
    flEq: -0.15,
    iSampleSize: 1106519
});
range.aStatData.push({
    sPair: "32s",
    flEq: -0.16,
    iSampleSize: 369182
});

module.exports = range;

},{}],50:[function(require,module,exports){
/*SLANSKY RANGES http://en.wikipedia.org/wiki/Texas_hold_%27em_starting_hands*/

var sklanskyRanges = [];
sklanskyRanges[0] = [];
sklanskyRanges[1] = ["AA", "KK", "QQ", "JJ", "AKs"];
sklanskyRanges[2] = ["TT", "AQs", "AJs", "KQs", "AKo"];
sklanskyRanges[3] = ["99", "ATs", "KJs", "QJs", "JTs", "AQo"];
sklanskyRanges[4] = ["88", "KTs", "QTs", "J9s", "T9s", "98s", "AJo", "KQo"];
sklanskyRanges[5] = ["77", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s",
    "A2s", "Q9s", "T8s", "97s", "87s", "76s", "KJo", "QJo", "JTo"
];
sklanskyRanges[6] = ["66", "55", "K9s", "J8s", "86s", "75s", "65s", "54s", "ATo", "KTo", "QTo"];
sklanskyRanges[7] = ["44", "33", "22", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s",
    "Q8s", "T7s", "64s", "43s", "53s", "J9o", "T9o", "98o"
]; //65s missing from wiki
sklanskyRanges[8] = ["J7s", "96s", "85s", "74s", "42s", "32s", "A9o", "K9o", "Q9o", "J8o",
    "T8o", "87o", "76o", "65o", "54o"
];

module.exports = sklanskyRanges;

},{}],51:[function(require,module,exports){
var RangeItemList = require('./RangeItemList');
var _ = require('underscore');
var nsUtil = require('../Core/Util');

var RangeTable = RangeItemList.extend({
    className: 'RangeTable',
    initialize: function() {

        for (rank1 = 14; rank1 > 1; rank1--) {
            for (rank2 = 14; rank2 > 1; rank2--) {
                var rangeItem = {
                    pair: {
                        rank1: rank1,
                        rank2: rank2,
                        suited: (rank1 > rank2)
                    }
                };
                this.add(rangeItem);
            }
        }

        this.amChanged = [];
        this.on('change', function(mod) {
            this.amChanged.push(mod);
        });

        this.on('finalize', function() {
            this.trigger('updateModels', this.amChanged);
            this.amChanged = [];
        });

        /*if (routerValues.custom) {
            this.setCustom(routerValues.custom);
        }*/

    },
    listenToSlider: function(slider) {
        this.listenTo(slider, 'change:value', function() {
            this.fSetFromRangeFunction(slider);
        });

        this.listenTo(slider, 'finalize', function() {
            this.trigger('finalize');
        });
    },
    lastRangeVal: 0.0,
    fSetFromRangeFunction: function(slider) {
        var value = slider.get('value');
        var fRange = slider.get('fRangeFunction');
        var aHits = fRange(value / 100.0);
        nsUtil.fLog('calling range function');
        //if (this.lastRangeVal > value) {
        //getting small just
        var models = this.where({
                'selected': true
            }),
            i;
        for (i = 0; i < models.length; i++) {
            models[i].safeSetSelected(false);
        }

        for (i = 0; i < aHits.length; i++) {
            var rangeItem = this.findPairString(aHits[i]);
            rangeItem.safeSetSelected(true);
        }
        this.lastRangeVal = value;

    },
    rangeItemAt: function(rank1, rank2) { //search for a row or a column
        if (!_.isUndefined(rank2))
            return this.findWhere({
                rank1: rank1,
                rank2: rank2
            });
        else
            return this.find({
                rank1: rank1
            });
    },
    tableLoop: function(fnRow, fnCol) {
        for (rank1 = 14; rank1 > 1; rank1--) {
            fnRow(this.rangeItemAt(rank1, rank2));
            for (rank2 = 14; rank2 > 1; rank2--) {
                fnCol(this.rangeItemAt(rank1, rank2));
            }
        }
    },
    findPairString: function(input) {
        var returnMod = null;
        this.forEach(function(mod) {
            if (mod.get('key') === input) {
                returnMod = mod;
                return false;
            }
        });
        return returnMod;
    },
    getCustom: function(clone) {
        var custom = this.where({
            custom: true
        });
        if (!clone) {
            return custom;
        } else {
            return _.map(custom, function(o) {
                return o.clone();
            });
        }
    },
    //todo, the clear custom button doesn't currently call this
    clearCustom: function() {
        _.each(this.getCustom(), function(m) {
            m.set('custom', false);
        });
    },
    //sets the custom cards from the custom string (AKo+, KK-)...etc.
    setCustom: function(sCustom) {
        if (!sCustom) {
            return;
        }

        //split on plus, minus, but not end
        var aCustom = sCustom.split(','),
            that = this;
        _.each(aCustom, function(c) {
            var pairName = c.substring(0, c.length - 1);
            var inclusion = c.substring(c.length - 1, c.length);
            var rangeItem = that.findPairString(pairName);
            rangeItem.set('custom', true);
            var selected = inclusion === '+' ? true : false;
            rangeItem.set('selected', selected);
        });
    }

});

module.exports = RangeTable;

},{"../Core/Util":16,"./RangeItemList":46,"underscore":67}],52:[function(require,module,exports){

var AWView = require('../Core/AWView');
var RangeItemView = require('./RangeItemView');
var _ = require('underscore');
var RangeTableView = AWView.extend({
    tagName: 'table',
    className: 'table',
    id: 'op_range_table',
    parent: 'op_range',
    currentRangeItemView: null,
    initialize: function() {
        var renderData = this.renderData;

        this.model.tableLoop(
            function(mod) {
                renderData.row.push([]);
            },
            function(mod) {
                if (!this.currentRangeItemView)
                    this.currentRangeItemView = new RangeItemView({
                        model: mod
                    });
                else
                    this.currentRangeItemView.setModel(mod);

                renderData.row[renderData.row.length - 1].push({
                    innerHtml: this.currentRangeItemView.render(),
                    id: this.currentRangeItemView.idPrefix() + this.currentRangeItemView.id(),
                    sClass: this.currentRangeItemView.className()
                });
            }
        );
        this.render();

        this.listenTo(this.model, 'change', function(oChanged) {
            if (!this.currentRangeItemView)
                this.currentRangeItemView = new RangeItemView({
                    model: oChanged
                });
            else
                this.currentRangeItemView.setModel(oChanged);

            this.currentRangeItemView.render();
            this.fFixCustomBorders();
        });
    },
    events: {
        "mousedown td": "handleMousedown"
    },
    modelFromTD: function(td) {
        var id = $(td).attr('id');
        var sId = id.split("_")[2];
        return this.model.findPairString(sId);
    },
    handleMouseEnterDragging: function(e) {
        this.bWasSimpleClick = false;
        var td = e.currentTarget;
        var model = this.modelFromTD(td);
        var originalSel = model.get(selected);

        var toSet = !this.bOriginalSelected;
        model.set('selected', toSet);

        if (originalSel !== toSet);
        model.toggle('custom');
        this.fFixCustomBorders();

    },
    handleMousedown: function(e) {
        var td = e.currentTarget;
        var table = e.delegateTarget;
        var oView = this;
        var model = this.modelFromTD(td);

        bNewVal = model.toggle('selected');
        model.toggle('custom');

        this.bOriginalSelected = !bNewVal;
        this.bWasSimpleClick = true;

        this.$('td').on('mouseenter', function(e) {
            oView.bWasSimpleClick = false;
            var td = e.currentTarget;
            var model = oView.modelFromTD(td);
            var originalSel = model.get('selected');

            var toSet = !oView.bOriginalSelected;
            model.set('selected', toSet);

            if (originalSel !== toSet)
                model.toggle('custom');
            oView.fFixCustomBorders();
        }); //start listening for mousenter while dragging

        $(td).one('mouseup', function() {
            if (oView.bWasSimpleClick)
                oView.model.trigger('finalize');
            oView.fFixCustomBorders();
        });

        $("body").one('mouseup', function() {
            oView.$('td').off('mouseenter');
            if (!oView.bWasSimpleClick)
                oView.model.trigger('finalize');
        });
        oView.fFixCustomBorders();
    },
    fFixCustomBorders: function() {
        this.$('td').removeClass('nbr nbl nbt nbb');
        this.$('td.custom').each(function() {
            var $this = $(this);
            var index = $this.index();
            var parent = $this.parent();

            var next = $this.next();
            var prev = $this.prev();
            var top = parent.prev().children().eq(index);
            var bottom = parent.next().children().eq(index);

            if (next.is('.custom')) {
                $this.addClass('nbr');
                next.addClass('nbl');
            }

            if (prev.is('.custom')) {
                $this.addClass('nbl');
                prev.addClass('nbr');
            }

            if (top.is('.custom')) {
                $this.addClass('nbt');
                top.addClass('nbb');
            }

            if (bottom.is('.custom')) {
                $this.addClass('nbb');
                bottom.addClass('nbt');
            }
        });
    },
    render: function() {
        ////suit offsuit pPair
        var oData = this.renderData;
        var output = Mustache.render(this.template, oData);
        this.el.innerHTML = output; //html(output);
        $(Mustache.render('#{{.}}', this.parent)).append(this.el);
        console.log('RangeTable.js: render called');
    },
    renderData: {
        'class': _.isFunction(this.className) ? this.className() : this.className,
        'id': this.id,
        'row': []
    },
    template: "<table id='{{id}}' class='{{class}}'>\
					<tbody>\
						{{#row}}\
						<tr>\
								{{#.}}\
									<td id='{{id}}' class='{{sClass}}'>\
									{{{innerHtml}}}\
									</td>\
								{{/.}}\
						</tr>\
						{{/row}}\
					</tbody>\
				</table>"
});

module.exports = RangeTableView;

},{"../Core/AWView":10,"./RangeItemView":47,"underscore":67}],53:[function(require,module,exports){
var Backbone = require('backbone');
var nsUI = require('../Core/Ui');

var RangeTypeSelectView = Backbone.View.extend({
    initialize: function() {
        this.listenTo(this.model, "change:value", this.render);
        this.render();
    },
    render: function() {
        var f = this.model.get("fRangeFunction");
        var id = this.model.getScaleIdFromFn(f);
        nsUI.fToggleCheckableMenu($('#' + id), true, true);
    },
    events: {
        "click": "handleClick"
    },
    handleClick: function(e) {
        var fRangeFunction,
            item = $(e.target).parent(),
            bActivated = nsUI.fToggleCheckableMenu(item, true);

        if (bActivated) {
            var id = $(item).attr('id');

            fRangeFunction = this.model.getFnFromScaleId(id);

            this.model.set("fRangeFunction", fRangeFunction);
        }
    }
});

module.exports = RangeTypeSelectView;

},{"../Core/Ui":15,"backbone":64}],54:[function(require,module,exports){



var deckPermutations = function() {
     
    flopYoMama.rangeTable.tableLoop(function() {
    
        }, function(rangeItem) {
            var deck = new Deck();
            var toRemove = new CardList();

            var pair = rangeItem.get('pair'); 
            var representativePair = pair.toArray()[0];

            var heroCard1 = new Card(representativePair[0]), 
                heroCard2 = new Card(representativePair[1]); 
            
            toRemove.add(heroCard1);
            toRemove.add(heroCard2);
            
            var remaining50Cards = deck.getDifference(toRemove);

            if (remaining50Cards.length !== 50 ) {
                throw 'wrong length of remaining50Cards';
            }

            var villainHands = fCombinatorics(remaining50Cards, 2);
            var counter = 1;
            
            
            villainHands.forEach(function(villainHand, i) {

                console.log(
                    heroCard1.toString() + heroCard2.toString() + ' vs ' +
                    villainHand[0].toString() + villainHand[1].toString());
                /*console.log('Progress: ' + ((i+1) / (villainHands.length* 13 * 13)));
                getExactPreflopOdds(heroCard1, heroCard2, villainHand[0], villainHand[1]);
                if((counter) % 13 == 0) {
                   console.log('Progress Dump ' + JSON.stringify(enormousOddsObject));
                }*/

                counter++;
            }); 
            throw "that's enough";
        }
    );

    console.log('DONE ');
    console.log(JSON.stringify(enormousOddsObject));

} 

var getExactPreflopOdds = function(heroCard1, heroCard2, badGuyCard1, badGuyCard2) {
    //this finds exact odds against two specific hands
    
    var deck = new Deck();
    var toRemove = new CardList();

    //sort the cards inside the hands to avoid duplicates
    var first = heroCard1.get('rank') > heroCard2.get('rank') ? heroCard1 : heroCard2;
    var second = heroCard1.get('rank') > heroCard2.get('rank') ? heroCard2 : heroCard1;
    var third = badGuyCard1.get('rank') > badGuyCard2.get('rank') ?  badGuyCard1: badGuyCard2;
    var fourth = badGuyCard1.get('rank') > badGuyCard2.get('rank') ?  badGuyCard2: badGuyCard1;

    toRemove.add(first);
    toRemove.add(second);
    toRemove.add(third);
    toRemove.add(fourth);

    var key = fGetKeyFromHandList(toRemove);

    if(fAlreadyHasKey(key)) {
        return;
    };

    var remaining = deck.getDifference(toRemove, true);
    var boards = fCombinatorics(remaining, 5);

    console.log("Get exact odds for key: " + key);

    var board, heroHand, badGuyHand, wins = 0, losses=0, draws=0;

    for(var i=0; i<boards.length; i++) {
        board = boards[i];
        heroHand = [heroCard1.attributes, heroCard2.attributes].concat(board);
        badGuyHand = [badGuyCard1.attributes, badGuyCard2.attributes].concat(board);

        heroHand = nsHand.fGetBestHand(heroHand);
        badGuyHand = nsHand.fGetBestHand(badGuyHand);

        winRecord = nsHand.fCompareHand(heroHand, badGuyHand) * -1;

        if(winRecord > 0) {
            wins++;
        } else if(winRecord < 0) {
            losses++;
        } else {
            draws++;
        }

    }
    
    var results = [wins/boards.length, draws/boards.length, losses/boards.length]; 
    
    enormousOddsObject[key] = results;

    console.log('results ' + key + ' ' + JSON.stringify(results));

};



},{}],55:[function(require,module,exports){

var SettingsModel = require('./Settings');
var SettingsView = require('./SettingsView');
var $ = require('jquery');
$(function() {
    var sm = new SettingsModel();
    var sv = new SettingsView({
        model: sm,
        el: $('#settings_modal .modal-body')[0]
    });
    sv.render();
});
},{"./Settings":58,"./SettingsView":59,"jquery":65}],56:[function(require,module,exports){
"use strict"
var AWView = require('../Core/AWView');
var LinkEditorView = AWView.extend({
    initialize: function() {
        var that = this;
        this.listenTo(flopYoMama.knownCards, "finalize", function() {
            this.setFromRoute();
        });

        $('#lg_display').keyup(function() {
            that.updateFields();
        });

        $('#lg_display').change(function() {
            that.updateFields();
        });
        this.setFromRoute();

    },
    updateFields: function() {

        var linkText = '<a href="' + location.href + '">' +
            $('#lg_display').val() +
            '</a>';

        $('#lg_code').text(linkText).html();

    },
    setFromRoute: function() {
        //set the display text from the route
        var prefix = 'FYM: ',
            oHand = flopYoMama.knownCards.get('hand'),
            oBoard = flopYoMama.knownCards.get('board'),
            display;

        if (oHand.length > 0 || oBoard.length > 0) {
            display = prefix + oHand.toDisplayString() + ', ' +
                oBoard.toDisplayString();
        } else {
            display = "FlopYoMama";
        }

        $('#lg_display').val(display);

        this.updateFields();
        //lg_preview, lg_code
    }
});

/*$(function() {
    new LinkEditorView();
});*/

module.exports = LinkEditorView;

},{"../Core/AWView":10}],57:[function(require,module,exports){
nsPrefs = {};

nsPrefs.nsConst = {};

nsPrefs.Preference = function(oDefault, sDescription, fDrawControl) {
    var oValue = null;
    this.fGet = function() {
        if (oValue !== null)
            return oValue;
        else
            return oDefault; //here we should evaluate oDefault if it is a function
    };

    this.fSet = function(val) {
        oValue = val;
    };
};

nsPrefs.oAutomaticSearch = new nsPrefs.Preference(true, 'Long searches are started automatically, rather than by button press');


nsPrefs.nsConst.BAR_GRAPHS = 0;

nsPrefs.nsConst.PIE_GRAPHS = 1;

nsPrefs.oGraphType = new nsPrefs.Preference(nsPrefs.nsConst.PIE_GRAPHS, 'Pie charts are yummy.');
},{}],58:[function(require,module,exports){
"use strict"
var AWModel = require('../Core/AWModel');
var nsUtil = require('../Core/Util');
var SettingsModel = AWModel.extend({
    initialize: function() {

        //four colors
        var clFourColors = "four_color";
        this.on('change:fourColors', function() {
            var fc = this.get('fourColors');
            if (fc) {
                $('body').addClass(clFourColors);
            } else {
                $('body').removeClass(clFourColors);
            }

            nsUtil.fSetLocalStorage(clFourColors, fc);
            this.generateDataURI();
        });

        this.set('fourColors', nsUtil.fGetLocalStorage(clFourColors));
    },
    generateDataURI: function() {
        var json = nsUtil.fExportLocalStorage();

        var href = "data:application/json;charset=UTF-8," +
            encodeURIComponent(json);
        this.set('exportURI', href);
    }
});
module.exports = SettingsModel;

},{"../Core/AWModel":9,"../Core/Util":16}],59:[function(require,module,exports){
var Backbone = require('backbone');

var SettingsView = Backbone.View.extend({
    initialize: function() {
        var that = this;
        //bind here because the backbone events are incompatible
        //with the bootstrap checkboxes
        $('body').on('click', '.four_colors', function() {
            that.toggleFourColors();
            console.log('toggle four colors');
        });

        //when we show the dialog, we generate the datauri	
        $('body').on('show.bs.modal', '#settings_modal', function() {
            that.model.generateDataURI();
        });

        this.listenTo(this.model, 'change:exportURI', function() {
            $('#export_btn').attr('href', this.model.get('exportURI'));
            console.log('listenTo model change:exportURI');
        });

    },
    template: '<form class="settings">' +
        '<div class="checkbox four_colors">' +
        '<label>' +
        '<input type="checkbox" {{{checked}}}>' +
        'Four Colors' +
        '</label>' +
        '</div>' +
        '<div class="form-group">' +
        '<label for="tools_import">Import Data</label>' +
        '<textarea id="tools_import" class="form-control">' +
        '</textarea>' +
        '<button id="import_btn" class="btn" type="button">Import Data <span class="glyphicon glyphicon-upload"></span></button>' +
        '</div>' +
        '<div class="form-group">' +
        '<a class="btn" href="{{{dataURI}}}" id="export_btn"' +
        'download="flopYoMama.json" type="a">' +
        'Export Data' +
        '<span class="glyphicon glyphicon-download"></span>' +
        '</button>' +
        '</div>' +
        '</form>',
    render: function() {
        var checked = this.model.get('fourColors') ? 'checked' : '';
        var html = Mustache.render(this.template, {
            'checked': checked,
            'dataURI': this.model.get('exportURI')
        });
        this.$el.html(html);
    },
    events: {
        'click #import_btn': 'importData',
    },
    toggleFourColors: function() {
        this.model.set('fourColors', $('.four_colors input').is(':checked'));
    },
    importData: function() {
        var val = $('#tools_import').val();
        try {
            nsUtil.fImportLocalStorage(val);
            alert('Data successfully imported.');
        } catch (e) {
            alert('Data import failed. Please paste exported data in the text area.');
        }
    }
});

module.exports = SettingsView;
},{"backbone":64}],60:[function(require,module,exports){
var nsRange = require('../Range/RangeLibrary');
var nsUtil = require('../Core/Util');
var Backbone = require('backbone');
var _ = require('underscore');

var Slider = Backbone.Model.extend({
    defaults: {
        value: 18,
        fRangeFunction: nsRange.getSlanskyFromPercent,
        max: 50,
        min: 0
    },
    initialize: function() {
        var fRangeFunction = null;
        var rangeFunctionStored = nsUtil.fGetLocalStorage("range_type");

        var fRangeFunction = this.getFnFromScaleId(rangeFunctionStored);

        if (fRangeFunction) {
            this.set("fRangeFunction", fRangeFunction);
        }

        this.on('change:value', function() {
            var value = this.get('value');
            if (value > this.max)
                this.set({
                    'value': this.max
                });
            else if (value < this.min)
                this.set({
                    'value': this.min
                });
        });

        this.on('change:fRangeFunction', function() {
            this.trigger('finalize');
            var id,
                f = this.get('fRangeFunction');

            id = this.getScaleIdFromFn(f);

            nsUtil.fSetLocalStorage("range_type", id);
        });

        this.on('finalize', function(value) {
            if (_.isNull(value) || _.isUndefined(value))
                value = this.get('value');

            console.log("range slider finalize with value " + value);

            nsUtil.fSetLocalStorage("range_slider_val", value);

            var oldValue = this.get('value');

            this.set('value', value);
            if (oldValue === value)
                this.trigger('change:value');

        });
    },
    getScaleId: function() {
        var fn = this.get('fRangeFunction');
        return this.getScaleIdFromFn(fn);
    },
    getScaleIdFromFn: function(fn) {
        return fn === nsRange.getStatisticalFromPercent ? "statistical" : "sklansky";
    },
    getFnFromScaleId: function(id) {
        return id === "statistical" ? nsRange.getStatisticalFromPercent : nsRange.getSlanskyFromPercent;
    }
});

module.exports = Slider;

},{"../Core/Util":16,"../Range/RangeLibrary":48,"backbone":64,"underscore":67}],61:[function(require,module,exports){
var Backbone = require('backbone');
var noUiSlider = require('nouislider');

var SliderView = Backbone.View.extend({
    initialize: function() {
        var that = this;
        
        var slider = noUiSlider.create(this.el, {
            start: that.model.get('value'),
            connect: [true, false],
            range: {
                min: that.model.get('min'),
                max: that.model.get('max')
            },/*
            pips: { // Show a scale with the slider
                mode: 'steps',
                stepped: true,
                density: 10 
            },*/ 
            tooltips: false
        }); 
        
        //todo add something like debounce
        slider.on('update', function(values) {
            that.model.set({
                value: values[0] 
            });
        });        

        slider.on('end', function(values) {
            that.model.trigger('finalize', values[0]);
        });        

        this.listenTo(this.model, "change:value", this.render);
        this.on('update', this.update);
    },
    handle: null,
    handleParent: null,
    bg: null,
    render: function() {
        /*var handleLeft = this.handle.style.left;
        var valToSet =  100.0 - parseFloat(handleLeft) + '%';
        this.bg.style.right = valToSet; //('right',valToSet);*/
        var value = this.model.get('value');
        $("#range_slider_val").html(value + '%');
    
    },
    update: function(value) { //changing the slider programatically
        if (typeof value == "undefined")
            value = this.model.get("value");
        //nsUtil.fLog('manual SET trigger with value ' +this.model.get('value'));
        this.slider.set(value);    
    }
});

module.exports = SliderView;

},{"backbone":64,"nouislider":66}],62:[function(require,module,exports){

var _ = require('underscore');
var nsMath = require('../Core/Math');
var nsHand = require('../Hand/NSHand');
var nsConvert = require('../Core/Convert');

module.exports = function(self) {
    var nsWorker = {};
    self.addEventListener('message', function(e) {
        var data = e.data;
        switch (data.cmd) {
            case 'start':
                //self.postMessage({'command recieved start');
                //importScripts("../../Lib/underscore/underscore-min.js", '../../Core/Math.js', '../../Core/Hand.js', '../../Core/Convert.js');


                nsWorker.fCalculateBoards(data.aoStartingHands, data.aKnownCards, data.aUnknownCards, data.aFixedBoardCards, data.numberOfOpenBoardHandPlaces, data.oFilter);
                break;
            case 'stop':
                self.close(); // Terminates the worker.
                break;
            default:
                self.postMessage('Unknown command: ' + data.msg);
        }
    }, false);

    //aoStartingHands = array of CardPair objects (like AAs)
    nsWorker.fCalculateBoards = function(aoStartingHands, aKnownCards, aUnknownCards, aFixedBoardCards, numberOfOpenBoardHandPlaces, oFilter) {

        var startTime = new Date().getTime();
        var totalCombinations = nsMath.combine(aUnknownCards.length, numberOfOpenBoardHandPlaces);
        var numberDone = 0;

        var oNsHand = nsHand;
        //calculate length of operation
        var allStartingPairs = [];
        var startLength = aoStartingHands.length;
        var totalCombinationsMultiplier = 0;
        var oPair, i;

        for (i = 0; i < startLength; i++) {
            oPair = aoStartingHands[i].oPair;
            var actualPairs = aoStartingHands[i].aPair; //now we have an array of villain's starting hands
            allStartingPairs.push(actualPairs);
            totalCombinationsMultiplier += actualPairs.length;
        }

        var approxTotalComb = totalCombinations * totalCombinationsMultiplier / 1.14; //from empirical testing 1.139

        //var combinatoricsStartTime= new Date().getTime(); COMBINATORICS FAST
        var aBoards = nsMath.combine(aUnknownCards, numberOfOpenBoardHandPlaces);

        if (aBoards.length === 0) { //board is full but we want to go once through the loop anyway {
            aBoards[0] = [];
        }

        var iCountWon = 0,
            iCountLost = 0,
            iCountDraw = 0;

        var oHandStatDic = {};
        var oVillainStaticDic = {};

        var oResultsCache = {}; //results cache

        var boardsLength = aBoards.length;

        //self.fPostConsole('board length ' + boardsLength);
        for (var iBoard = boardsLength - 1; iBoard >= 0; iBoard--) {
            //now loop through each opponent hand for each board
            var aCurrentKnown = aKnownCards;
            aCurrentKnown = aCurrentKnown.concat(aBoards[iBoard]);

            //instead of this, loop through the pair objects themselves
            //if the pair has a flush possibility with the given board, loop through all boards
            //if the pair has no flush possibility with the given board, check it once against hero
            //then multiply the results time the number of pairs in the pair type (minus the number which contain dead cards)
            var oHeroHand = oNsHand.fGetBestHand(aCurrentKnown);

            var realBoard = aFixedBoardCards.concat(aBoards[iBoard]); //board after concating speculative board 
            var aVillainHand, oVillainHand, iWon;

            var iWonMagnitude, sPair; //numbe of won lost or drawn combinations

            var startingHandLengths = aoStartingHands.length;

            var boardFlushPossibility;

            for (var iVillainPair = startingHandLengths - 1; iVillainPair >= 0; iVillainPair--) {
                //get the villain pair
                oPair = aoStartingHands[iVillainPair].oPair;
                sPair = aoStartingHands[iVillainPair].sPair;

                var oPairArray = nsConvert.fFilterCardPairArray(aoStartingHands[iVillainPair].aPair, aCurrentKnown, oFilter[sPair]);

                boardFlushPossibility = nsWorker.getFlushSuitAndNumber(realBoard, oPair);

                //split oPairArray into those which can hit flush and those which cannot
                var oPairCanHitFlush = [];
                var oPairCannotHitFlush = [];
                var oPairLength = oPairArray.length;
                for (i = 0; i < oPairLength; i++) {
                    var pair = oPairArray[i];
                    var numberOfSuit = 0;
                    if (pair[0].suit === boardFlushPossibility.flushSuit)
                        numberOfSuit++;
                    if (pair[1].suit === boardFlushPossibility.flushSuit)
                        numberOfSuit++;

                    if (numberOfSuit + boardFlushPossibility.numberFound >= 5) //flush there
                        oPairCanHitFlush.push(pair);
                    else
                        oPairCannotHitFlush.push(pair); //for test only pair can hit flush
                }

                iWonMagnitude = 0;

                var iWinCountLocal = 0,
                    iDrawCountLocal = 0,
                    iLossCountLocal = 0;

                if (oPairCannotHitFlush.length > 0) { //now we don't have to look for flushes, checking the first pair of this suffices

                    //standardize all 7 cards
                    iWonMagnitude = oPairCannotHitFlush.length;

                    aVillainHand = [];
                    aVillainHand = oPairCannotHitFlush[0].concat(aFixedBoardCards).concat(aBoards[iBoard]);

                    oVillainHand = oNsHand.fGetBestHand(aVillainHand);
                    if (typeof oVillainHand === "undefined")
                        fLogCards(aVillainHand, 'Something went wrong here 135');

                    iWon = oNsHand.fCompareHand(oHeroHand, oVillainHand) * -1;
                    iWinCountLocal = iWon > 0 ? iWonMagnitude : iWinCountLocal;
                    iDrawCountLocal = iWon === 0 ? iWonMagnitude : iDrawCountLocal;
                    iLossCountLocal = iWon < 0 ? iWonMagnitude : iLossCountLocal;

                    iCountWon += iWinCountLocal;
                    iCountDraw += iDrawCountLocal;
                    iCountLost += iLossCountLocal;
                    numberDone += iWonMagnitude;

                    fAddToRecordDic(oVillainStaticDic, oNsHand.fHandToString(oVillainHand), -1 * iWon, iWonMagnitude);
                    fAddToRecordDic(oHandStatDic, oNsHand.fHandToString(oHeroHand), iWon, iWonMagnitude, true);


                } //now loop through those which do hit flush

                for (i = 0; i < oPairCanHitFlush.length; i++) {
                    //evaluate villain hand

                    aVillainHand = [];
                    aVillainHand = oPairCanHitFlush[i].concat(aFixedBoardCards).concat(aBoards[iBoard]);
                    oVillainHand = oNsHand.fGetBestHand(aVillainHand);

                    iWon = oNsHand.fCompareHand(oHeroHand, oVillainHand) * -1;
                    iWinCountLocal = iWon > 0 ? ++iWinCountLocal : iWinCountLocal;
                    iDrawCountLocal = iWon === 0 ? ++iDrawCountLocal : iDrawCountLocal;
                    iLossCountLocal = iWon < 0 ? ++iLossCountLocal : iLossCountLocal;

                    iCountWon = iWon > 0 ? ++iCountWon : iCountWon;
                    iCountDraw = iWon === 0 ? ++iCountDraw : iCountDraw;
                    iCountLost = iWon < 0 ? ++iCountLost : iCountLost;
                    numberDone++;

                    fAddToRecordDic(oVillainStaticDic, oNsHand.fHandToString(oVillainHand), -1 * iWon, 1);
                    fAddToRecordDic(oHandStatDic, oNsHand.fHandToString(oHeroHand), iWon, 1, true);

                }
            }
            var currentPercent = numberDone / approxTotalComb;

            if (numberDone % 500 === 0) //only post 1500 rounds
                self.fPostProgress({
                    iCountWon: iCountWon,
                    iCountLost: iCountLost,
                    iCountDraw: iCountDraw,
                    total: numberDone,
                    currentPercent: currentPercent
                });

        }

        var endTime = new Date().getTime();
        var consoleStringReport = "";
        fPostConsole("operation took " + (endTime - startTime) / 1000.0 + 's');
        fPostConsole("approximation of total " + approxTotalComb + ' real total ' + numberDone);
        self.fPostDone({
            iCountWon: iCountWon,
            iCountLost: iCountLost,
            iCountDraw: iCountDraw,
            total: numberDone,
            oHeroStat: oHandStatDic,
            oVillainStat: oVillainStaticDic
        });
    };

    var fLogCards = function(aCards, message) {
        if (!message)
            message = 0;
        var consoleMessage = message + ' logged hand';
        for (var i = 0; i < aCards.length; i++) {
            consoleMessage = consoleMessage + ' ' + nsConvert.rankNumberToChard(aCards[i].rank) + nsConvert.suitToDisplayChar(aCards[i].suit) + ' ';
        }
        fPostConsole(consoleMessage);
    };

    var fCardsToKey = function(aCards) {
        var sReturn = 'k_';
        for (var i = 0; i < aCards.length; i++) {
            sReturn = sReturn + nsConvert.rankNumberToChard(aCards[i].rank) + aCards[i].suit;
        }
        return sReturn;
    };

    var fLogPairs = function(aPairs, message) {
        if (!message)
            message = 0;
        var consoleMessage = message + ' logged hand';
        for (var i = 0; i < aPairs.length; i++) {
            consoleMessage = consoleMessage + ' ' + nsConvert.rankNumberToChard(aPairs[i][0].rank) +
                nsConvert.suitToDisplayChar(aPairs[i][0].suit) + ' ' +
                nsConvert.rankNumberToChard(aPairs[i][1].rank) + nsConvert.suitToDisplayChar(aPairs[i][1].suit);
        }
        fPostConsole(consoleMessage);
    };

    var fAddToRecordDic = function(oHandStatDic, sHandString, iWon, magnitude, bHero) {
        if (typeof(oHandStatDic[sHandString]) === 'undefined') {
            oHandStatDic[sHandString] = {};
            oHandStatDic[sHandString].wonCount = 0;
            oHandStatDic[sHandString].drawCount = 0;
            oHandStatDic[sHandString].lossCount = 0;
        }
        //if(isNaN(magnitude) || isNaN(iWon) || typeof(sHandString) === 'undefined' || ! isNaN(parseInt(sHandString)))
        //	fPostConsole('SOMETHING WENT WRONG');
        //oHandStatDic[fHandToString(oHeroHand)].count++;
        if (iWon > 0)
            oHandStatDic[sHandString].wonCount += magnitude;
        else if (iWon === 0)
            oHandStatDic[sHandString].drawCount += magnitude;
        else
            oHandStatDic[sHandString].lossCount += magnitude;

    };

    var fGetStartingHandsFromRangeArray = function(allStartingPairs, aKnownHands) {
        var filteredStartingPairs = [];
        var startLength = allStartingPairs.length;
        var oPair, actualPairs;
        for (var i = 0; i < startLength; i++) {
            oPair = new Pair(pairString);
            actualPairs = oPair.toArray(aKnownHands);
            //this is multidimensional array
            filteredStartingPairs = filteredStartingPairs.concat(actualPairs);
        }
        return filteredStartingPairs;
    };


    var fPostConsole = function(sMessage) {
        self.postMessage({
            type: 'console',
            msg: sMessage
        });
    };

    var fPostDone = function(oData) {
        self.postMessage({
            type: 'done',
            msg: oData
        });
        // self.close(); // Terminates the worker. BREAKS FIREFOX
    };

    var fPostProgress = function(sMessage) {
        self.postMessage({
            type: 'progress',
            msg: sMessage
        });
    };

    //return array [num clubs, diamnds, hearts, spaids 
    nsWorker.getSuitNumbers = function(board) {
        //count the max number of one suit on the board
        var aSuitNumbers = [0, 0, 0, 0]; //num of clubs, num of diamonds, num of hearts, num of spaids
        //now we have to get the real board instead of the board without the known cards
        var boardLength = board.length;

        for (i = 0; i < boardLength; i++) {
            aSuitNumbers[board[i].suit - 1]++;
        }

        return aSuitNumbers;
    };

    //check flush possibilities
    nsWorker.getFlushSuitAndNumber = function(board, oPair) {
        var aSuitNumbers = nsWorker.getSuitNumbers(board);

        var minForFlush = 4;

        if (oPair.suited)
            minForFlush = 3;

        //find the flush suit
        var flushSuit = -1;
        var foundHowManyOfSuit = 0;
        for (i = 3; i >= 0; i--) {
            if (aSuitNumbers[i] >= minForFlush) {
                flushSuit = i + 1;
                foundHowManyOfSuit = aSuitNumbers[i];
            }
        }

        return {
            flushSuit: flushSuit,
            numberFound: foundHowManyOfSuit
        };
    };
};

},{"../Core/Convert":11,"../Core/Math":13,"../Hand/NSHand":22,"underscore":67}],63:[function(require,module,exports){

var _ = require('underscore');
var nsMath = require('../Core/Math');
var nsDrawingHand = require('../Hand/DrawingHand');
var nsConvert = require('../Core/Convert');
var nsFilter = require('../Filter/Filter');
var nsUtil = require('../Core/Util');

module.exports = function(self) {

    var nsWorkerTextures = {};

    self.addEventListener('message', function(e) {
        var data = e.data;
        switch (data.cmd) {
            case 'start':
                try {
                    fPostConsole('STARTING TEXTURE WORKER');
                    nsWorkerTextures.fCalculateBoards(data.aoStartingHands, data.aKnownCards, data.aFixedBoardCards, data.oFilter);
                } catch (error) {
                    fPostConsole('ERROR' + error.toString());
                }

                break;
            case 'stop':
                self.close(); // Terminates the worker.
                break;
            default:
                self.postMessage('Unknown command: ' + data.msg);
        }
    }, false);


    nsWorkerTextures.fCalculateBoards = function(aoStartingHands, aKnownCards, aFixedBoardCards, oFilter) {
        var startTime = new Date().getTime();
        var numberDone = 0;
        var oVillainStaticDic = {};
        var oPairLengthDic = {};
        var oFilterRecord = [];
        fPostConsole('TEST TEST TEST');
        //fPostConsole('TEST filter' + JSON.stringify(oFilter));
        var aCurrentKnown = aKnownCards;
        var startingHandLengths = aoStartingHands.length;
        for (var iVillainPair = startingHandLengths - 1; iVillainPair >= 0; iVillainPair--) {
            //get the villain pair
            var oPair = aoStartingHands[iVillainPair].oPair;
            var sPair = aoStartingHands[iVillainPair].sPair;
            oFilterRecord[sPair] = [];

            var oPairArray = nsConvert.fFilterCardPairArray(aoStartingHands[iVillainPair].aPair, aCurrentKnown);

            var iPairLength = oPairArray.length;

            for (var i = 0; i < oPairArray.length; i++) {

                var aVillainHand = [];
                aVillainHand = oPairArray[i].concat(aFixedBoardCards);
                var oVillainHand;
                if (oFilter) {
                    //this should actually return the drawing hand, so i don't have to evaluate it again
                    var bHit = nsFilter.nsEvaluate.fEvaluateFilter(oFilter, aVillainHand);
                    if (!bHit) { //did not pass filter
                        oFilterRecord[sPair].push(oPairArray[i]);
                        continue;
                    }
                    oVillainHand = nsFilter.nsEvaluate.oCurrentHand;
                } else
                    oVillainHand = nsDrawingHand.fGetDrawingHands(aVillainHand);

                var sVillainHand = nsDrawingHand.fHandToString(oVillainHand);

                var aSplit = sVillainHand.split("-");

                for (j = 0; j < aSplit.length; j++) {
                    aSplit[j] = aSplit[j].trim();
                    nsWorkerTextures.fAddToRecordDic(oVillainStaticDic, aSplit[j], sPair);
                    numberDone++;
                }
            }

            oPairLengthDic[sPair] = iPairLength;
        }
        fPostDone({
            oVillainStat: oVillainStaticDic,
            count: numberDone,
            oPairLengthDic: oPairLengthDic,
            oFilterRecord: oFilterRecord
        });
    };

    nsWorkerTextures.fAddToRecordDic = function(oVillainStatDic, sHandString, sPairString, iPairCount) {
        if (typeof(oVillainStatDic[sHandString]) === 'undefined') {
            oVillainStatDic[sHandString] = {
                oPairRecord: {},
                count: 0
            };
        }

        if (typeof(oVillainStatDic[sHandString].oPairRecord[sPairString]) === 'undefined') {
            oVillainStatDic[sHandString].oPairRecord[sPairString] = 1;
        } else {
            oVillainStatDic[sHandString].oPairRecord[sPairString]++; //track the pairs for each hand type	
        }

        oVillainStatDic[sHandString].count++;
    };


    var fPostConsole = function(sMessage) {
        self.postMessage({
            type: 'console',
            msg: sMessage
        });
    };

    var fPostDone = function(oData) {
        self.postMessage({
            type: 'done',
            msg: oData
        });
        self.close(); // Terminates the worker. 
    };

    var fPostProgress = function(sMessage) {
        self.postMessage({
            type: 'progress',
            msg: sMessage
        });
    };
};

},{"../Core/Convert":11,"../Core/Math":13,"../Core/Util":16,"../Filter/Filter":18,"../Hand/DrawingHand":20,"underscore":67}],64:[function(require,module,exports){
(function (global){
//     Backbone.js 1.3.3

//     (c) 2010-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(factory) {

  // Establish the root object, `window` (`self`) in the browser, or `global` on the server.
  // We use `self` instead of `window` for `WebWorker` support.
  var root = (typeof self == 'object' && self.self === self && self) ||
            (typeof global == 'object' && global.global === global && global);

  // Set up Backbone appropriately for the environment. Start with AMD.
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'jquery', 'exports'], function(_, $, exports) {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Backbone.
      root.Backbone = factory(root, exports, _, $);
    });

  // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore'), $;
    try { $ = require('jquery'); } catch (e) {}
    factory(root, exports, _, $);

  // Finally, as a browser global.
  } else {
    root.Backbone = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));
  }

})(function(root, Backbone, _, $) {

  // Initial Setup
  // -------------

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create a local reference to a common array method we'll want to use later.
  var slice = Array.prototype.slice;

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '1.3.3';

  // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
  // the `$` variable.
  Backbone.$ = $;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PATCH"`, `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... this will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Proxy Backbone class methods to Underscore functions, wrapping the model's
  // `attributes` object or collection's `models` array behind the scenes.
  //
  // collection.filter(function(model) { return model.get('age') > 10 });
  // collection.each(this.addView);
  //
  // `Function#apply` can be slow so we use the method's arg count, if we know it.
  var addMethod = function(length, method, attribute) {
    switch (length) {
      case 1: return function() {
        return _[method](this[attribute]);
      };
      case 2: return function(value) {
        return _[method](this[attribute], value);
      };
      case 3: return function(iteratee, context) {
        return _[method](this[attribute], cb(iteratee, this), context);
      };
      case 4: return function(iteratee, defaultVal, context) {
        return _[method](this[attribute], cb(iteratee, this), defaultVal, context);
      };
      default: return function() {
        var args = slice.call(arguments);
        args.unshift(this[attribute]);
        return _[method].apply(_, args);
      };
    }
  };
  var addUnderscoreMethods = function(Class, methods, attribute) {
    _.each(methods, function(length, method) {
      if (_[method]) Class.prototype[method] = addMethod(length, method, attribute);
    });
  };

  // Support `collection.sortBy('attr')` and `collection.findWhere({id: 1})`.
  var cb = function(iteratee, instance) {
    if (_.isFunction(iteratee)) return iteratee;
    if (_.isObject(iteratee) && !instance._isModel(iteratee)) return modelMatcher(iteratee);
    if (_.isString(iteratee)) return function(model) { return model.get(iteratee); };
    return iteratee;
  };
  var modelMatcher = function(attrs) {
    var matcher = _.matches(attrs);
    return function(model) {
      return matcher(model.attributes);
    };
  };

  // Backbone.Events
  // ---------------

  // A module that can be mixed in to *any object* in order to provide it with
  // a custom event channel. You may bind a callback to an event with `on` or
  // remove with `off`; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {};

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Iterates over the standard `event, callback` (as well as the fancy multiple
  // space-separated events `"change blur", callback` and jQuery-style event
  // maps `{event: callback}`).
  var eventsApi = function(iteratee, events, name, callback, opts) {
    var i = 0, names;
    if (name && typeof name === 'object') {
      // Handle event maps.
      if (callback !== void 0 && 'context' in opts && opts.context === void 0) opts.context = callback;
      for (names = _.keys(name); i < names.length ; i++) {
        events = eventsApi(iteratee, events, names[i], name[names[i]], opts);
      }
    } else if (name && eventSplitter.test(name)) {
      // Handle space-separated event names by delegating them individually.
      for (names = name.split(eventSplitter); i < names.length; i++) {
        events = iteratee(events, names[i], callback, opts);
      }
    } else {
      // Finally, standard events.
      events = iteratee(events, name, callback, opts);
    }
    return events;
  };

  // Bind an event to a `callback` function. Passing `"all"` will bind
  // the callback to all events fired.
  Events.on = function(name, callback, context) {
    return internalOn(this, name, callback, context);
  };

  // Guard the `listening` argument from the public API.
  var internalOn = function(obj, name, callback, context, listening) {
    obj._events = eventsApi(onApi, obj._events || {}, name, callback, {
      context: context,
      ctx: obj,
      listening: listening
    });

    if (listening) {
      var listeners = obj._listeners || (obj._listeners = {});
      listeners[listening.id] = listening;
    }

    return obj;
  };

  // Inversion-of-control versions of `on`. Tell *this* object to listen to
  // an event in another object... keeping track of what it's listening to
  // for easier unbinding later.
  Events.listenTo = function(obj, name, callback) {
    if (!obj) return this;
    var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
    var listeningTo = this._listeningTo || (this._listeningTo = {});
    var listening = listeningTo[id];

    // This object is not listening to any other events on `obj` yet.
    // Setup the necessary references to track the listening callbacks.
    if (!listening) {
      var thisId = this._listenId || (this._listenId = _.uniqueId('l'));
      listening = listeningTo[id] = {obj: obj, objId: id, id: thisId, listeningTo: listeningTo, count: 0};
    }

    // Bind callbacks on obj, and keep track of them on listening.
    internalOn(obj, name, callback, this, listening);
    return this;
  };

  // The reducing API that adds a callback to the `events` object.
  var onApi = function(events, name, callback, options) {
    if (callback) {
      var handlers = events[name] || (events[name] = []);
      var context = options.context, ctx = options.ctx, listening = options.listening;
      if (listening) listening.count++;

      handlers.push({callback: callback, context: context, ctx: context || ctx, listening: listening});
    }
    return events;
  };

  // Remove one or many callbacks. If `context` is null, removes all
  // callbacks with that function. If `callback` is null, removes all
  // callbacks for the event. If `name` is null, removes all bound
  // callbacks for all events.
  Events.off = function(name, callback, context) {
    if (!this._events) return this;
    this._events = eventsApi(offApi, this._events, name, callback, {
      context: context,
      listeners: this._listeners
    });
    return this;
  };

  // Tell this object to stop listening to either specific events ... or
  // to every object it's currently listening to.
  Events.stopListening = function(obj, name, callback) {
    var listeningTo = this._listeningTo;
    if (!listeningTo) return this;

    var ids = obj ? [obj._listenId] : _.keys(listeningTo);

    for (var i = 0; i < ids.length; i++) {
      var listening = listeningTo[ids[i]];

      // If listening doesn't exist, this object is not currently
      // listening to obj. Break out early.
      if (!listening) break;

      listening.obj.off(name, callback, this);
    }

    return this;
  };

  // The reducing API that removes a callback from the `events` object.
  var offApi = function(events, name, callback, options) {
    if (!events) return;

    var i = 0, listening;
    var context = options.context, listeners = options.listeners;

    // Delete all events listeners and "drop" events.
    if (!name && !callback && !context) {
      var ids = _.keys(listeners);
      for (; i < ids.length; i++) {
        listening = listeners[ids[i]];
        delete listeners[listening.id];
        delete listening.listeningTo[listening.objId];
      }
      return;
    }

    var names = name ? [name] : _.keys(events);
    for (; i < names.length; i++) {
      name = names[i];
      var handlers = events[name];

      // Bail out if there are no events stored.
      if (!handlers) break;

      // Replace events if there are any remaining.  Otherwise, clean up.
      var remaining = [];
      for (var j = 0; j < handlers.length; j++) {
        var handler = handlers[j];
        if (
          callback && callback !== handler.callback &&
            callback !== handler.callback._callback ||
              context && context !== handler.context
        ) {
          remaining.push(handler);
        } else {
          listening = handler.listening;
          if (listening && --listening.count === 0) {
            delete listeners[listening.id];
            delete listening.listeningTo[listening.objId];
          }
        }
      }

      // Update tail event if the list has any events.  Otherwise, clean up.
      if (remaining.length) {
        events[name] = remaining;
      } else {
        delete events[name];
      }
    }
    return events;
  };

  // Bind an event to only be triggered a single time. After the first time
  // the callback is invoked, its listener will be removed. If multiple events
  // are passed in using the space-separated syntax, the handler will fire
  // once for each event, not once for a combination of all events.
  Events.once = function(name, callback, context) {
    // Map the event into a `{event: once}` object.
    var events = eventsApi(onceMap, {}, name, callback, _.bind(this.off, this));
    if (typeof name === 'string' && context == null) callback = void 0;
    return this.on(events, callback, context);
  };

  // Inversion-of-control versions of `once`.
  Events.listenToOnce = function(obj, name, callback) {
    // Map the event into a `{event: once}` object.
    var events = eventsApi(onceMap, {}, name, callback, _.bind(this.stopListening, this, obj));
    return this.listenTo(obj, events);
  };

  // Reduces the event callbacks into a map of `{event: onceWrapper}`.
  // `offer` unbinds the `onceWrapper` after it has been called.
  var onceMap = function(map, name, callback, offer) {
    if (callback) {
      var once = map[name] = _.once(function() {
        offer(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
    }
    return map;
  };

  // Trigger one or many events, firing all bound callbacks. Callbacks are
  // passed the same arguments as `trigger` is, apart from the event name
  // (unless you're listening on `"all"`, which will cause your callback to
  // receive the true name of the event as the first argument).
  Events.trigger = function(name) {
    if (!this._events) return this;

    var length = Math.max(0, arguments.length - 1);
    var args = Array(length);
    for (var i = 0; i < length; i++) args[i] = arguments[i + 1];

    eventsApi(triggerApi, this._events, name, void 0, args);
    return this;
  };

  // Handles triggering the appropriate event callbacks.
  var triggerApi = function(objEvents, name, callback, args) {
    if (objEvents) {
      var events = objEvents[name];
      var allEvents = objEvents.all;
      if (events && allEvents) allEvents = allEvents.slice();
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, [name].concat(args));
    }
    return objEvents;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
    }
  };

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Allow the `Backbone` object to serve as a global event bus, for folks who
  // want global "pubsub" in a convenient place.
  _.extend(Backbone, Events);

  // Backbone.Model
  // --------------

  // Backbone **Models** are the basic data object in the framework --
  // frequently representing a row in a table in a database on your server.
  // A discrete chunk of data and a bunch of useful, related methods for
  // performing computations and transformations on that data.

  // Create a new model with the specified attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var attrs = attributes || {};
    options || (options = {});
    this.cid = _.uniqueId(this.cidPrefix);
    this.attributes = {};
    if (options.collection) this.collection = options.collection;
    if (options.parse) attrs = this.parse(attrs, options) || {};
    var defaults = _.result(this, 'defaults');
    attrs = _.defaults(_.extend({}, defaults, attrs), defaults);
    this.set(attrs, options);
    this.changed = {};
    this.initialize.apply(this, arguments);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // The value returned during the last failed validation.
    validationError: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // The prefix is used to create the client id which is used to identify models locally.
    // You may want to override this if you're experiencing name clashes with model ids.
    cidPrefix: 'c',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Proxy `Backbone.sync` by default -- but override this if you need
    // custom syncing semantics for *this* particular model.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      return _.escape(this.get(attr));
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // Special-cased proxy to underscore's `_.matches` method.
    matches: function(attrs) {
      return !!_.iteratee(attrs, this)(this.attributes);
    },

    // Set a hash of model attributes on the object, firing `"change"`. This is
    // the core primitive operation of a model, updating the data and notifying
    // anyone who needs to know about the change in state. The heart of the beast.
    set: function(key, val, options) {
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      var attrs;
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Extract attributes and options.
      var unset      = options.unset;
      var silent     = options.silent;
      var changes    = [];
      var changing   = this._changing;
      this._changing = true;

      if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
      }

      var current = this.attributes;
      var changed = this.changed;
      var prev    = this._previousAttributes;

      // For each `set` attribute, update or delete the current value.
      for (var attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) changes.push(attr);
        if (!_.isEqual(prev[attr], val)) {
          changed[attr] = val;
        } else {
          delete changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      // Update the `id`.
      if (this.idAttribute in attrs) this.id = this.get(this.idAttribute);

      // Trigger all relevant attribute changes.
      if (!silent) {
        if (changes.length) this._pending = options;
        for (var i = 0; i < changes.length; i++) {
          this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
      }

      // You might be wondering why there's a `while` loop here. Changes can
      // be recursively nested within `"change"` events.
      if (changing) return this;
      if (!silent) {
        while (this._pending) {
          options = this._pending;
          this._pending = false;
          this.trigger('change', this, options);
        }
      }
      this._pending = false;
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"`. `unset` is a noop
    // if the attribute doesn't exist.
    unset: function(attr, options) {
      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    },

    // Clear all attributes on the model, firing `"change"`.
    clear: function(options) {
      var attrs = {};
      for (var key in this.attributes) attrs[key] = void 0;
      return this.set(attrs, _.extend({}, options, {unset: true}));
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (attr == null) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var old = this._changing ? this._previousAttributes : this.attributes;
      var changed = {};
      for (var attr in diff) {
        var val = diff[attr];
        if (_.isEqual(old[attr], val)) continue;
        changed[attr] = val;
      }
      return _.size(changed) ? changed : false;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (attr == null || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Fetch the model from the server, merging the response with the model's
    // local attributes. Any changed attributes will trigger a "change" event.
    fetch: function(options) {
      options = _.extend({parse: true}, options);
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        var serverAttrs = options.parse ? model.parse(resp, options) : resp;
        if (!model.set(serverAttrs, options)) return false;
        if (success) success.call(options.context, model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, val, options) {
      // Handle both `"key", value` and `{key: value}` -style arguments.
      var attrs;
      if (key == null || typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options = _.extend({validate: true, parse: true}, options);
      var wait = options.wait;

      // If we're not waiting and attributes exist, save acts as
      // `set(attr).save(null, opts)` with validation. Otherwise, check if
      // the model will be valid when the attributes, if any, are set.
      if (attrs && !wait) {
        if (!this.set(attrs, options)) return false;
      } else if (!this._validate(attrs, options)) {
        return false;
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      var model = this;
      var success = options.success;
      var attributes = this.attributes;
      options.success = function(resp) {
        // Ensure attributes are restored during synchronous saves.
        model.attributes = attributes;
        var serverAttrs = options.parse ? model.parse(resp, options) : resp;
        if (wait) serverAttrs = _.extend({}, attrs, serverAttrs);
        if (serverAttrs && !model.set(serverAttrs, options)) return false;
        if (success) success.call(options.context, model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);

      // Set temporary attributes if `{wait: true}` to properly find new ids.
      if (attrs && wait) this.attributes = _.extend({}, attributes, attrs);

      var method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
      if (method === 'patch' && !options.attrs) options.attrs = attrs;
      var xhr = this.sync(method, this, options);

      // Restore attributes.
      this.attributes = attributes;

      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;
      var wait = options.wait;

      var destroy = function() {
        model.stopListening();
        model.trigger('destroy', model, model.collection, options);
      };

      options.success = function(resp) {
        if (wait) destroy();
        if (success) success.call(options.context, model, resp, options);
        if (!model.isNew()) model.trigger('sync', model, resp, options);
      };

      var xhr = false;
      if (this.isNew()) {
        _.defer(options.success);
      } else {
        wrapError(this, options);
        xhr = this.sync('delete', this, options);
      }
      if (!wait) destroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base =
        _.result(this, 'urlRoot') ||
        _.result(this.collection, 'url') ||
        urlError();
      if (this.isNew()) return base;
      var id = this.get(this.idAttribute);
      return base.replace(/[^\/]$/, '$&/') + encodeURIComponent(id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return !this.has(this.idAttribute);
    },

    // Check if the model is currently in a valid state.
    isValid: function(options) {
      return this._validate({}, _.extend({}, options, {validate: true}));
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
    _validate: function(attrs, options) {
      if (!options.validate || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validationError = this.validate(attrs, options) || null;
      if (!error) return true;
      this.trigger('invalid', this, error, _.extend(options, {validationError: error}));
      return false;
    }

  });

  // Underscore methods that we want to implement on the Model, mapped to the
  // number of arguments they take.
  var modelMethods = {keys: 1, values: 1, pairs: 1, invert: 1, pick: 0,
      omit: 0, chain: 1, isEmpty: 1};

  // Mix in each Underscore method as a proxy to `Model#attributes`.
  addUnderscoreMethods(Model, modelMethods, 'attributes');

  // Backbone.Collection
  // -------------------

  // If models tend to represent a single row of data, a Backbone Collection is
  // more analogous to a table full of data ... or a small slice or page of that
  // table, or a collection of rows that belong together for a particular reason
  // -- all of the messages in this particular folder, all of the documents
  // belonging to this particular author, and so on. Collections maintain
  // indexes of their models, both in order, and for lookup by `id`.

  // Create a new **Collection**, perhaps to contain a specific type of `model`.
  // If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.model) this.model = options.model;
    if (options.comparator !== void 0) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, _.extend({silent: true}, options));
  };

  // Default options for `Collection#set`.
  var setOptions = {add: true, remove: true, merge: true};
  var addOptions = {add: true, remove: false};

  // Splices `insert` into `array` at index `at`.
  var splice = function(array, insert, at) {
    at = Math.min(Math.max(at, 0), array.length);
    var tail = Array(array.length - at);
    var length = insert.length;
    var i;
    for (i = 0; i < tail.length; i++) tail[i] = array[i + at];
    for (i = 0; i < length; i++) array[i + at] = insert[i];
    for (i = 0; i < tail.length; i++) array[i + length + at] = tail[i];
  };

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model) { return model.toJSON(options); });
    },

    // Proxy `Backbone.sync` by default.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Add a model, or list of models to the set. `models` may be Backbone
    // Models or raw JavaScript objects to be converted to Models, or any
    // combination of the two.
    add: function(models, options) {
      return this.set(models, _.extend({merge: false}, options, addOptions));
    },

    // Remove a model, or a list of models from the set.
    remove: function(models, options) {
      options = _.extend({}, options);
      var singular = !_.isArray(models);
      models = singular ? [models] : models.slice();
      var removed = this._removeModels(models, options);
      if (!options.silent && removed.length) {
        options.changes = {added: [], merged: [], removed: removed};
        this.trigger('update', this, options);
      }
      return singular ? removed[0] : removed;
    },

    // Update a collection by `set`-ing a new list of models, adding new ones,
    // removing models that are no longer present, and merging models that
    // already exist in the collection, as necessary. Similar to **Model#set**,
    // the core operation for updating the data contained by the collection.
    set: function(models, options) {
      if (models == null) return;

      options = _.extend({}, setOptions, options);
      if (options.parse && !this._isModel(models)) {
        models = this.parse(models, options) || [];
      }

      var singular = !_.isArray(models);
      models = singular ? [models] : models.slice();

      var at = options.at;
      if (at != null) at = +at;
      if (at > this.length) at = this.length;
      if (at < 0) at += this.length + 1;

      var set = [];
      var toAdd = [];
      var toMerge = [];
      var toRemove = [];
      var modelMap = {};

      var add = options.add;
      var merge = options.merge;
      var remove = options.remove;

      var sort = false;
      var sortable = this.comparator && at == null && options.sort !== false;
      var sortAttr = _.isString(this.comparator) ? this.comparator : null;

      // Turn bare objects into model references, and prevent invalid models
      // from being added.
      var model, i;
      for (i = 0; i < models.length; i++) {
        model = models[i];

        // If a duplicate is found, prevent it from being added and
        // optionally merge it into the existing model.
        var existing = this.get(model);
        if (existing) {
          if (merge && model !== existing) {
            var attrs = this._isModel(model) ? model.attributes : model;
            if (options.parse) attrs = existing.parse(attrs, options);
            existing.set(attrs, options);
            toMerge.push(existing);
            if (sortable && !sort) sort = existing.hasChanged(sortAttr);
          }
          if (!modelMap[existing.cid]) {
            modelMap[existing.cid] = true;
            set.push(existing);
          }
          models[i] = existing;

        // If this is a new, valid model, push it to the `toAdd` list.
        } else if (add) {
          model = models[i] = this._prepareModel(model, options);
          if (model) {
            toAdd.push(model);
            this._addReference(model, options);
            modelMap[model.cid] = true;
            set.push(model);
          }
        }
      }

      // Remove stale models.
      if (remove) {
        for (i = 0; i < this.length; i++) {
          model = this.models[i];
          if (!modelMap[model.cid]) toRemove.push(model);
        }
        if (toRemove.length) this._removeModels(toRemove, options);
      }

      // See if sorting is needed, update `length` and splice in new models.
      var orderChanged = false;
      var replace = !sortable && add && remove;
      if (set.length && replace) {
        orderChanged = this.length !== set.length || _.some(this.models, function(m, index) {
          return m !== set[index];
        });
        this.models.length = 0;
        splice(this.models, set, 0);
        this.length = this.models.length;
      } else if (toAdd.length) {
        if (sortable) sort = true;
        splice(this.models, toAdd, at == null ? this.length : at);
        this.length = this.models.length;
      }

      // Silently sort the collection if appropriate.
      if (sort) this.sort({silent: true});

      // Unless silenced, it's time to fire all appropriate add/sort/update events.
      if (!options.silent) {
        for (i = 0; i < toAdd.length; i++) {
          if (at != null) options.index = at + i;
          model = toAdd[i];
          model.trigger('add', model, this, options);
        }
        if (sort || orderChanged) this.trigger('sort', this, options);
        if (toAdd.length || toRemove.length || toMerge.length) {
          options.changes = {
            added: toAdd,
            removed: toRemove,
            merged: toMerge
          };
          this.trigger('update', this, options);
        }
      }

      // Return the added (or merged) model (or models).
      return singular ? models[0] : models;
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any granular `add` or `remove` events. Fires `reset` when finished.
    // Useful for bulk operations and optimizations.
    reset: function(models, options) {
      options = options ? _.clone(options) : {};
      for (var i = 0; i < this.models.length; i++) {
        this._removeReference(this.models[i], options);
      }
      options.previousModels = this.models;
      this._reset();
      models = this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return models;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      return this.add(model, _.extend({at: this.length}, options));
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      return this.remove(model, options);
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      return this.add(model, _.extend({at: 0}, options));
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      return this.remove(model, options);
    },

    // Slice out a sub-array of models from the collection.
    slice: function() {
      return slice.apply(this.models, arguments);
    },

    // Get a model from the set by id, cid, model object with id or cid
    // properties, or an attributes object that is transformed through modelId.
    get: function(obj) {
      if (obj == null) return void 0;
      return this._byId[obj] ||
        this._byId[this.modelId(obj.attributes || obj)] ||
        obj.cid && this._byId[obj.cid];
    },

    // Returns `true` if the model is in the collection.
    has: function(obj) {
      return this.get(obj) != null;
    },

    // Get the model at the given index.
    at: function(index) {
      if (index < 0) index += this.length;
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of
    // `filter`.
    where: function(attrs, first) {
      return this[first ? 'find' : 'filter'](attrs);
    },

    // Return the first model with matching attributes. Useful for simple cases
    // of `find`.
    findWhere: function(attrs) {
      return this.where(attrs, true);
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      var comparator = this.comparator;
      if (!comparator) throw new Error('Cannot sort a set without a comparator');
      options || (options = {});

      var length = comparator.length;
      if (_.isFunction(comparator)) comparator = _.bind(comparator, this);

      // Run sort based on type of `comparator`.
      if (length === 1 || _.isString(comparator)) {
        this.models = this.sortBy(comparator);
      } else {
        this.models.sort(comparator);
      }
      if (!options.silent) this.trigger('sort', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return this.map(attr + '');
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `reset: true` is passed, the response
    // data will be passed through the `reset` method instead of `set`.
    fetch: function(options) {
      options = _.extend({parse: true}, options);
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        var method = options.reset ? 'reset' : 'set';
        collection[method](resp, options);
        if (success) success.call(options.context, collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      options = options ? _.clone(options) : {};
      var wait = options.wait;
      model = this._prepareModel(model, options);
      if (!model) return false;
      if (!wait) this.add(model, options);
      var collection = this;
      var success = options.success;
      options.success = function(m, resp, callbackOpts) {
        if (wait) collection.add(m, callbackOpts);
        if (success) success.call(callbackOpts.context, m, resp, callbackOpts);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new collection with an identical list of models as this one.
    clone: function() {
      return new this.constructor(this.models, {
        model: this.model,
        comparator: this.comparator
      });
    },

    // Define how to uniquely identify models in the collection.
    modelId: function(attrs) {
      return attrs[this.model.prototype.idAttribute || 'id'];
    },

    // Private method to reset all internal state. Called when the collection
    // is first initialized or reset.
    _reset: function() {
      this.length = 0;
      this.models = [];
      this._byId  = {};
    },

    // Prepare a hash of attributes (or other model) to be added to this
    // collection.
    _prepareModel: function(attrs, options) {
      if (this._isModel(attrs)) {
        if (!attrs.collection) attrs.collection = this;
        return attrs;
      }
      options = options ? _.clone(options) : {};
      options.collection = this;
      var model = new this.model(attrs, options);
      if (!model.validationError) return model;
      this.trigger('invalid', this, model.validationError, options);
      return false;
    },

    // Internal method called by both remove and set.
    _removeModels: function(models, options) {
      var removed = [];
      for (var i = 0; i < models.length; i++) {
        var model = this.get(models[i]);
        if (!model) continue;

        var index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;

        // Remove references before triggering 'remove' event to prevent an
        // infinite loop. #3693
        delete this._byId[model.cid];
        var id = this.modelId(model.attributes);
        if (id != null) delete this._byId[id];

        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }

        removed.push(model);
        this._removeReference(model, options);
      }
      return removed;
    },

    // Method for checking whether an object should be considered a model for
    // the purposes of adding to the collection.
    _isModel: function(model) {
      return model instanceof Model;
    },

    // Internal method to create a model's ties to a collection.
    _addReference: function(model, options) {
      this._byId[model.cid] = model;
      var id = this.modelId(model.attributes);
      if (id != null) this._byId[id] = model;
      model.on('all', this._onModelEvent, this);
    },

    // Internal method to sever a model's ties to a collection.
    _removeReference: function(model, options) {
      delete this._byId[model.cid];
      var id = this.modelId(model.attributes);
      if (id != null) delete this._byId[id];
      if (this === model.collection) delete model.collection;
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if (model) {
        if ((event === 'add' || event === 'remove') && collection !== this) return;
        if (event === 'destroy') this.remove(model, options);
        if (event === 'change') {
          var prevId = this.modelId(model.previousAttributes());
          var id = this.modelId(model.attributes);
          if (prevId !== id) {
            if (prevId != null) delete this._byId[prevId];
            if (id != null) this._byId[id] = model;
          }
        }
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  // 90% of the core usefulness of Backbone Collections is actually implemented
  // right here:
  var collectionMethods = {forEach: 3, each: 3, map: 3, collect: 3, reduce: 0,
      foldl: 0, inject: 0, reduceRight: 0, foldr: 0, find: 3, detect: 3, filter: 3,
      select: 3, reject: 3, every: 3, all: 3, some: 3, any: 3, include: 3, includes: 3,
      contains: 3, invoke: 0, max: 3, min: 3, toArray: 1, size: 1, first: 3,
      head: 3, take: 3, initial: 3, rest: 3, tail: 3, drop: 3, last: 3,
      without: 0, difference: 0, indexOf: 3, shuffle: 1, lastIndexOf: 3,
      isEmpty: 1, chain: 1, sample: 3, partition: 3, groupBy: 3, countBy: 3,
      sortBy: 3, indexBy: 3, findIndex: 3, findLastIndex: 3};

  // Mix in each Underscore method as a proxy to `Collection#models`.
  addUnderscoreMethods(Collection, collectionMethods, 'models');

  // Backbone.View
  // -------------

  // Backbone Views are almost more convention than they are actual code. A View
  // is simply a JavaScript object that represents a logical chunk of UI in the
  // DOM. This might be a single item, an entire list, a sidebar or panel, or
  // even the surrounding frame which wraps your whole app. Defining a chunk of
  // UI as a **View** allows you to define your DOM events declaratively, without
  // having to worry about render order ... and makes it easy for the view to
  // react to specific changes in the state of your models.

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    _.extend(this, _.pick(options, viewOptions));
    this._ensureElement();
    this.initialize.apply(this, arguments);
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be set as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be preferred to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable Backbone.Events listeners.
    remove: function() {
      this._removeElement();
      this.stopListening();
      return this;
    },

    // Remove this view's element from the document and all event listeners
    // attached to it. Exposed for subclasses using an alternative DOM
    // manipulation API.
    _removeElement: function() {
      this.$el.remove();
    },

    // Change the view's element (`this.el` property) and re-delegate the
    // view's events on the new element.
    setElement: function(element) {
      this.undelegateEvents();
      this._setElement(element);
      this.delegateEvents();
      return this;
    },

    // Creates the `this.el` and `this.$el` references for this view using the
    // given `el`. `el` can be a CSS selector or an HTML string, a jQuery
    // context or an element. Subclasses can override this to utilize an
    // alternative DOM manipulation API and are only required to set the
    // `this.el` property.
    _setElement: function(el) {
      this.$el = el instanceof Backbone.$ ? el : Backbone.$(el);
      this.el = this.$el[0];
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    delegateEvents: function(events) {
      events || (events = _.result(this, 'events'));
      if (!events) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[method];
        if (!method) continue;
        var match = key.match(delegateEventSplitter);
        this.delegate(match[1], match[2], _.bind(method, this));
      }
      return this;
    },

    // Add a single event listener to the view's element (or a child element
    // using `selector`). This only works for delegate-able events: not `focus`,
    // `blur`, and not `change`, `submit`, and `reset` in Internet Explorer.
    delegate: function(eventName, selector, listener) {
      this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
      return this;
    },

    // Clears all callbacks previously bound to the view by `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      if (this.$el) this.$el.off('.delegateEvents' + this.cid);
      return this;
    },

    // A finer-grained `undelegateEvents` for removing a single delegated event.
    // `selector` and `listener` are both optional.
    undelegate: function(eventName, selector, listener) {
      this.$el.off(eventName + '.delegateEvents' + this.cid, selector, listener);
      return this;
    },

    // Produces a DOM element to be assigned to your view. Exposed for
    // subclasses using an alternative DOM manipulation API.
    _createElement: function(tagName) {
      return document.createElement(tagName);
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        this.setElement(this._createElement(_.result(this, 'tagName')));
        this._setAttributes(attrs);
      } else {
        this.setElement(_.result(this, 'el'));
      }
    },

    // Set attributes from a hash on this view's element.  Exposed for
    // subclasses using an alternative DOM manipulation API.
    _setAttributes: function(attributes) {
      this.$el.attr(attributes);
    }

  });

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON
    });

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    // Pass along `textStatus` and `errorThrown` from jQuery.
    var error = options.error;
    options.error = function(xhr, textStatus, errorThrown) {
      options.textStatus = textStatus;
      options.errorThrown = errorThrown;
      if (error) error.call(options.context, xhr, textStatus, errorThrown);
    };

    // Make the request, allowing the user to override any Ajax options.
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch': 'PATCH',
    'delete': 'DELETE',
    'read': 'GET'
  };

  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
  // Override this if you'd like to use a different library.
  Backbone.ajax = function() {
    return Backbone.$.ajax.apply(Backbone.$, arguments);
  };

  // Backbone.Router
  // ---------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var optionalParam = /\((.*?)\)/g;
  var namedParam    = /(\(\?)?:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        if (router.execute(callback, args, name) !== false) {
          router.trigger.apply(router, ['route:' + name].concat(args));
          router.trigger('route', name, args);
          Backbone.history.trigger('route', router, name, args);
        }
      });
      return this;
    },

    // Execute a route handler with the provided parameters.  This is an
    // excellent place to do pre-route setup or post-route cleanup.
    execute: function(callback, args, name) {
      if (callback) callback.apply(this, args);
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
      return this;
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      this.routes = _.result(this, 'routes');
      var route, routes = _.keys(this.routes);
      while ((route = routes.pop()) != null) {
        this.route(route, this.routes[route]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(optionalParam, '(?:$1)?')
                   .replace(namedParam, function(match, optional) {
                     return optional ? match : '([^/?]+)';
                   })
                   .replace(splatParam, '([^?]*?)');
      return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param, i) {
        // Don't decode the search params.
        if (i === params.length - 1) return param || null;
        return param ? decodeURIComponent(param) : null;
      });
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on either
  // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
  // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
  // and URL fragments. If the browser supports neither (old IE, natch),
  // falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    this.checkUrl = _.bind(this.checkUrl, this);

    // Ensure that `History` can be used outside of the browser.
    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  };

  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for stripping urls of hash.
  var pathStripper = /#.*$/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Are we at the app root?
    atRoot: function() {
      var path = this.location.pathname.replace(/[^\/]$/, '$&/');
      return path === this.root && !this.getSearch();
    },

    // Does the pathname match the root?
    matchRoot: function() {
      var path = this.decodeFragment(this.location.pathname);
      var rootPath = path.slice(0, this.root.length - 1) + '/';
      return rootPath === this.root;
    },

    // Unicode characters in `location.pathname` are percent encoded so they're
    // decoded for comparison. `%25` should not be decoded since it may be part
    // of an encoded parameter.
    decodeFragment: function(fragment) {
      return decodeURI(fragment.replace(/%25/g, '%2525'));
    },

    // In IE6, the hash fragment and search params are incorrect if the
    // fragment contains `?`.
    getSearch: function() {
      var match = this.location.href.replace(/#.*/, '').match(/\?.+/);
      return match ? match[0] : '';
    },

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the pathname and search params, without the root.
    getPath: function() {
      var path = this.decodeFragment(
        this.location.pathname + this.getSearch()
      ).slice(this.root.length - 1);
      return path.charAt(0) === '/' ? path.slice(1) : path;
    },

    // Get the cross-browser normalized URL fragment from the path or hash.
    getFragment: function(fragment) {
      if (fragment == null) {
        if (this._usePushState || !this._wantsHashChange) {
          fragment = this.getPath();
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error('Backbone.history has already been started');
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._wantsHashChange = this.options.hashChange !== false;
      this._hasHashChange   = 'onhashchange' in window && (document.documentMode === void 0 || document.documentMode > 7);
      this._useHashChange   = this._wantsHashChange && this._hasHashChange;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.history && this.history.pushState);
      this._usePushState    = this._wantsPushState && this._hasPushState;
      this.fragment         = this.getFragment();

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      // Transition from hashChange to pushState or vice versa if both are
      // requested.
      if (this._wantsHashChange && this._wantsPushState) {

        // If we've started off with a route from a `pushState`-enabled
        // browser, but we're currently in a browser that doesn't support it...
        if (!this._hasPushState && !this.atRoot()) {
          var rootPath = this.root.slice(0, -1) || '/';
          this.location.replace(rootPath + '#' + this.getPath());
          // Return immediately as browser will do redirect to new url
          return true;

        // Or if we've started out with a hash-based route, but we're currently
        // in a browser where it could be `pushState`-based instead...
        } else if (this._hasPushState && this.atRoot()) {
          this.navigate(this.getHash(), {replace: true});
        }

      }

      // Proxy an iframe to handle location events if the browser doesn't
      // support the `hashchange` event, HTML5 history, or the user wants
      // `hashChange` but not `pushState`.
      if (!this._hasHashChange && this._wantsHashChange && !this._usePushState) {
        this.iframe = document.createElement('iframe');
        this.iframe.src = 'javascript:0';
        this.iframe.style.display = 'none';
        this.iframe.tabIndex = -1;
        var body = document.body;
        // Using `appendChild` will throw on IE < 9 if the document is not ready.
        var iWindow = body.insertBefore(this.iframe, body.firstChild).contentWindow;
        iWindow.document.open();
        iWindow.document.close();
        iWindow.location.hash = '#' + this.fragment;
      }

      // Add a cross-platform `addEventListener` shim for older browsers.
      var addEventListener = window.addEventListener || function(eventName, listener) {
        return attachEvent('on' + eventName, listener);
      };

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._usePushState) {
        addEventListener('popstate', this.checkUrl, false);
      } else if (this._useHashChange && !this.iframe) {
        addEventListener('hashchange', this.checkUrl, false);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      if (!this.options.silent) return this.loadUrl();
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      // Add a cross-platform `removeEventListener` shim for older browsers.
      var removeEventListener = window.removeEventListener || function(eventName, listener) {
        return detachEvent('on' + eventName, listener);
      };

      // Remove window listeners.
      if (this._usePushState) {
        removeEventListener('popstate', this.checkUrl, false);
      } else if (this._useHashChange && !this.iframe) {
        removeEventListener('hashchange', this.checkUrl, false);
      }

      // Clean up the iframe if necessary.
      if (this.iframe) {
        document.body.removeChild(this.iframe);
        this.iframe = null;
      }

      // Some environments will throw when clearing an undefined interval.
      if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();

      // If the user pressed the back button, the iframe's hash will have
      // changed and we should use that for comparison.
      if (current === this.fragment && this.iframe) {
        current = this.getHash(this.iframe.contentWindow);
      }

      if (current === this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl();
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragment) {
      // If the root doesn't match, no routes can match either.
      if (!this.matchRoot()) return false;
      fragment = this.fragment = this.getFragment(fragment);
      return _.some(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: !!options};

      // Normalize the fragment.
      fragment = this.getFragment(fragment || '');

      // Don't include a trailing slash on the root.
      var rootPath = this.root;
      if (fragment === '' || fragment.charAt(0) === '?') {
        rootPath = rootPath.slice(0, -1) || '/';
      }
      var url = rootPath + fragment;

      // Strip the hash and decode for matching.
      fragment = this.decodeFragment(fragment.replace(pathStripper, ''));

      if (this.fragment === fragment) return;
      this.fragment = fragment;

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._usePushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this._updateHash(this.location, fragment, options.replace);
        if (this.iframe && fragment !== this.getHash(this.iframe.contentWindow)) {
          var iWindow = this.iframe.contentWindow;

          // Opening and closing the iframe tricks IE7 and earlier to push a
          // history entry on hash-tag change.  When replace is true, we don't
          // want this.
          if (!options.replace) {
            iWindow.document.open();
            iWindow.document.close();
          }

          this._updateHash(iWindow.location, fragment, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        return this.location.assign(url);
      }
      if (options.trigger) return this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        // Some browsers require that `hash` contains a leading #.
        location.hash = '#' + fragment;
      }
    }

  });

  // Create the default Backbone.history.
  Backbone.history = new History;

  // Helpers
  // -------

  // Helper function to correctly set up the prototype chain for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function and add the prototype properties.
    child.prototype = _.create(parent.prototype, protoProps);
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Set up inheritance for the model, collection, router, view and history.
  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function(model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error.call(options.context, model, resp, options);
      model.trigger('error', model, resp, options);
    };
  };

  return Backbone;
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"jquery":65,"underscore":67}],65:[function(require,module,exports){
/*!
 * jQuery JavaScript Library v3.2.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2017-03-20T18:59Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};



	function DOMEval( code, doc ) {
		doc = doc || document;

		var script = doc.createElement( "script" );

		script.text = code;
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.2.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {

		// As of jQuery 3.0, isNumeric is limited to
		// strings and numbers (primitives or objects)
		// that can be coerced to finite numbers (gh-2662)
		var type = jQuery.type( obj );
		return ( type === "number" || type === "string" ) &&

			// parseFloat NaNs numeric-cast false positives ("")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			!isNaN( obj - parseFloat( obj ) );
	},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {

		/* eslint-disable no-unused-vars */
		// See https://github.com/eslint/eslint/issues/6125
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// Support: Android <=2.3 only (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		DOMEval( code );
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE <=9 - 11, Edge 12 - 13
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android <=4.0 only
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.3
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-08-08
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	disabledAncestor = addCombinator(
		function( elem ) {
			return elem.disabled === true && ("form" in elem || "label" in elem);
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						disabledAncestor( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID filter and find
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Simple selector that can be filtered directly, removing non-Elements
	if ( risSimple.test( qualifier ) ) {
		return jQuery.filter( qualifier, elements, not );
	}

	// Complex selector, compare the two sets, removing non-Elements
	qualifier = jQuery.filter( qualifier, elements );
	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) > -1 ) !== not && elem.nodeType === 1;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
        if ( nodeName( elem, "iframe" ) ) {
            return elem.contentDocument;
        }

        // Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
        // Treat the template element as a regular one in browsers that
        // don't support it.
        if ( nodeName( elem, "template" ) ) {
            elem = elem.content || elem;
        }

        return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && jQuery.isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && jQuery.isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = jQuery.isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( jQuery.isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				jQuery.isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ jQuery.camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ jQuery.camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ jQuery.camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( jQuery.camelCase );
			} else {
				key = jQuery.camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			jQuery.contains( elem.ownerDocument, elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};




function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE <=9 only
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE <=9 only
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();
var documentElement = document.documentElement;



var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 only
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		// Make a writable jQuery.Event from the native event object
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: jQuery.isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( ">tbody", elem )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		div.style.cssText =
			"box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";
		div.innerHTML = "";
		documentElement.appendChild( container );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = divStyle.marginLeft === "2px";
		boxSizingReliableVal = divStyle.width === "4px";

		// Support: Android 4.0 - 4.3 only
		// Some styles come back with percentage values, even though they shouldn't
		div.style.marginRight = "50%";
		pixelMarginRightVal = divStyle.marginRight === "4px";

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	container.appendChild( div );

	jQuery.extend( support, {
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelMarginRight: function() {
			computeStyleTests();
			return pixelMarginRightVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a property mapped along what jQuery.cssProps suggests or to
// a vendor prefixed property.
function finalPropName( name ) {
	var ret = jQuery.cssProps[ name ];
	if ( !ret ) {
		ret = jQuery.cssProps[ name ] = vendorPropName( name ) || name;
	}
	return ret;
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i,
		val = 0;

	// If we already have the right measurement, avoid augmentation
	if ( extra === ( isBorderBox ? "border" : "content" ) ) {
		i = 4;

	// Otherwise initialize for horizontal or vertical properties
	} else {
		i = name === "width" ? 1 : 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// At this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with computed style
	var valueIsBorderBox,
		styles = getStyles( elem ),
		val = curCSS( elem, name, styles ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Computed unit is not pixels. Stop here and return.
	if ( rnumnonpx.test( val ) ) {
		return val;
	}

	// Check for style in case a browser which returns unreliable values
	// for getComputedStyle silently falls back to the reliable elem.style
	valueIsBorderBox = isBorderBox &&
		( support.boxSizingReliable() || val === elem.style[ name ] );

	// Fall back to offsetWidth/Height when value is "auto"
	// This happens for inline elements with no explicit setting (gh-3571)
	if ( val === "auto" ) {
		val = elem[ "offset" + name[ 0 ].toUpperCase() + name.slice( 1 ) ];
	}

	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = extra && getStyles( elem ),
				subtract = extra && augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				);

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ name ] = value;
				value = jQuery.css( elem, name );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 13
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://html.spec.whatwg.org/multipage/infrastructure.html#strip-and-collapse-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnothtmlwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




support.focusin = "onfocusin" in window;


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = jQuery.isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 13
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( jQuery.isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var doc, docElem, rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		rect = elem.getBoundingClientRect();

		doc = elem.ownerDocument;
		docElem = doc.documentElement;
		win = doc.defaultView;

		return {
			top: rect.top + win.pageYOffset - docElem.clientTop,
			left: rect.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset = {
				top: parentOffset.top + jQuery.css( offsetParent[ 0 ], "borderTopWidth", true ),
				left: parentOffset.left + jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true )
			};
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( jQuery.isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );

},{}],66:[function(require,module,exports){
/*! nouislider - 10.1.0 - 2017-07-28 17:11:18 */

(function (factory) {

    if ( typeof define === 'function' && define.amd ) {

        // AMD. Register as an anonymous module.
        define([], factory);

    } else if ( typeof exports === 'object' ) {

        // Node/CommonJS
        module.exports = factory();

    } else {

        // Browser globals
        window.noUiSlider = factory();
    }

}(function( ){

	'use strict';

	var VERSION = '10.1.0';


	function isValidFormatter ( entry ) {
		return typeof entry === 'object' && typeof entry.to === 'function' && typeof entry.from === 'function';
	}

	function removeElement ( el ) {
		el.parentElement.removeChild(el);
	}

	// Bindable version
	function preventDefault ( e ) {
		e.preventDefault();
	}

	// Removes duplicates from an array.
	function unique ( array ) {
		return array.filter(function(a){
			return !this[a] ? this[a] = true : false;
		}, {});
	}

	// Round a value to the closest 'to'.
	function closest ( value, to ) {
		return Math.round(value / to) * to;
	}

	// Current position of an element relative to the document.
	function offset ( elem, orientation ) {

		var rect = elem.getBoundingClientRect();
		var doc = elem.ownerDocument;
		var docElem = doc.documentElement;
		var pageOffset = getPageOffset(doc);

		// getBoundingClientRect contains left scroll in Chrome on Android.
		// I haven't found a feature detection that proves this. Worst case
		// scenario on mis-match: the 'tap' feature on horizontal sliders breaks.
		if ( /webkit.*Chrome.*Mobile/i.test(navigator.userAgent) ) {
			pageOffset.x = 0;
		}

		return orientation ? (rect.top + pageOffset.y - docElem.clientTop) : (rect.left + pageOffset.x - docElem.clientLeft);
	}

	// Checks whether a value is numerical.
	function isNumeric ( a ) {
		return typeof a === 'number' && !isNaN( a ) && isFinite( a );
	}

	// Sets a class and removes it after [duration] ms.
	function addClassFor ( element, className, duration ) {
		if (duration > 0) {
		addClass(element, className);
			setTimeout(function(){
				removeClass(element, className);
			}, duration);
		}
	}

	// Limits a value to 0 - 100
	function limit ( a ) {
		return Math.max(Math.min(a, 100), 0);
	}

	// Wraps a variable as an array, if it isn't one yet.
	// Note that an input array is returned by reference!
	function asArray ( a ) {
		return Array.isArray(a) ? a : [a];
	}

	// Counts decimals
	function countDecimals ( numStr ) {
		numStr = String(numStr);
		var pieces = numStr.split(".");
		return pieces.length > 1 ? pieces[1].length : 0;
	}

	// http://youmightnotneedjquery.com/#add_class
	function addClass ( el, className ) {
		if ( el.classList ) {
			el.classList.add(className);
		} else {
			el.className += ' ' + className;
		}
	}

	// http://youmightnotneedjquery.com/#remove_class
	function removeClass ( el, className ) {
		if ( el.classList ) {
			el.classList.remove(className);
		} else {
			el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
	}

	// https://plainjs.com/javascript/attributes/adding-removing-and-testing-for-classes-9/
	function hasClass ( el, className ) {
		return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
	}

	// https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
	function getPageOffset ( doc ) {

		var supportPageOffset = window.pageXOffset !== undefined;
		var isCSS1Compat = ((doc.compatMode || "") === "CSS1Compat");
		var x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? doc.documentElement.scrollLeft : doc.body.scrollLeft;
		var y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? doc.documentElement.scrollTop : doc.body.scrollTop;

		return {
			x: x,
			y: y
		};
	}

	// we provide a function to compute constants instead
	// of accessing window.* as soon as the module needs it
	// so that we do not compute anything if not needed
	function getActions ( ) {

		// Determine the events to bind. IE11 implements pointerEvents without
		// a prefix, which breaks compatibility with the IE10 implementation.
		return window.navigator.pointerEnabled ? {
			start: 'pointerdown',
			move: 'pointermove',
			end: 'pointerup'
		} : window.navigator.msPointerEnabled ? {
			start: 'MSPointerDown',
			move: 'MSPointerMove',
			end: 'MSPointerUp'
		} : {
			start: 'mousedown touchstart',
			move: 'mousemove touchmove',
			end: 'mouseup touchend'
		};
	}

	// https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
	// Issue #785
	function getSupportsPassive ( ) {

		var supportsPassive = false;

		try {

			var opts = Object.defineProperty({}, 'passive', {
				get: function() {
					supportsPassive = true;
				}
			});

			window.addEventListener('test', null, opts);

		} catch (e) {}

		return supportsPassive;
	}

	function getSupportsTouchActionNone ( ) {
		return window.CSS && CSS.supports && CSS.supports('touch-action', 'none');
	}


// Value calculation

	// Determine the size of a sub-range in relation to a full range.
	function subRangeRatio ( pa, pb ) {
		return (100 / (pb - pa));
	}

	// (percentage) How many percent is this value of this range?
	function fromPercentage ( range, value ) {
		return (value * 100) / ( range[1] - range[0] );
	}

	// (percentage) Where is this value on this range?
	function toPercentage ( range, value ) {
		return fromPercentage( range, range[0] < 0 ?
			value + Math.abs(range[0]) :
				value - range[0] );
	}

	// (value) How much is this percentage on this range?
	function isPercentage ( range, value ) {
		return ((value * ( range[1] - range[0] )) / 100) + range[0];
	}


// Range conversion

	function getJ ( value, arr ) {

		var j = 1;

		while ( value >= arr[j] ){
			j += 1;
		}

		return j;
	}

	// (percentage) Input a value, find where, on a scale of 0-100, it applies.
	function toStepping ( xVal, xPct, value ) {

		if ( value >= xVal.slice(-1)[0] ){
			return 100;
		}

		var j = getJ( value, xVal ), va, vb, pa, pb;

		va = xVal[j-1];
		vb = xVal[j];
		pa = xPct[j-1];
		pb = xPct[j];

		return pa + (toPercentage([va, vb], value) / subRangeRatio (pa, pb));
	}

	// (value) Input a percentage, find where it is on the specified range.
	function fromStepping ( xVal, xPct, value ) {

		// There is no range group that fits 100
		if ( value >= 100 ){
			return xVal.slice(-1)[0];
		}

		var j = getJ( value, xPct ), va, vb, pa, pb;

		va = xVal[j-1];
		vb = xVal[j];
		pa = xPct[j-1];
		pb = xPct[j];

		return isPercentage([va, vb], (value - pa) * subRangeRatio (pa, pb));
	}

	// (percentage) Get the step that applies at a certain value.
	function getStep ( xPct, xSteps, snap, value ) {

		if ( value === 100 ) {
			return value;
		}

		var j = getJ( value, xPct ), a, b;

		// If 'snap' is set, steps are used as fixed points on the slider.
		if ( snap ) {

			a = xPct[j-1];
			b = xPct[j];

			// Find the closest position, a or b.
			if ((value - a) > ((b-a)/2)){
				return b;
			}

			return a;
		}

		if ( !xSteps[j-1] ){
			return value;
		}

		return xPct[j-1] + closest(
			value - xPct[j-1],
			xSteps[j-1]
		);
	}


// Entry parsing

	function handleEntryPoint ( index, value, that ) {

		var percentage;

		// Wrap numerical input in an array.
		if ( typeof value === "number" ) {
			value = [value];
		}

		// Reject any invalid input, by testing whether value is an array.
		if ( Object.prototype.toString.call( value ) !== '[object Array]' ){
			throw new Error("noUiSlider (" + VERSION + "): 'range' contains invalid value.");
		}

		// Covert min/max syntax to 0 and 100.
		if ( index === 'min' ) {
			percentage = 0;
		} else if ( index === 'max' ) {
			percentage = 100;
		} else {
			percentage = parseFloat( index );
		}

		// Check for correct input.
		if ( !isNumeric( percentage ) || !isNumeric( value[0] ) ) {
			throw new Error("noUiSlider (" + VERSION + "): 'range' value isn't numeric.");
		}

		// Store values.
		that.xPct.push( percentage );
		that.xVal.push( value[0] );

		// NaN will evaluate to false too, but to keep
		// logging clear, set step explicitly. Make sure
		// not to override the 'step' setting with false.
		if ( !percentage ) {
			if ( !isNaN( value[1] ) ) {
				that.xSteps[0] = value[1];
			}
		} else {
			that.xSteps.push( isNaN(value[1]) ? false : value[1] );
		}

		that.xHighestCompleteStep.push(0);
	}

	function handleStepPoint ( i, n, that ) {

		// Ignore 'false' stepping.
		if ( !n ) {
			return true;
		}

		// Factor to range ratio
		that.xSteps[i] = fromPercentage([
			 that.xVal[i]
			,that.xVal[i+1]
		], n) / subRangeRatio (
			that.xPct[i],
			that.xPct[i+1] );

		var totalSteps = (that.xVal[i+1] - that.xVal[i]) / that.xNumSteps[i];
		var highestStep = Math.ceil(Number(totalSteps.toFixed(3)) - 1);
		var step = that.xVal[i] + (that.xNumSteps[i] * highestStep);

		that.xHighestCompleteStep[i] = step;
	}


// Interface

	function Spectrum ( entry, snap, singleStep ) {

		this.xPct = [];
		this.xVal = [];
		this.xSteps = [ singleStep || false ];
		this.xNumSteps = [ false ];
		this.xHighestCompleteStep = [];

		this.snap = snap;

		var index, ordered = [ /* [0, 'min'], [1, '50%'], [2, 'max'] */ ];

		// Map the object keys to an array.
		for ( index in entry ) {
			if ( entry.hasOwnProperty(index) ) {
				ordered.push([entry[index], index]);
			}
		}

		// Sort all entries by value (numeric sort).
		if ( ordered.length && typeof ordered[0][0] === "object" ) {
			ordered.sort(function(a, b) { return a[0][0] - b[0][0]; });
		} else {
			ordered.sort(function(a, b) { return a[0] - b[0]; });
		}


		// Convert all entries to subranges.
		for ( index = 0; index < ordered.length; index++ ) {
			handleEntryPoint(ordered[index][1], ordered[index][0], this);
		}

		// Store the actual step values.
		// xSteps is sorted in the same order as xPct and xVal.
		this.xNumSteps = this.xSteps.slice(0);

		// Convert all numeric steps to the percentage of the subrange they represent.
		for ( index = 0; index < this.xNumSteps.length; index++ ) {
			handleStepPoint(index, this.xNumSteps[index], this);
		}
	}

	Spectrum.prototype.getMargin = function ( value ) {

		var step = this.xNumSteps[0];

		if ( step && ((value / step) % 1) !== 0 ) {
			throw new Error("noUiSlider (" + VERSION + "): 'limit', 'margin' and 'padding' must be divisible by step.");
		}

		return this.xPct.length === 2 ? fromPercentage(this.xVal, value) : false;
	};

	Spectrum.prototype.toStepping = function ( value ) {

		value = toStepping( this.xVal, this.xPct, value );

		return value;
	};

	Spectrum.prototype.fromStepping = function ( value ) {

		return fromStepping( this.xVal, this.xPct, value );
	};

	Spectrum.prototype.getStep = function ( value ) {

		value = getStep(this.xPct, this.xSteps, this.snap, value );

		return value;
	};

	Spectrum.prototype.getNearbySteps = function ( value ) {

		var j = getJ(value, this.xPct);

		return {
			stepBefore: { startValue: this.xVal[j-2], step: this.xNumSteps[j-2], highestStep: this.xHighestCompleteStep[j-2] },
			thisStep: { startValue: this.xVal[j-1], step: this.xNumSteps[j-1], highestStep: this.xHighestCompleteStep[j-1] },
			stepAfter: { startValue: this.xVal[j-0], step: this.xNumSteps[j-0], highestStep: this.xHighestCompleteStep[j-0] }
		};
	};

	Spectrum.prototype.countStepDecimals = function () {
		var stepDecimals = this.xNumSteps.map(countDecimals);
		return Math.max.apply(null, stepDecimals);
 	};

	// Outside testing
	Spectrum.prototype.convert = function ( value ) {
		return this.getStep(this.toStepping(value));
	};

/*	Every input option is tested and parsed. This'll prevent
	endless validation in internal methods. These tests are
	structured with an item for every option available. An
	option can be marked as required by setting the 'r' flag.
	The testing function is provided with three arguments:
		- The provided value for the option;
		- A reference to the options object;
		- The name for the option;

	The testing function returns false when an error is detected,
	or true when everything is OK. It can also modify the option
	object, to make sure all values can be correctly looped elsewhere. */

	var defaultFormatter = { 'to': function( value ){
		return value !== undefined && value.toFixed(2);
	}, 'from': Number };

	function validateFormat ( entry ) {

		// Any object with a to and from method is supported.
		if ( isValidFormatter(entry) ) {
			return true;
		}

		throw new Error("noUiSlider (" + VERSION + "): 'format' requires 'to' and 'from' methods.");
	}

	function testStep ( parsed, entry ) {

		if ( !isNumeric( entry ) ) {
			throw new Error("noUiSlider (" + VERSION + "): 'step' is not numeric.");
		}

		// The step option can still be used to set stepping
		// for linear sliders. Overwritten if set in 'range'.
		parsed.singleStep = entry;
	}

	function testRange ( parsed, entry ) {

		// Filter incorrect input.
		if ( typeof entry !== 'object' || Array.isArray(entry) ) {
			throw new Error("noUiSlider (" + VERSION + "): 'range' is not an object.");
		}

		// Catch missing start or end.
		if ( entry.min === undefined || entry.max === undefined ) {
			throw new Error("noUiSlider (" + VERSION + "): Missing 'min' or 'max' in 'range'.");
		}

		// Catch equal start or end.
		if ( entry.min === entry.max ) {
			throw new Error("noUiSlider (" + VERSION + "): 'range' 'min' and 'max' cannot be equal.");
		}

		parsed.spectrum = new Spectrum(entry, parsed.snap, parsed.singleStep);
	}

	function testStart ( parsed, entry ) {

		entry = asArray(entry);

		// Validate input. Values aren't tested, as the public .val method
		// will always provide a valid location.
		if ( !Array.isArray( entry ) || !entry.length ) {
			throw new Error("noUiSlider (" + VERSION + "): 'start' option is incorrect.");
		}

		// Store the number of handles.
		parsed.handles = entry.length;

		// When the slider is initialized, the .val method will
		// be called with the start options.
		parsed.start = entry;
	}

	function testSnap ( parsed, entry ) {

		// Enforce 100% stepping within subranges.
		parsed.snap = entry;

		if ( typeof entry !== 'boolean' ){
			throw new Error("noUiSlider (" + VERSION + "): 'snap' option must be a boolean.");
		}
	}

	function testAnimate ( parsed, entry ) {

		// Enforce 100% stepping within subranges.
		parsed.animate = entry;

		if ( typeof entry !== 'boolean' ){
			throw new Error("noUiSlider (" + VERSION + "): 'animate' option must be a boolean.");
		}
	}

	function testAnimationDuration ( parsed, entry ) {

		parsed.animationDuration = entry;

		if ( typeof entry !== 'number' ){
			throw new Error("noUiSlider (" + VERSION + "): 'animationDuration' option must be a number.");
		}
	}

	function testConnect ( parsed, entry ) {

		var connect = [false];
		var i;

		// Map legacy options
		if ( entry === 'lower' ) {
			entry = [true, false];
		}

		else if ( entry === 'upper' ) {
			entry = [false, true];
		}

		// Handle boolean options
		if ( entry === true || entry === false ) {

			for ( i = 1; i < parsed.handles; i++ ) {
				connect.push(entry);
			}

			connect.push(false);
		}

		// Reject invalid input
		else if ( !Array.isArray( entry ) || !entry.length || entry.length !== parsed.handles + 1 ) {
			throw new Error("noUiSlider (" + VERSION + "): 'connect' option doesn't match handle count.");
		}

		else {
			connect = entry;
		}

		parsed.connect = connect;
	}

	function testOrientation ( parsed, entry ) {

		// Set orientation to an a numerical value for easy
		// array selection.
		switch ( entry ){
		  case 'horizontal':
			parsed.ort = 0;
			break;
		  case 'vertical':
			parsed.ort = 1;
			break;
		  default:
			throw new Error("noUiSlider (" + VERSION + "): 'orientation' option is invalid.");
		}
	}

	function testMargin ( parsed, entry ) {

		if ( !isNumeric(entry) ){
			throw new Error("noUiSlider (" + VERSION + "): 'margin' option must be numeric.");
		}

		// Issue #582
		if ( entry === 0 ) {
			return;
		}

		parsed.margin = parsed.spectrum.getMargin(entry);

		if ( !parsed.margin ) {
			throw new Error("noUiSlider (" + VERSION + "): 'margin' option is only supported on linear sliders.");
		}
	}

	function testLimit ( parsed, entry ) {

		if ( !isNumeric(entry) ){
			throw new Error("noUiSlider (" + VERSION + "): 'limit' option must be numeric.");
		}

		parsed.limit = parsed.spectrum.getMargin(entry);

		if ( !parsed.limit || parsed.handles < 2 ) {
			throw new Error("noUiSlider (" + VERSION + "): 'limit' option is only supported on linear sliders with 2 or more handles.");
		}
	}

	function testPadding ( parsed, entry ) {

		if ( !isNumeric(entry) ){
			throw new Error("noUiSlider (" + VERSION + "): 'padding' option must be numeric.");
		}

		if ( entry === 0 ) {
			return;
		}

		parsed.padding = parsed.spectrum.getMargin(entry);

		if ( !parsed.padding ) {
			throw new Error("noUiSlider (" + VERSION + "): 'padding' option is only supported on linear sliders.");
		}

		if ( parsed.padding < 0 ) {
			throw new Error("noUiSlider (" + VERSION + "): 'padding' option must be a positive number.");
		}

		if ( parsed.padding >= 50 ) {
			throw new Error("noUiSlider (" + VERSION + "): 'padding' option must be less than half the range.");
		}
	}

	function testDirection ( parsed, entry ) {

		// Set direction as a numerical value for easy parsing.
		// Invert connection for RTL sliders, so that the proper
		// handles get the connect/background classes.
		switch ( entry ) {
		  case 'ltr':
			parsed.dir = 0;
			break;
		  case 'rtl':
			parsed.dir = 1;
			break;
		  default:
			throw new Error("noUiSlider (" + VERSION + "): 'direction' option was not recognized.");
		}
	}

	function testBehaviour ( parsed, entry ) {

		// Make sure the input is a string.
		if ( typeof entry !== 'string' ) {
			throw new Error("noUiSlider (" + VERSION + "): 'behaviour' must be a string containing options.");
		}

		// Check if the string contains any keywords.
		// None are required.
		var tap = entry.indexOf('tap') >= 0;
		var drag = entry.indexOf('drag') >= 0;
		var fixed = entry.indexOf('fixed') >= 0;
		var snap = entry.indexOf('snap') >= 0;
		var hover = entry.indexOf('hover') >= 0;

		if ( fixed ) {

			if ( parsed.handles !== 2 ) {
				throw new Error("noUiSlider (" + VERSION + "): 'fixed' behaviour must be used with 2 handles");
			}

			// Use margin to enforce fixed state
			testMargin(parsed, parsed.start[1] - parsed.start[0]);
		}

		parsed.events = {
			tap: tap || snap,
			drag: drag,
			fixed: fixed,
			snap: snap,
			hover: hover
		};
	}

	function testMultitouch ( parsed, entry ) {
		parsed.multitouch = entry;

		if ( typeof entry !== 'boolean' ){
			throw new Error("noUiSlider (" + VERSION + "): 'multitouch' option must be a boolean.");
		}
	}

	function testTooltips ( parsed, entry ) {

		if ( entry === false ) {
			return;
		}

		else if ( entry === true ) {

			parsed.tooltips = [];

			for ( var i = 0; i < parsed.handles; i++ ) {
				parsed.tooltips.push(true);
			}
		}

		else {

			parsed.tooltips = asArray(entry);

			if ( parsed.tooltips.length !== parsed.handles ) {
				throw new Error("noUiSlider (" + VERSION + "): must pass a formatter for all handles.");
			}

			parsed.tooltips.forEach(function(formatter){
				if ( typeof formatter !== 'boolean' && (typeof formatter !== 'object' || typeof formatter.to !== 'function') ) {
					throw new Error("noUiSlider (" + VERSION + "): 'tooltips' must be passed a formatter or 'false'.");
				}
			});
		}
	}

	function testAriaFormat ( parsed, entry ) {
		parsed.ariaFormat = entry;
		validateFormat(entry);
	}

	function testFormat ( parsed, entry ) {
		parsed.format = entry;
		validateFormat(entry);
	}

	function testCssPrefix ( parsed, entry ) {

		if ( entry !== undefined && typeof entry !== 'string' && entry !== false ) {
			throw new Error("noUiSlider (" + VERSION + "): 'cssPrefix' must be a string or `false`.");
		}

		parsed.cssPrefix = entry;
	}

	function testCssClasses ( parsed, entry ) {

		if ( entry !== undefined && typeof entry !== 'object' ) {
			throw new Error("noUiSlider (" + VERSION + "): 'cssClasses' must be an object.");
		}

		if ( typeof parsed.cssPrefix === 'string' ) {
			parsed.cssClasses = {};

			for ( var key in entry ) {
				if ( !entry.hasOwnProperty(key) ) { continue; }

				parsed.cssClasses[key] = parsed.cssPrefix + entry[key];
			}
		} else {
			parsed.cssClasses = entry;
		}
	}

	function testUseRaf ( parsed, entry ) {
		if ( entry === true || entry === false ) {
			parsed.useRequestAnimationFrame = entry;
		} else {
			throw new Error("noUiSlider (" + VERSION + "): 'useRequestAnimationFrame' option should be true (default) or false.");
		}
	}

	// Test all developer settings and parse to assumption-safe values.
	function testOptions ( options ) {

		// To prove a fix for #537, freeze options here.
		// If the object is modified, an error will be thrown.
		// Object.freeze(options);

		var parsed = {
			margin: 0,
			limit: 0,
			padding: 0,
			animate: true,
			animationDuration: 300,
			ariaFormat: defaultFormatter,
			format: defaultFormatter
		};

		// Tests are executed in the order they are presented here.
		var tests = {
			'step': { r: false, t: testStep },
			'start': { r: true, t: testStart },
			'connect': { r: true, t: testConnect },
			'direction': { r: true, t: testDirection },
			'snap': { r: false, t: testSnap },
			'animate': { r: false, t: testAnimate },
			'animationDuration': { r: false, t: testAnimationDuration },
			'range': { r: true, t: testRange },
			'orientation': { r: false, t: testOrientation },
			'margin': { r: false, t: testMargin },
			'limit': { r: false, t: testLimit },
			'padding': { r: false, t: testPadding },
			'behaviour': { r: true, t: testBehaviour },
			'multitouch': { r: true, t: testMultitouch },
			'ariaFormat': { r: false, t: testAriaFormat },
			'format': { r: false, t: testFormat },
			'tooltips': { r: false, t: testTooltips },
			'cssPrefix': { r: false, t: testCssPrefix },
			'cssClasses': { r: false, t: testCssClasses },
			'useRequestAnimationFrame': { r: false, t: testUseRaf }
		};

		var defaults = {
			'connect': false,
			'direction': 'ltr',
			'behaviour': 'tap',
			'multitouch': false,
			'orientation': 'horizontal',
			'cssPrefix' : 'noUi-',
			'cssClasses': {
				target: 'target',
				base: 'base',
				origin: 'origin',
				handle: 'handle',
				handleLower: 'handle-lower',
				handleUpper: 'handle-upper',
				horizontal: 'horizontal',
				vertical: 'vertical',
				background: 'background',
				connect: 'connect',
				ltr: 'ltr',
				rtl: 'rtl',
				draggable: 'draggable',
				drag: 'state-drag',
				tap: 'state-tap',
				active: 'active',
				tooltip: 'tooltip',
				pips: 'pips',
				pipsHorizontal: 'pips-horizontal',
				pipsVertical: 'pips-vertical',
				marker: 'marker',
				markerHorizontal: 'marker-horizontal',
				markerVertical: 'marker-vertical',
				markerNormal: 'marker-normal',
				markerLarge: 'marker-large',
				markerSub: 'marker-sub',
				value: 'value',
				valueHorizontal: 'value-horizontal',
				valueVertical: 'value-vertical',
				valueNormal: 'value-normal',
				valueLarge: 'value-large',
				valueSub: 'value-sub'
			},
			'useRequestAnimationFrame': true
		};

		// AriaFormat defaults to regular format, if any.
		if ( options.format && !options.ariaFormat ) {
			options.ariaFormat = options.format;
		}

		// Run all options through a testing mechanism to ensure correct
		// input. It should be noted that options might get modified to
		// be handled properly. E.g. wrapping integers in arrays.
		Object.keys(tests).forEach(function( name ){

			// If the option isn't set, but it is required, throw an error.
			if ( options[name] === undefined && defaults[name] === undefined ) {

				if ( tests[name].r ) {
					throw new Error("noUiSlider (" + VERSION + "): '" + name + "' is required.");
				}

				return true;
			}

			tests[name].t( parsed, options[name] === undefined ? defaults[name] : options[name] );
		});

		// Forward pips options
		parsed.pips = options.pips;

		var styles = [['left', 'top'], ['right', 'bottom']];

		// Pre-define the styles.
		parsed.style = styles[parsed.dir][parsed.ort];
		parsed.styleOposite = styles[parsed.dir?0:1][parsed.ort];

		return parsed;
	}


function closure ( target, options, originalOptions ){

	var actions = getActions();
	var supportsTouchActionNone = getSupportsTouchActionNone();
	var supportsPassive = supportsTouchActionNone && getSupportsPassive();

	// All variables local to 'closure' are prefixed with 'scope_'
	var scope_Target = target;
	var scope_Locations = [];
	var scope_Base;
	var scope_Handles;
	var scope_HandleNumbers = [];
	var scope_ActiveHandlesCount = 0;
	var scope_Connects;
	var scope_Spectrum = options.spectrum;
	var scope_Values = [];
	var scope_Events = {};
	var scope_Self;
	var scope_Pips;
	var scope_Document = target.ownerDocument;
	var scope_DocumentElement = scope_Document.documentElement;
	var scope_Body = scope_Document.body;


	// Creates a node, adds it to target, returns the new node.
	function addNodeTo ( target, className ) {

		var div = scope_Document.createElement('div');

		if ( className ) {
			addClass(div, className);
		}

		target.appendChild(div);

		return div;
	}

	// Append a origin to the base
	function addOrigin ( base, handleNumber ) {

		var origin = addNodeTo(base, options.cssClasses.origin);
		var handle = addNodeTo(origin, options.cssClasses.handle);

		handle.setAttribute('data-handle', handleNumber);

		// https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
		// 0 = focusable and reachable
		handle.setAttribute('tabindex', '0');
		handle.setAttribute('role', 'slider');
		handle.setAttribute('aria-orientation', options.ort ? 'vertical' : 'horizontal');

		if ( handleNumber === 0 ) {
			addClass(handle, options.cssClasses.handleLower);
		}

		else if ( handleNumber === options.handles - 1 ) {
			addClass(handle, options.cssClasses.handleUpper);
		}

		return origin;
	}

	// Insert nodes for connect elements
	function addConnect ( base, add ) {

		if ( !add ) {
			return false;
		}

		return addNodeTo(base, options.cssClasses.connect);
	}

	// Add handles to the slider base.
	function addElements ( connectOptions, base ) {

		scope_Handles = [];
		scope_Connects = [];

		scope_Connects.push(addConnect(base, connectOptions[0]));

		// [::::O====O====O====]
		// connectOptions = [0, 1, 1, 1]

		for ( var i = 0; i < options.handles; i++ ) {
			// Keep a list of all added handles.
			scope_Handles.push(addOrigin(base, i));
			scope_HandleNumbers[i] = i;
			scope_Connects.push(addConnect(base, connectOptions[i + 1]));
		}
	}

	// Initialize a single slider.
	function addSlider ( target ) {

		// Apply classes and data to the target.
		addClass(target, options.cssClasses.target);

		if ( options.dir === 0 ) {
			addClass(target, options.cssClasses.ltr);
		} else {
			addClass(target, options.cssClasses.rtl);
		}

		if ( options.ort === 0 ) {
			addClass(target, options.cssClasses.horizontal);
		} else {
			addClass(target, options.cssClasses.vertical);
		}

		scope_Base = addNodeTo(target, options.cssClasses.base);
	}


	function addTooltip ( handle, handleNumber ) {

		if ( !options.tooltips[handleNumber] ) {
			return false;
		}

		return addNodeTo(handle.firstChild, options.cssClasses.tooltip);
	}

	// The tooltips option is a shorthand for using the 'update' event.
	function tooltips ( ) {

		// Tooltips are added with options.tooltips in original order.
		var tips = scope_Handles.map(addTooltip);

		bindEvent('update', function(values, handleNumber, unencoded) {

			if ( !tips[handleNumber] ) {
				return;
			}

			var formattedValue = values[handleNumber];

			if ( options.tooltips[handleNumber] !== true ) {
				formattedValue = options.tooltips[handleNumber].to(unencoded[handleNumber]);
			}

			tips[handleNumber].innerHTML = formattedValue;
		});
	}


	function aria ( ) {

		bindEvent('update', function ( values, handleNumber, unencoded, tap, positions ) {

			// Update Aria Values for all handles, as a change in one changes min and max values for the next.
			scope_HandleNumbers.forEach(function( handleNumber ){

				var handle = scope_Handles[handleNumber];

				var min = checkHandlePosition(scope_Locations, handleNumber, 0, true, true, true);
				var max = checkHandlePosition(scope_Locations, handleNumber, 100, true, true, true);

				var now = positions[handleNumber];
				var text = options.ariaFormat.to(unencoded[handleNumber]);

				handle.children[0].setAttribute('aria-valuemin', min.toFixed(1));
				handle.children[0].setAttribute('aria-valuemax', max.toFixed(1));
				handle.children[0].setAttribute('aria-valuenow', now.toFixed(1));
				handle.children[0].setAttribute('aria-valuetext', text);
			});
		});
	}


	function getGroup ( mode, values, stepped ) {

		// Use the range.
		if ( mode === 'range' || mode === 'steps' ) {
			return scope_Spectrum.xVal;
		}

		if ( mode === 'count' ) {

			if ( !values ) {
				throw new Error("noUiSlider (" + VERSION + "): 'values' required for mode 'count'.");
			}

			// Divide 0 - 100 in 'count' parts.
			var spread = ( 100 / (values - 1) );
			var v;
			var i = 0;

			values = [];

			// List these parts and have them handled as 'positions'.
			while ( (v = i++ * spread) <= 100 ) {
				values.push(v);
			}

			mode = 'positions';
		}

		if ( mode === 'positions' ) {

			// Map all percentages to on-range values.
			return values.map(function( value ){
				return scope_Spectrum.fromStepping( stepped ? scope_Spectrum.getStep( value ) : value );
			});
		}

		if ( mode === 'values' ) {

			// If the value must be stepped, it needs to be converted to a percentage first.
			if ( stepped ) {

				return values.map(function( value ){

					// Convert to percentage, apply step, return to value.
					return scope_Spectrum.fromStepping( scope_Spectrum.getStep( scope_Spectrum.toStepping( value ) ) );
				});

			}

			// Otherwise, we can simply use the values.
			return values;
		}
	}

	function generateSpread ( density, mode, group ) {

		function safeIncrement(value, increment) {
			// Avoid floating point variance by dropping the smallest decimal places.
			return (value + increment).toFixed(7) / 1;
		}

		var indexes = {};
		var firstInRange = scope_Spectrum.xVal[0];
		var lastInRange = scope_Spectrum.xVal[scope_Spectrum.xVal.length-1];
		var ignoreFirst = false;
		var ignoreLast = false;
		var prevPct = 0;

		// Create a copy of the group, sort it and filter away all duplicates.
		group = unique(group.slice().sort(function(a, b){ return a - b; }));

		// Make sure the range starts with the first element.
		if ( group[0] !== firstInRange ) {
			group.unshift(firstInRange);
			ignoreFirst = true;
		}

		// Likewise for the last one.
		if ( group[group.length - 1] !== lastInRange ) {
			group.push(lastInRange);
			ignoreLast = true;
		}

		group.forEach(function ( current, index ) {

			// Get the current step and the lower + upper positions.
			var step;
			var i;
			var q;
			var low = current;
			var high = group[index+1];
			var newPct;
			var pctDifference;
			var pctPos;
			var type;
			var steps;
			var realSteps;
			var stepsize;

			// When using 'steps' mode, use the provided steps.
			// Otherwise, we'll step on to the next subrange.
			if ( mode === 'steps' ) {
				step = scope_Spectrum.xNumSteps[ index ];
			}

			// Default to a 'full' step.
			if ( !step ) {
				step = high-low;
			}

			// Low can be 0, so test for false. If high is undefined,
			// we are at the last subrange. Index 0 is already handled.
			if ( low === false || high === undefined ) {
				return;
			}

			// Make sure step isn't 0, which would cause an infinite loop (#654)
			step = Math.max(step, 0.0000001);

			// Find all steps in the subrange.
			for ( i = low; i <= high; i = safeIncrement(i, step) ) {

				// Get the percentage value for the current step,
				// calculate the size for the subrange.
				newPct = scope_Spectrum.toStepping( i );
				pctDifference = newPct - prevPct;

				steps = pctDifference / density;
				realSteps = Math.round(steps);

				// This ratio represents the ammount of percentage-space a point indicates.
				// For a density 1 the points/percentage = 1. For density 2, that percentage needs to be re-devided.
				// Round the percentage offset to an even number, then divide by two
				// to spread the offset on both sides of the range.
				stepsize = pctDifference/realSteps;

				// Divide all points evenly, adding the correct number to this subrange.
				// Run up to <= so that 100% gets a point, event if ignoreLast is set.
				for ( q = 1; q <= realSteps; q += 1 ) {

					// The ratio between the rounded value and the actual size might be ~1% off.
					// Correct the percentage offset by the number of points
					// per subrange. density = 1 will result in 100 points on the
					// full range, 2 for 50, 4 for 25, etc.
					pctPos = prevPct + ( q * stepsize );
					indexes[pctPos.toFixed(5)] = ['x', 0];
				}

				// Determine the point type.
				type = (group.indexOf(i) > -1) ? 1 : ( mode === 'steps' ? 2 : 0 );

				// Enforce the 'ignoreFirst' option by overwriting the type for 0.
				if ( !index && ignoreFirst ) {
					type = 0;
				}

				if ( !(i === high && ignoreLast)) {
					// Mark the 'type' of this point. 0 = plain, 1 = real value, 2 = step value.
					indexes[newPct.toFixed(5)] = [i, type];
				}

				// Update the percentage count.
				prevPct = newPct;
			}
		});

		return indexes;
	}

	function addMarking ( spread, filterFunc, formatter ) {

		var element = scope_Document.createElement('div');

		var valueSizeClasses = [
			options.cssClasses.valueNormal,
			options.cssClasses.valueLarge,
			options.cssClasses.valueSub
		];
		var markerSizeClasses = [
			options.cssClasses.markerNormal,
			options.cssClasses.markerLarge,
			options.cssClasses.markerSub
		];
		var valueOrientationClasses = [
			options.cssClasses.valueHorizontal,
			options.cssClasses.valueVertical
		];
		var markerOrientationClasses = [
			options.cssClasses.markerHorizontal,
			options.cssClasses.markerVertical
		];

		addClass(element, options.cssClasses.pips);
		addClass(element, options.ort === 0 ? options.cssClasses.pipsHorizontal : options.cssClasses.pipsVertical);

		function getClasses( type, source ){
			var a = source === options.cssClasses.value;
			var orientationClasses = a ? valueOrientationClasses : markerOrientationClasses;
			var sizeClasses = a ? valueSizeClasses : markerSizeClasses;

			return source + ' ' + orientationClasses[options.ort] + ' ' + sizeClasses[type];
		}

		function addSpread ( offset, values ){

			// Apply the filter function, if it is set.
			values[1] = (values[1] && filterFunc) ? filterFunc(values[0], values[1]) : values[1];

			// Add a marker for every point
			var node = addNodeTo(element, false);
				node.className = getClasses(values[1], options.cssClasses.marker);
				node.style[options.style] = offset + '%';

			// Values are only appended for points marked '1' or '2'.
			if ( values[1] ) {
				node = addNodeTo(element, false);
				node.className = getClasses(values[1], options.cssClasses.value);
				node.style[options.style] = offset + '%';
				node.innerText = formatter.to(values[0]);
			}
		}

		// Append all points.
		Object.keys(spread).forEach(function(a){
			addSpread(a, spread[a]);
		});

		return element;
	}

	function removePips ( ) {
		if ( scope_Pips ) {
			removeElement(scope_Pips);
			scope_Pips = null;
		}
	}

	function pips ( grid ) {

		// Fix #669
		removePips();

		var mode = grid.mode;
		var density = grid.density || 1;
		var filter = grid.filter || false;
		var values = grid.values || false;
		var stepped = grid.stepped || false;
		var group = getGroup( mode, values, stepped );
		var spread = generateSpread( density, mode, group );
		var format = grid.format || {
			to: Math.round
		};

		scope_Pips = scope_Target.appendChild(addMarking(
			spread,
			filter,
			format
		));

		return scope_Pips;
	}


	// Shorthand for base dimensions.
	function baseSize ( ) {
		var rect = scope_Base.getBoundingClientRect(), alt = 'offset' + ['Width', 'Height'][options.ort];
		return options.ort === 0 ? (rect.width||scope_Base[alt]) : (rect.height||scope_Base[alt]);
	}

	// Handler for attaching events trough a proxy.
	function attachEvent ( events, element, callback, data ) {

		// This function can be used to 'filter' events to the slider.
		// element is a node, not a nodeList

		var method = function ( e ){

			if ( scope_Target.hasAttribute('disabled') ) {
				return false;
			}

			// Stop if an active 'tap' transition is taking place.
			if ( hasClass(scope_Target, options.cssClasses.tap) ) {
				return false;
			}

			e = fixEvent(e, data.pageOffset, data.target || element);

			// Handle reject of multitouch
			if ( !e ) {
				return false;
			}

			// Ignore right or middle clicks on start #454
			if ( events === actions.start && e.buttons !== undefined && e.buttons > 1 ) {
				return false;
			}

			// Ignore right or middle clicks on start #454
			if ( data.hover && e.buttons ) {
				return false;
			}

			// 'supportsPassive' is only true if a browser also supports touch-action: none in CSS.
			// iOS safari does not, so it doesn't get to benefit from passive scrolling. iOS does support
			// touch-action: manipulation, but that allows panning, which breaks
			// sliders after zooming/on non-responsive pages.
			// See: https://bugs.webkit.org/show_bug.cgi?id=133112
			if ( !supportsPassive ) {
				e.preventDefault();
			}

			e.calcPoint = e.points[ options.ort ];

			// Call the event handler with the event [ and additional data ].
			callback ( e, data );
		};

		var methods = [];

		// Bind a closure on the target for every event type.
		events.split(' ').forEach(function( eventName ){
			element.addEventListener(eventName, method, supportsPassive ? { passive: true } : false);
			methods.push([eventName, method]);
		});

		return methods;
	}

	// Provide a clean event with standardized offset values.
	function fixEvent ( e, pageOffset, target ) {

		// Filter the event to register the type, which can be
		// touch, mouse or pointer. Offset changes need to be
		// made on an event specific basis.
		var touch = e.type.indexOf('touch') === 0;
		var mouse = e.type.indexOf('mouse') === 0;
		var pointer = e.type.indexOf('pointer') === 0;

		var x;
		var y;

		// IE10 implemented pointer events with a prefix;
		if ( e.type.indexOf('MSPointer') === 0 ) {
			pointer = true;
		}


		// In the event that multitouch is activated, the only thing one handle should be concerned
		// about is the touches that originated on top of it.
		if ( touch && options.multitouch ) {
			// Returns true if a touch originated on the target.
			var isTouchOnTarget = function (touch) {
				return touch.target === target || target.contains(touch.target);
			};
			// In the case of touchstart events, we need to make sure there is still no more than one
			// touch on the target so we look amongst all touches.
			if (e.type === 'touchstart') {
				var targetTouches = Array.prototype.filter.call(e.touches, isTouchOnTarget);
				// Do not support more than one touch per handle.
				if ( targetTouches.length > 1 ) {
					return false;
				}
				x = targetTouches[0].pageX;
				y = targetTouches[0].pageY;
			} else {
			// In the other cases, find on changedTouches is enough.
				var targetTouch = Array.prototype.find.call(e.changedTouches, isTouchOnTarget);
				// Cancel if the target touch has not moved.
				if ( !targetTouch ) {
					return false;
				}
				x = targetTouch.pageX;
				y = targetTouch.pageY;
			}
		} else if ( touch ) {
			// Fix bug when user touches with two or more fingers on mobile devices.
			// It's useful when you have two or more sliders on one page,
			// that can be touched simultaneously.
			// #649, #663, #668
			if ( e.touches.length > 1 ) {
				return false;
			}

			// noUiSlider supports one movement at a time,
			// so we can select the first 'changedTouch'.
			x = e.changedTouches[0].pageX;
			y = e.changedTouches[0].pageY;
		}

		pageOffset = pageOffset || getPageOffset(scope_Document);

		if ( mouse || pointer ) {
			x = e.clientX + pageOffset.x;
			y = e.clientY + pageOffset.y;
		}

		e.pageOffset = pageOffset;
		e.points = [x, y];
		e.cursor = mouse || pointer; // Fix #435

		return e;
	}

	// Translate a coordinate in the document to a percentage on the slider
	function calcPointToPercentage ( calcPoint ) {
		var location = calcPoint - offset(scope_Base, options.ort);
		var proposal = ( location * 100 ) / baseSize();
		return options.dir ? 100 - proposal : proposal;
	}

	// Find handle closest to a certain percentage on the slider
	function getClosestHandle ( proposal ) {

		var closest = 100;
		var handleNumber = false;

		scope_Handles.forEach(function(handle, index){

			// Disabled handles are ignored
			if ( handle.hasAttribute('disabled') ) {
				return;
			}

			var pos = Math.abs(scope_Locations[index] - proposal);

			if ( pos < closest ) {
				handleNumber = index;
				closest = pos;
			}
		});

		return handleNumber;
	}

	// Moves handle(s) by a percentage
	// (bool, % to move, [% where handle started, ...], [index in scope_Handles, ...])
	function moveHandles ( upward, proposal, locations, handleNumbers ) {

		var proposals = locations.slice();

		var b = [!upward, upward];
		var f = [upward, !upward];

		// Copy handleNumbers so we don't change the dataset
		handleNumbers = handleNumbers.slice();

		// Check to see which handle is 'leading'.
		// If that one can't move the second can't either.
		if ( upward ) {
			handleNumbers.reverse();
		}

		// Step 1: get the maximum percentage that any of the handles can move
		if ( handleNumbers.length > 1 ) {

			handleNumbers.forEach(function(handleNumber, o) {

				var to = checkHandlePosition(proposals, handleNumber, proposals[handleNumber] + proposal, b[o], f[o], false);

				// Stop if one of the handles can't move.
				if ( to === false ) {
					proposal = 0;
				} else {
					proposal = to - proposals[handleNumber];
					proposals[handleNumber] = to;
				}
			});
		}

		// If using one handle, check backward AND forward
		else {
			b = f = [true];
		}

		var state = false;

		// Step 2: Try to set the handles with the found percentage
		handleNumbers.forEach(function(handleNumber, o) {
			state = setHandle(handleNumber, locations[handleNumber] + proposal, b[o], f[o]) || state;
		});

		// Step 3: If a handle moved, fire events
		if ( state ) {
			handleNumbers.forEach(function(handleNumber){
				fireEvent('update', handleNumber);
				fireEvent('slide', handleNumber);
			});
		}
	}

	// External event handling
	function fireEvent ( eventName, handleNumber, tap ) {

		Object.keys(scope_Events).forEach(function( targetEvent ) {

			var eventType = targetEvent.split('.')[0];

			if ( eventName === eventType ) {
				scope_Events[targetEvent].forEach(function( callback ) {

					callback.call(
						// Use the slider public API as the scope ('this')
						scope_Self,
						// Return values as array, so arg_1[arg_2] is always valid.
						scope_Values.map(options.format.to),
						// Handle index, 0 or 1
						handleNumber,
						// Unformatted slider values
						scope_Values.slice(),
						// Event is fired by tap, true or false
						tap || false,
						// Left offset of the handle, in relation to the slider
						scope_Locations.slice()
					);
				});
			}
		});
	}


	// Fire 'end' when a mouse or pen leaves the document.
	function documentLeave ( event, data ) {
		if ( event.type === "mouseout" && event.target.nodeName === "HTML" && event.relatedTarget === null ){
			eventEnd (event, data);
		}
	}

	// Handle movement on document for handle and range drag.
	function eventMove ( event, data ) {

		// Fix #498
		// Check value of .buttons in 'start' to work around a bug in IE10 mobile (data.buttonsProperty).
		// https://connect.microsoft.com/IE/feedback/details/927005/mobile-ie10-windows-phone-buttons-property-of-pointermove-event-always-zero
		// IE9 has .buttons and .which zero on mousemove.
		// Firefox breaks the spec MDN defines.
		if ( navigator.appVersion.indexOf("MSIE 9") === -1 && event.buttons === 0 && data.buttonsProperty !== 0 ) {
			return eventEnd(event, data);
		}

		// Check if we are moving up or down
		var movement = (options.dir ? -1 : 1) * (event.calcPoint - data.startCalcPoint);

		// Convert the movement into a percentage of the slider width/height
		var proposal = (movement * 100) / data.baseSize;

		moveHandles(movement > 0, proposal, data.locations, data.handleNumbers);
	}

	// Unbind move events on document, call callbacks.
	function eventEnd ( event, data ) {

		// The handle is no longer active, so remove the class.
		if ( data.handle ) {
			removeClass(data.handle, options.cssClasses.active);
			scope_ActiveHandlesCount -= 1;
		}

		// Unbind the move and end events, which are added on 'start'.
		data.listeners.forEach(function( c ) {
			scope_DocumentElement.removeEventListener(c[0], c[1]);
		});

		if ( scope_ActiveHandlesCount === 0 ) {
			// Remove dragging class.
			removeClass(scope_Target, options.cssClasses.drag);
			setZindex();

			// Remove cursor styles and text-selection events bound to the body.
			if ( event.cursor ) {
				scope_Body.style.cursor = '';
				scope_Body.removeEventListener('selectstart', preventDefault);
			}
		}

		data.handleNumbers.forEach(function(handleNumber){
			fireEvent('change', handleNumber);
			fireEvent('set', handleNumber);
			fireEvent('end', handleNumber);
		});
	}

	// Bind move events on document.
	function eventStart ( event, data ) {

		var handle;
		if ( data.handleNumbers.length === 1 ) {

			var handleOrigin = scope_Handles[data.handleNumbers[0]];

			// Ignore 'disabled' handles
			if ( handleOrigin.hasAttribute('disabled') ) {
				return false;
			}

			handle = handleOrigin.children[0];
			scope_ActiveHandlesCount += 1;

			// Mark the handle as 'active' so it can be styled.
			addClass(handle, options.cssClasses.active);
		}

		// A drag should never propagate up to the 'tap' event.
		event.stopPropagation();

		// Record the event listeners.
		var listeners = [];

		// Attach the move and end events.
		var moveEvent = attachEvent(actions.move, scope_DocumentElement, eventMove, {
			// The event target has changed so we need to propagate the original one so that we keep
			// relying on it to extract target touches.
			target: event.target,
			handle: handle,
			listeners: listeners,
			startCalcPoint: event.calcPoint,
			baseSize: baseSize(),
			pageOffset: event.pageOffset,
			handleNumbers: data.handleNumbers,
			buttonsProperty: event.buttons,
			locations: scope_Locations.slice()
		});

		var endEvent = attachEvent(actions.end, scope_DocumentElement, eventEnd, {
			target: event.target,
			handle: handle,
			listeners: listeners,
			handleNumbers: data.handleNumbers
		});

		var outEvent = attachEvent("mouseout", scope_DocumentElement, documentLeave, {
			target: event.target,
			handle: handle,
			listeners: listeners,
			handleNumbers: data.handleNumbers
		});

		// We want to make sure we pushed the listeners in the listener list rather than creating
		// a new one as it has already been passed to the event handlers.
		listeners.push.apply(listeners, moveEvent.concat(endEvent, outEvent));

		// Text selection isn't an issue on touch devices,
		// so adding cursor styles can be skipped.
		if ( event.cursor ) {

			// Prevent the 'I' cursor and extend the range-drag cursor.
			scope_Body.style.cursor = getComputedStyle(event.target).cursor;

			// Mark the target with a dragging state.
			if ( scope_Handles.length > 1 ) {
				addClass(scope_Target, options.cssClasses.drag);
			}

			// Prevent text selection when dragging the handles.
			// In noUiSlider <= 9.2.0, this was handled by calling preventDefault on mouse/touch start/move,
			// which is scroll blocking. The selectstart event is supported by FireFox starting from version 52,
			// meaning the only holdout is iOS Safari. This doesn't matter: text selection isn't triggered there.
			// The 'cursor' flag is false.
			// See: http://caniuse.com/#search=selectstart
			scope_Body.addEventListener('selectstart', preventDefault, false);
		}

		data.handleNumbers.forEach(function(handleNumber){
			fireEvent('start', handleNumber);
		});
	}

	// Move closest handle to tapped location.
	function eventTap ( event ) {

		// The tap event shouldn't propagate up
		event.stopPropagation();

		var proposal = calcPointToPercentage(event.calcPoint);
		var handleNumber = getClosestHandle(proposal);

		// Tackle the case that all handles are 'disabled'.
		if ( handleNumber === false ) {
			return false;
		}

		// Flag the slider as it is now in a transitional state.
		// Transition takes a configurable amount of ms (default 300). Re-enable the slider after that.
		if ( !options.events.snap ) {
			addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
		}

		setHandle(handleNumber, proposal, true, true);

		setZindex();

		fireEvent('slide', handleNumber, true);
		fireEvent('update', handleNumber, true);
		fireEvent('change', handleNumber, true);
		fireEvent('set', handleNumber, true);

		if ( options.events.snap ) {
			eventStart(event, { handleNumbers: [handleNumber] });
		}
	}

	// Fires a 'hover' event for a hovered mouse/pen position.
	function eventHover ( event ) {

		var proposal = calcPointToPercentage(event.calcPoint);

		var to = scope_Spectrum.getStep(proposal);
		var value = scope_Spectrum.fromStepping(to);

		Object.keys(scope_Events).forEach(function( targetEvent ) {
			if ( 'hover' === targetEvent.split('.')[0] ) {
				scope_Events[targetEvent].forEach(function( callback ) {
					callback.call( scope_Self, value );
				});
			}
		});
	}

	// Attach events to several slider parts.
	function bindSliderEvents ( behaviour ) {

		// Attach the standard drag event to the handles.
		if ( !behaviour.fixed ) {

			scope_Handles.forEach(function( handle, index ){

				// These events are only bound to the visual handle
				// element, not the 'real' origin element.
				attachEvent ( actions.start, handle.children[0], eventStart, {
					handleNumbers: [index]
				});
			});
		}

		// Attach the tap event to the slider base.
		if ( behaviour.tap ) {
			attachEvent (actions.start, scope_Base, eventTap, {});
		}

		// Fire hover events
		if ( behaviour.hover ) {
			attachEvent (actions.move, scope_Base, eventHover, { hover: true });
		}

		// Make the range draggable.
		if ( behaviour.drag ){

			scope_Connects.forEach(function( connect, index ){

				if ( connect === false || index === 0 || index === scope_Connects.length - 1 ) {
					return;
				}

				var handleBefore = scope_Handles[index - 1];
				var handleAfter = scope_Handles[index];
				var eventHolders = [connect];

				addClass(connect, options.cssClasses.draggable);

				// When the range is fixed, the entire range can
				// be dragged by the handles. The handle in the first
				// origin will propagate the start event upward,
				// but it needs to be bound manually on the other.
				if ( behaviour.fixed ) {
					eventHolders.push(handleBefore.children[0]);
					eventHolders.push(handleAfter.children[0]);
				}

				eventHolders.forEach(function( eventHolder ) {
					attachEvent ( actions.start, eventHolder, eventStart, {
						handles: [handleBefore, handleAfter],
						handleNumbers: [index - 1, index]
					});
				});
			});
		}
	}


	// Split out the handle positioning logic so the Move event can use it, too
	function checkHandlePosition ( reference, handleNumber, to, lookBackward, lookForward, getValue ) {

		// For sliders with multiple handles, limit movement to the other handle.
		// Apply the margin option by adding it to the handle positions.
		if ( scope_Handles.length > 1 ) {

			if ( lookBackward && handleNumber > 0 ) {
				to = Math.max(to, reference[handleNumber - 1] + options.margin);
			}

			if ( lookForward && handleNumber < scope_Handles.length - 1 ) {
				to = Math.min(to, reference[handleNumber + 1] - options.margin);
			}
		}

		// The limit option has the opposite effect, limiting handles to a
		// maximum distance from another. Limit must be > 0, as otherwise
		// handles would be unmoveable.
		if ( scope_Handles.length > 1 && options.limit ) {

			if ( lookBackward && handleNumber > 0 ) {
				to = Math.min(to, reference[handleNumber - 1] + options.limit);
			}

			if ( lookForward && handleNumber < scope_Handles.length - 1 ) {
				to = Math.max(to, reference[handleNumber + 1] - options.limit);
			}
		}

		// The padding option keeps the handles a certain distance from the
		// edges of the slider. Padding must be > 0.
		if ( options.padding ) {

			if ( handleNumber === 0 ) {
				to = Math.max(to, options.padding);
			}

			if ( handleNumber === scope_Handles.length - 1 ) {
				to = Math.min(to, 100 - options.padding);
			}
		}

		to = scope_Spectrum.getStep(to);

		// Limit percentage to the 0 - 100 range
		to = limit(to);

		// Return false if handle can't move
		if ( to === reference[handleNumber] && !getValue ) {
			return false;
		}

		return to;
	}

	function toPct ( pct ) {
		return pct + '%';
	}

	// Updates scope_Locations and scope_Values, updates visual state
	function updateHandlePosition ( handleNumber, to ) {

		// Update locations.
		scope_Locations[handleNumber] = to;

		// Convert the value to the slider stepping/range.
		scope_Values[handleNumber] = scope_Spectrum.fromStepping(to);

		// Called synchronously or on the next animationFrame
		var stateUpdate = function() {
			scope_Handles[handleNumber].style[options.style] = toPct(to);
			updateConnect(handleNumber);
			updateConnect(handleNumber + 1);
		};

		// Set the handle to the new position.
		// Use requestAnimationFrame for efficient painting.
		// No significant effect in Chrome, Edge sees dramatic performace improvements.
		// Option to disable is useful for unit tests, and single-step debugging.
		if ( window.requestAnimationFrame && options.useRequestAnimationFrame ) {
			window.requestAnimationFrame(stateUpdate);
		} else {
			stateUpdate();
		}
	}

	function setZindex ( ) {

		scope_HandleNumbers.forEach(function(handleNumber){
			// Handles before the slider middle are stacked later = higher,
			// Handles after the middle later is lower
			// [[7] [8] .......... | .......... [5] [4]
			var dir = (scope_Locations[handleNumber] > 50 ? -1 : 1);
			var zIndex = 3 + (scope_Handles.length + (dir * handleNumber));
			scope_Handles[handleNumber].childNodes[0].style.zIndex = zIndex;
		});
	}

	// Test suggested values and apply margin, step.
	function setHandle ( handleNumber, to, lookBackward, lookForward ) {

		to = checkHandlePosition(scope_Locations, handleNumber, to, lookBackward, lookForward, false);

		if ( to === false ) {
			return false;
		}

		updateHandlePosition(handleNumber, to);

		return true;
	}

	// Updates style attribute for connect nodes
	function updateConnect ( index ) {

		// Skip connects set to false
		if ( !scope_Connects[index] ) {
			return;
		}

		var l = 0;
		var h = 100;

		if ( index !== 0 ) {
			l = scope_Locations[index - 1];
		}

		if ( index !== scope_Connects.length - 1 ) {
			h = scope_Locations[index];
		}

		scope_Connects[index].style[options.style] = toPct(l);
		scope_Connects[index].style[options.styleOposite] = toPct(100 - h);
	}

	// ...
	function setValue ( to, handleNumber ) {

		// Setting with null indicates an 'ignore'.
		// Inputting 'false' is invalid.
		if ( to === null || to === false ) {
			return;
		}

		// If a formatted number was passed, attemt to decode it.
		if ( typeof to === 'number' ) {
			to = String(to);
		}

		to = options.format.from(to);

		// Request an update for all links if the value was invalid.
		// Do so too if setting the handle fails.
		if ( to !== false && !isNaN(to) ) {
			setHandle(handleNumber, scope_Spectrum.toStepping(to), false, false);
		}
	}

	// Set the slider value.
	function valueSet ( input, fireSetEvent ) {

		var values = asArray(input);
		var isInit = scope_Locations[0] === undefined;

		// Event fires by default
		fireSetEvent = (fireSetEvent === undefined ? true : !!fireSetEvent);

		values.forEach(setValue);

		// Animation is optional.
		// Make sure the initial values were set before using animated placement.
		if ( options.animate && !isInit ) {
			addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
		}

		// Now that all base values are set, apply constraints
		scope_HandleNumbers.forEach(function(handleNumber){
			setHandle(handleNumber, scope_Locations[handleNumber], true, false);
		});

		setZindex();

		scope_HandleNumbers.forEach(function(handleNumber){

			fireEvent('update', handleNumber);

			// Fire the event only for handles that received a new value, as per #579
			if ( values[handleNumber] !== null && fireSetEvent ) {
				fireEvent('set', handleNumber);
			}
		});
	}

	// Reset slider to initial values
	function valueReset ( fireSetEvent ) {
		valueSet(options.start, fireSetEvent);
	}

	// Get the slider value.
	function valueGet ( ) {

		var values = scope_Values.map(options.format.to);

		// If only one handle is used, return a single value.
		if ( values.length === 1 ){
			return values[0];
		}

		return values;
	}

	// Removes classes from the root and empties it.
	function destroy ( ) {

		for ( var key in options.cssClasses ) {
			if ( !options.cssClasses.hasOwnProperty(key) ) { continue; }
			removeClass(scope_Target, options.cssClasses[key]);
		}

		while (scope_Target.firstChild) {
			scope_Target.removeChild(scope_Target.firstChild);
		}

		delete scope_Target.noUiSlider;
	}

	// Get the current step size for the slider.
	function getCurrentStep ( ) {

		// Check all locations, map them to their stepping point.
		// Get the step point, then find it in the input list.
		return scope_Locations.map(function( location, index ){

			var nearbySteps = scope_Spectrum.getNearbySteps( location );
			var value = scope_Values[index];
			var increment = nearbySteps.thisStep.step;
			var decrement = null;

			// If the next value in this step moves into the next step,
			// the increment is the start of the next step - the current value
			if ( increment !== false ) {
				if ( value + increment > nearbySteps.stepAfter.startValue ) {
					increment = nearbySteps.stepAfter.startValue - value;
				}
			}


			// If the value is beyond the starting point
			if ( value > nearbySteps.thisStep.startValue ) {
				decrement = nearbySteps.thisStep.step;
			}

			else if ( nearbySteps.stepBefore.step === false ) {
				decrement = false;
			}

			// If a handle is at the start of a step, it always steps back into the previous step first
			else {
				decrement = value - nearbySteps.stepBefore.highestStep;
			}


			// Now, if at the slider edges, there is not in/decrement
			if ( location === 100 ) {
				increment = null;
			}

			else if ( location === 0 ) {
				decrement = null;
			}

			// As per #391, the comparison for the decrement step can have some rounding issues.
			var stepDecimals = scope_Spectrum.countStepDecimals();

			// Round per #391
			if ( increment !== null && increment !== false ) {
				increment = Number(increment.toFixed(stepDecimals));
			}

			if ( decrement !== null && decrement !== false ) {
				decrement = Number(decrement.toFixed(stepDecimals));
			}

			return [decrement, increment];
		});
	}

	// Attach an event to this slider, possibly including a namespace
	function bindEvent ( namespacedEvent, callback ) {
		scope_Events[namespacedEvent] = scope_Events[namespacedEvent] || [];
		scope_Events[namespacedEvent].push(callback);

		// If the event bound is 'update,' fire it immediately for all handles.
		if ( namespacedEvent.split('.')[0] === 'update' ) {
			scope_Handles.forEach(function(a, index){
				fireEvent('update', index);
			});
		}
	}

	// Undo attachment of event
	function removeEvent ( namespacedEvent ) {

		var event = namespacedEvent && namespacedEvent.split('.')[0];
		var namespace = event && namespacedEvent.substring(event.length);

		Object.keys(scope_Events).forEach(function( bind ){

			var tEvent = bind.split('.')[0],
				tNamespace = bind.substring(tEvent.length);

			if ( (!event || event === tEvent) && (!namespace || namespace === tNamespace) ) {
				delete scope_Events[bind];
			}
		});
	}

	// Updateable: margin, limit, padding, step, range, animate, snap
	function updateOptions ( optionsToUpdate, fireSetEvent ) {

		// Spectrum is created using the range, snap, direction and step options.
		// 'snap' and 'step' can be updated.
		// If 'snap' and 'step' are not passed, they should remain unchanged.
		var v = valueGet();

		var updateAble = ['margin', 'limit', 'padding', 'range', 'animate', 'snap', 'step', 'format'];

		// Only change options that we're actually passed to update.
		updateAble.forEach(function(name){
			if ( optionsToUpdate[name] !== undefined ) {
				originalOptions[name] = optionsToUpdate[name];
			}
		});

		var newOptions = testOptions(originalOptions);

		// Load new options into the slider state
		updateAble.forEach(function(name){
			if ( optionsToUpdate[name] !== undefined ) {
				options[name] = newOptions[name];
			}
		});

		scope_Spectrum = newOptions.spectrum;

		// Limit, margin and padding depend on the spectrum but are stored outside of it. (#677)
		options.margin = newOptions.margin;
		options.limit = newOptions.limit;
		options.padding = newOptions.padding;

		// Update pips, removes existing.
		if ( options.pips ) {
			pips(options.pips);
		}

		// Invalidate the current positioning so valueSet forces an update.
		scope_Locations = [];
		valueSet(optionsToUpdate.start || v, fireSetEvent);
	}

	// Throw an error if the slider was already initialized.
	if ( scope_Target.noUiSlider ) {
		throw new Error("noUiSlider (" + VERSION + "): Slider was already initialized.");
	}

	// Create the base element, initialise HTML and set classes.
	// Add handles and connect elements.
	addSlider(scope_Target);
	addElements(options.connect, scope_Base);

	scope_Self = {
		destroy: destroy,
		steps: getCurrentStep,
		on: bindEvent,
		off: removeEvent,
		get: valueGet,
		set: valueSet,
		reset: valueReset,
		// Exposed for unit testing, don't use this in your application.
		__moveHandles: function(a, b, c) { moveHandles(a, b, scope_Locations, c); },
		options: originalOptions, // Issue #600, #678
		updateOptions: updateOptions,
		target: scope_Target, // Issue #597
		removePips: removePips,
		pips: pips // Issue #594
	};

	// Attach user events.
	bindSliderEvents(options.events);

	// Use the public value method to set the start values.
	valueSet(options.start);

	if ( options.pips ) {
		pips(options.pips);
	}

	if ( options.tooltips ) {
		tooltips();
	}

	aria();

	return scope_Self;

}


	// Run the standard initializer
	function initialize ( target, originalOptions ) {

		if ( !target || !target.nodeName ) {
			throw new Error("noUiSlider (" + VERSION + "): create requires a single element, got: " + target);
		}

		// Test the options and create the slider environment;
		var options = testOptions( originalOptions, target );
		var api = closure( target, options, originalOptions );

		target.noUiSlider = api;

		return api;
	}

	// Use an object instead of a function for future expansibility;
	return {
		version: VERSION,
		create: initialize
	};

}));
},{}],67:[function(require,module,exports){
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}],68:[function(require,module,exports){
var bundleFn = arguments[3];
var sources = arguments[4];
var cache = arguments[5];

var stringify = JSON.stringify;

module.exports = function (fn, options) {
    var wkey;
    var cacheKeys = Object.keys(cache);

    for (var i = 0, l = cacheKeys.length; i < l; i++) {
        var key = cacheKeys[i];
        var exp = cache[key].exports;
        // Using babel as a transpiler to use esmodule, the export will always
        // be an object with the default export as a property of it. To ensure
        // the existing api and babel esmodule exports are both supported we
        // check for both
        if (exp === fn || exp && exp.default === fn) {
            wkey = key;
            break;
        }
    }

    if (!wkey) {
        wkey = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);
        var wcache = {};
        for (var i = 0, l = cacheKeys.length; i < l; i++) {
            var key = cacheKeys[i];
            wcache[key] = key;
        }
        sources[wkey] = [
            Function(['require','module','exports'], '(' + fn + ')(self)'),
            wcache
        ];
    }
    var skey = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);

    var scache = {}; scache[wkey] = wkey;
    sources[skey] = [
        Function(['require'], (
            // try to call default if defined to also support babel esmodule
            // exports
            'var f = require(' + stringify(wkey) + ');' +
            '(f.default ? f.default : f)(self);'
        )),
        scache
    ];

    var workerSources = {};
    resolveSources(skey);

    function resolveSources(key) {
        workerSources[key] = true;

        for (var depPath in sources[key][1]) {
            var depKey = sources[key][1][depPath];
            if (!workerSources[depKey]) {
                resolveSources(depKey);
            }
        }
    }

    var src = '(' + bundleFn + ')({'
        + Object.keys(workerSources).map(function (key) {
            return stringify(key) + ':['
                + sources[key][0]
                + ',' + stringify(sources[key][1]) + ']'
            ;
        }).join(',')
        + '},{},[' + stringify(skey) + '])'
    ;

    var URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

    var blob = new Blob([src], { type: 'text/javascript' });
    if (options && options.bare) { return blob; }
    var workerUrl = URL.createObjectURL(blob);
    var worker = new Worker(workerUrl);
    worker.objectURL = workerUrl;
    return worker;
};

},{}]},{},[39,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63]);
