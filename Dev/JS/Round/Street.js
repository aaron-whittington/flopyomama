var nsConvert = require('../Core/Convert');

var Street = function(street, cards) {

    this.actions = [];
    this.street = street;
    this.cards = cards;

    this.winLossDraw = {
        win: 0,
        loss: 0,
        draw: 0
    };

    this.textures = {};

    this.setWinLossDraw = function (win, loss, draw) {
        this.winLossDraw.win = win; 
        this.winLossDraw.loss = loss; 
        this.winLossDraw.draw = draw; 
    };

    this.setTextures = function (textures) {
        this.textures = textures;
    }
    
    this.getLabel = function() {
        return nsConvert.streetConstantToString(this.street); 
        //+ ' ' + cards.map(nsConvert.fConvertCardObjectToString).join(' ');
    }
}

module.exports = Street;