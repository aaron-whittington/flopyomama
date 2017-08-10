describe("NSHand", function() {
 
	var nsHand = require('../Dev/JS/Hand/NSHand');
    var nsConvert = require('../Dev/JS/Core/Convert');
    var oHand = require('../Dev/JS/Hand/Hand');
    var CardList = require('../Dev/JS/Card/CardList');
  
    function testHands(playerHand, villainHand, rankPlayer, rankVillain, expectDraw = false) {
            var cards1 = nsConvert.fConvertStringToCardObject(playerHand);
            var cards2 = nsConvert.fConvertStringToCardObject(villainHand);
            if(cards1.length != 7)
               throw 'wrong number of hero cards';
            if(cards2.length != 7)
               throw 'wrong number of villain cards';
            var hand1 = nsHand.fGetBestHand(cards1);
            var hand2 = nsHand.fGetBestHand(cards2);

            expect(hand1.rank).toEqual(rankPlayer);
            expect(hand2.rank).toEqual(rankVillain);

            var results = nsHand.fCompareHand(hand1, hand2); 
            if(expectDraw) {
                expect(results).toEqual(0);
            } else {
                expect(results).toBeLessThan(0);
                var reversed = nsHand.fCompareHand(hand2, hand1); 
                expect(reversed).toBeGreaterThan(0);
            } 
            //check reversed
    }

    describe('high cards', function() {
        it('high card wins', function() {
            testHands(
                ['A♥', 'K♣', 'Q♣', 'J♦', '5♦', '3♣', '2♠'],
                ['K♥', 'J♦', 'T♣', '7♦', '5♦', '3♣', '2♠'],
                oHand.HIGH_CARD, 
                oHand.HIGH_CARD 
            );
        });

        it('high card with multiple kickers', function() {
            testHands(
                ['A♥', 'T♣', 'Q♣', 'J♦', '9♦', '3♣', '2♠'],
                ['A♥', 'TD', 'Q♣', 'J♦', '8♦', '3♣', '2♠'],
                oHand.HIGH_CARD, 
                oHand.HIGH_CARD 
            );
        });

        it('should handle multiple kickers 2', function() {
            testHands(
                ['A♥', 'K♣', 'Q♣', 'J♦', '5♦', '3♣', '2♠'],
                ['AS', 'K♦', 'T♣', '7♦', '5♦', '3♣', '2♠'],
                oHand.HIGH_CARD, 
                oHand.HIGH_CARD 
            );
        });

        it('equal high cards tie', function() {
            testHands(
                ['A♥', 'K♣', 'Q♣', 'J♦', '5♦', '3♣', '2♠'],
                ['AD', 'KS', 'Q♣', 'J♦', '5♦', '3♣', '2♠'],
                oHand.HIGH_CARD, 
                oHand.HIGH_CARD,
                true
            );
        });
    });

    describe('One Pair', function() {
        it('one pair beats high card', function() {
            testHands(
                ['3♥', '4D', 'Q♣', 'J♦', '5♦', '3♣', '2♠'],
                ['AS', 'K♦', 'T♣', '7♦', '5♦', '3♣', '2♠'],
                oHand.PAIR, 
                oHand.HIGH_CARD 
            );
        });

        it('higher pair wins', function() {
            testHands(
                ['3♥', '4D', 'Q♣', 'J♦', '5♦', '3♣', '2♠'],
                ['AS', '2♦', 'T♣', '7♦', '5♦', '3♣', '2♠'],
                oHand.PAIR, 
                oHand.PAIR
            );
        });

        it('same pair with kickers wins', function() {
            testHands(
                ['3♥', '4D', 'Q♣', 'J♦', '6♦', '3♣', '2♠'],
                ['3S', '4C', 'Q♣', 'J♦', '5♦', '3♣', '2♠'],
                oHand.PAIR, 
                oHand.PAIR
            );
        });

        it('same pair, same kickers tie', function() {
            testHands(
                ['A♥', '4D', 'Q♣', 'J♦', '8♦', 'A♣', '2♠'],
                ['AS', '3C', 'Q♣', 'J♦', '8♦', 'A♣', '2♠'],
                oHand.PAIR, 
                oHand.PAIR, 
                true
            );
        });
    });

    describe('Two Pair', function() {
        it('two pair beats one pair', function() {
            testHands(
                ['3♥', '5D', 'Q♣', 'J♦', '5♦', '3♣', '2♠'],
                ['5S', 'K♦', 'T♣', '7♦', '5♦', '3♣', '2♠'],
                oHand.TWO_PAIR, 
                oHand.PAIR
            );
        });

        it('two pair beats lower two pair (lower equal)', function() {
            testHands(
                ['J♥', '5D', 'Q♣', 'J♦', '5♦', '3♣', '2♠'],
                ['3♥', '5D', 'Q♣', 'J♦', '5♦', '3♣', '2♠'],
                oHand.TWO_PAIR, 
                oHand.TWO_PAIR
            );
        });

        it('two pair beats lower two pair (lower different)', function() {
            testHands(
                ['J♥', '3D', 'Q♣', 'J♦', '5♦', '3♣', '2♠'],
                ['3♥', '5D', 'Q♣', 'J♦', '5♦', '3♣', '2♠'],
                oHand.TWO_PAIR, 
                oHand.TWO_PAIR
            );
        });

        it('two pair beats lower two pair (upper same lower different)', function() {
            testHands(
                ['J♥', '5H', 'Q♣', 'J♦', '5♦', '3♣', '2♠'],
                ['JD', '3S', 'Q♣', 'J♦', '5♦', '3♣', '2♠'],
                oHand.TWO_PAIR, 
                oHand.TWO_PAIR
            );
        });

        it('two pair with kicker wins', function() {
            testHands(
                ['J♥', 'AH', 'Q♣', 'J♦', '5♦', '5♣', '2♠'],
                ['JD', 'KS', 'Q♣', 'J♦', '5♦', '5♣', '2♠'],
                oHand.TWO_PAIR, 
                oHand.TWO_PAIR
            );
        });

        it('two pair with same kicker wins ties', function() {
            testHands(
                ['J♥', 'AH', 'Q♣', 'J♦', '5♦', '5♣', '2♠'],
                ['JD', 'AS', 'Q♣', 'J♦', '5♦', '5♣', '2♠'],
                oHand.TWO_PAIR, 
                oHand.TWO_PAIR,
                true
            );
        });
    });
    
    describe('Three of a Kind', function() {

        it('beats two pair', function() {
            testHands(
                ['7D', '5C', 'Q♣', 'J♦', '5♦', '5♣', '2♠'],
                ['J♥', 'AH', 'Q♣', 'J♦', '5♦', '5♣', '2♠'],
                oHand.THREE_OF_A_KIND,
                oHand.TWO_PAIR 
            );
        });

        it('beats lower three of a kind', function() {
            testHands(
                ['5D', '5H', 'Q♣', 'J♦', '5S', '7♣', '2♠'],
                ['2D', '2C', 'Q♣', 'J♦', '5S', '7C', '2♠'],
                oHand.THREE_OF_A_KIND,
                oHand.THREE_OF_A_KIND
            );
        });

        it('beats same three of a kind with kickers', function() {
            testHands(
                ['AH', '5S', 'Q♣', 'J♦', '5♦', '5♣', '2D'],
                ['7D', '5H', 'Q♣', 'J♦', '5♦', '5♣', '2D'],
                oHand.THREE_OF_A_KIND,
                oHand.THREE_OF_A_KIND
            );
        });

        it('beats same three of a kind with second kickers', function() {
            testHands(
                ['KH', '5S', 'A♣', 'J♦', '5♦', '5♣', '2D'],
                ['QD', '5H', 'A♣', 'J♦', '5♦', '5♣', '2D'],
                oHand.THREE_OF_A_KIND,
                oHand.THREE_OF_A_KIND
            );
        });

        it('ties with same kickers', function() {
            testHands(
                ['8H', '5S', 'Q♣', 'J♦', '5♦', '5♣', '2D'],
                ['7H', '5H', 'Q♣', 'J♦', '5♦', '5♣', '2D'],
                oHand.THREE_OF_A_KIND,
                oHand.THREE_OF_A_KIND,
                true
            );
        });
    });
    
    describe('straight', function() {
        it('beats three of a kind', function() {
            testHands(
                ['QH', 'KS', 'A♣', 'J♦', '5♦', '5♣', 'TD'],
                ['QD', '5H', 'A♣', 'J♦', '5♦', '5♣', 'TD'],
                oHand.STRAIGHT,
                oHand.THREE_OF_A_KIND
            );
        });
         
        it('detects straights aces low', function() {
            testHands(
                ['3H', '4S', 'A♣', '2♦', '5♦', '5♣', 'TD'],
                ['QD', '5H', 'A♣', '2♦', '5♦', '5♣', 'TD'],
                oHand.STRAIGHT,
                oHand.THREE_OF_A_KIND
            );
        });

        it('detects superior straights (aces low)', function() {
            testHands(
                ['3D', '6D', 'A♣', '2♦', '4d', '5♣', 'TD'],
                ['3H', 'TS', 'A♣', '2♦', '4♦', '5♣', 'TD'],
                oHand.STRAIGHT,
                oHand.STRAIGHT
            );
        });

        it('detects superior straights (aces high)', function() {
            testHands(
                ['AD', '6D', 'Q♣', 'K♦', 'Jd', 'T♣', '2D'],
                ['9H', '6D', 'Q♣', 'K♦', 'Jd', 'T♣', '2D'],
                oHand.STRAIGHT,
                oHand.STRAIGHT
            );
        });

        it('equal straights tie', function() {
            testHands(
                ['AD', '6D', 'Q♣', 'K♦', 'Jd', 'T♣', '2D'],
                ['AS', '7H', 'Q♣', 'K♦', 'Jd', 'T♣', '5H'],
                oHand.STRAIGHT,
                oHand.STRAIGHT,
                true 
            );
        });
    });
    
    describe('Flush', function() {
        it('beats a straight', function() {
            testHands(
                ['TD', '3D', 'A♣', 'J♦', '5♦', '5♣', 'TD'],
                ['QH', 'KS', 'A♣', 'J♦', '5♦', '5♣', 'TD'],
                oHand.FLUSH,
                oHand.STRAIGHT
            );
        });

        it('bigger wins', function() {
            testHands(
                ['KD', '2D', 'AC', 'JD', '5D', '5C', 'TD'],
                ['9D', '3D', 'AC', 'JD', '5D', '5C', 'TD'],
                oHand.FLUSH,
                oHand.FLUSH
            );
        });

        it('bigger wins later card (3rd card different)', function() {
            testHands(
                ['9D', '3D', 'AC', 'JD', '5D', '5C', 'TD'],
                ['8D', '2D', 'AC', 'JD', '5D', '5C', 'TD'],
                oHand.FLUSH,
                oHand.FLUSH
            );
        });

        it('bigger wins later card (fifth card different)', function() {
            testHands(
                ['2C', '3D', 'AD', 'JD', 'TD', '5C', '9D'],
                ['AH', '2D', 'AD', 'JD', 'TD', '5C', '9D'],
                oHand.FLUSH,
                oHand.FLUSH
            );
        });

        it('equal flushes tie', function() {
            testHands(
                ['2C', '5C', 'AD', 'JD', 'TD', '5D', '9D'],
                ['AH', 'JH', 'AD', 'JD', 'TD', '5D', '9D'],
                oHand.FLUSH,
                oHand.FLUSH,
                true
            );
        });
    });
    
    describe('full house', function() {
        
        it('beats flushes', function() {
            testHands(
                ['5H', '5C', 'AD', 'TD', 'TC', '5D', '9D'],
                ['AH', 'JD', 'AD', 'TD', 'TC', '5D', '9D'],
                oHand.FULL_HOUSE,
                oHand.FLUSH
            );
        });

        it('beats full houses when high rank higher', function() {
            testHands(
                ['5S', 'TH', 'AD', 'TD', 'TC', '5D', '9D'],
                ['5H', '5C', 'AD', 'TD', 'TC', '5D', '9D'],
                oHand.FULL_HOUSE,
                oHand.FULL_HOUSE
            );
        });

        it('beats full houses when low rank higher', function() {
            testHands(
                ['5H', '5S', 'AD', 'TD', 'TC', 'TS', '9D'],
                ['2H', '2S', 'AD', 'TD', 'TC', 'TS', '9D'],
                oHand.FULL_HOUSE,
                oHand.FULL_HOUSE
            );
        });

        it('ties with other full houses', function() {
            testHands(
                ['AH', '5S', 'AD', 'TD', 'TC', 'TS', '9D'],
                ['AC', 'QS', 'AD', 'TD', 'TC', 'TS', '9D'],
                oHand.FULL_HOUSE,
                oHand.FULL_HOUSE,
                true
            );
        });
        
        it('two 3-sets (tie)', function() {
            testHands(
                ['AH', 'TS', 'AD', 'AH', 'TC', 'TS', '9D'],
                ['AC', 'QS', 'AD', 'AH', 'TC', 'TS', '9D'],
                oHand.FULL_HOUSE,
                oHand.FULL_HOUSE,
                true
            );
        });
       
        it('two 3-sets higher set counts as main', function() {
            testHands(
                ['AH', 'TS', 'AD', 'AH', 'TC', 'TS', '9D'],
                ['TS', 'QS', 'AD', 'AH', 'TC', 'TS', '9D'],
                oHand.FULL_HOUSE,
                oHand.FULL_HOUSE
            );
        });
        //make sure two sets converts to BETTER Full HOuse
    });
    
    describe('4 of a kind', function() {

        it('beats full houses', function() {
            testHands(
                ['AH', 'TH', 'AD', 'TD', 'TC', 'TS', '9D'],
                ['AC', 'QS', 'AD', 'TD', 'TC', 'TS', '9D'],
                oHand.FOUR_OF_A_KIND,
                oHand.FULL_HOUSE
            );
        });

        it('beats lower 4 of a kind', function() {
            testHands(
                ['TH', 'TS', 'AD', 'TD', 'TC', '9S', '9D'],
                ['9C', '9H', 'AD', 'TD', 'TC', '9S', '9D'],
                oHand.FOUR_OF_A_KIND,
                oHand.FOUR_OF_A_KIND
            );
        });

        it('beats same 4 of a kind with kicker', function() {
            testHands(
                ['TH', 'KS', 'QD', 'TD', 'TC', 'TS', '9D'],
                ['TH', '2S', 'QD', 'TD', 'TC', 'TS', '9D'],
                oHand.FOUR_OF_A_KIND,
                oHand.FOUR_OF_A_KIND
            );
        });
        it('ties same 4 of a kind without kicker', function() {
            testHands(
                ['TH', 'JS', 'QD', 'TD', 'TC', 'TS', '9D'],
                ['TH', '2S', 'QD', 'TD', 'TC', 'TS', '9D'],
                oHand.FOUR_OF_A_KIND,
                oHand.FOUR_OF_A_KIND,
                true
            );
        });
    });
    
    describe('Straight Flush', function() {
        it('beats 4 of a kind', function() {
            testHands(
                ['7H', '6H', '5H', '4H', '3H', 'TS', 'TD'],
                ['TC', 'TH', '5H', '4H', '3H', 'TS', 'TD'],
                oHand.STRAIGHT_FLUSH,
                oHand.FOUR_OF_A_KIND
            );
        });

        it('beats a smaller straight flush', function() {
            testHands(
                ['7H', '6H', '5H', '4H', '3H', 'TS', 'TD'],
                ['2H', '6H', '5H', '4H', '3H', 'TS', 'TD'],
                oHand.STRAIGHT_FLUSH,
                oHand.STRAIGHT_FLUSH
            );
        });

        it('beats a smaller straight (ACES LOW)', function() {
            testHands(
                ['7H', '6H', '5H', '4H', '3H', 'TS', 'TD'],
                ['2H', 'AH', '5H', '4H', '3H', 'TS', 'TD'],
                oHand.STRAIGHT_FLUSH,
                oHand.STRAIGHT_FLUSH
            );
        });

        it('beats a smaller straight (ACES HIGH)', function() {
            testHands(
                ['AH', 'KH', 'QH', 'JH', 'TH', 'TS', 'TD'],
                ['9H', '8H', 'QH', 'JH', 'TH', 'TS', 'TD'],
                oHand.STRAIGHT_FLUSH,
                oHand.STRAIGHT_FLUSH
            );
        });

        it('equal straight flushes tie', function() {
            testHands(
                ['9C', '5C', 'QH', 'JH', 'TH', '9H', '8H'],
                ['AC', '3C', 'QH', 'JH', 'TH', '9H', '8H'],
                oHand.STRAIGHT_FLUSH,
                oHand.STRAIGHT_FLUSH,
                true
            );
        });
    });
});
