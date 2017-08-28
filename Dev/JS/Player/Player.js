DEFAULT_CHIP_COUNT = 10000;
Player = function(position = 0, chips = DEFAULT_CHIP_COUNT, isHero = false) {
    this.position = position;
    this.chips = chips;
    this.isHero = false;
}

module.exports = Player;