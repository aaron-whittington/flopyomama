
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

module.exports = nsHtml;
