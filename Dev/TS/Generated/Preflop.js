"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Card_1 = require("./Card");
var Preflop = (function () {
    function Preflop(hero1, hero2, badguy1, badguy2) {
        this.hero1 = hero1;
        this.hero2 = hero2;
        this.badguy1 = badguy1;
        this.badguy2 = badguy2;
        var card = new Card_1.Card(1, 2);
    }
    return Preflop;
}());
exports.Preflop = Preflop;
//# sourceMappingURL=Preflop.js.map