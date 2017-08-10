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

