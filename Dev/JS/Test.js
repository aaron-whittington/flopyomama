$(document).ready(function() {


    $('#start_calcs_now').click(function() {

        var startTime = new Date().getTime();
        console.log(' starting arbitrary test');
        nsRange.fGetAllUnknownCombinationsThreaded();
        //progress.one
        $('#win_percent_bar').one('done', function() {
            var endTime = new Date().getTime();
            console.log(' test took ' + (endTime - startTime) / 1000.0 + ' seconds ');
        });

    });

    //problem 8H AD 6C 8C AC !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    $("#test_short").click(function() {
        nsUI.fDeleteBoard();
        //['Q♣', '5♦', '4♥', 'A♥', '9♥'] // HERO + BOARD NOTICE THAT VILLAIN RESULTS HAS 0 HIGHCARD WINS! // and ZERO FLUSHES .... must be wrong
        $('#known_1 span').html('T' + nsConvert.suitToDisplayChar(1)).addClass("known_card_set"); //should be authomatic instead of boiler plate code
        $('#known_2 span').html('7' + nsConvert.suitToDisplayChar(2)).addClass("known_card_set");
        $('#known_3 span').html('2' + nsConvert.suitToDisplayChar(4)).addClass("known_card_set");
        $('#known_4 span').html('A' + nsConvert.suitToDisplayChar(3)).addClass("known_card_set");
        $('#known_5 span').html('J' + nsConvert.suitToDisplayChar(2)).addClass("known_card_set");
        //$('#known_6 span').html ('5' + nsConvert.suitToDisplayChar(2)).addClass("known_card_set");
        //$('#known_7 span').html ('6' + nsConvert.suitToDisplayChar(2)).addClass("known_card_set");
        $("#range_slider").slider('value', 25.0);

        $('#known_1 span').html('Q♣'); //should be authomatic instead of boiler plate code
        $('#known_2 span').html('5♦').addClass("known_card_set");
        $('#known_3 span').html('4♥').addClass("known_card_set");
        $('#known_4 span').html('A♥').addClass("known_card_set");
        $('#known_5 span').html('9♥').addClass("known_card_set");


        //['A♣', 'J♠', '9♥', '4♥', 'Q♥']
        $('#known_1 span').html('A♣'); //should be authomatic instead of boiler plate code
        $('#known_2 span').html('J♠').addClass("known_card_set");
        $('#known_3 span').html('9♥').addClass("known_card_set");
        $('#known_4 span').html('4♥').addClass("known_card_set");
        $('#known_5 span').html('Q♥').addClass("known_card_set");

        nsUI.fSetBoardCard('A♥'); //should be authomatic instead of boiler plate code
        nsUI.fSelectNext();
        nsUI.fSetBoardCard('J♥');
        nsUI.fSelectNext();
        nsUI.fSetBoardCard('K♥');
        nsUI.fSelectNext();
        nsUI.fSetBoardCard('T♥');
        nsUI.fSelectNext();
        nsUI.fSetBoardCard('Q♥');
        nsUI.fSelectNext();
        nsUI.fSetBoardCard('J♠');
        nsUI.fSelectNext();
        nsUI.fSetBoardCard('Q♣');


        var startTime = new Date().getTime();
        var cards1, cards2, hand1, hand2;

        nsRange.fGetAllUnknownCombinationsThreaded();
        //progress.one
        $('#results_progress').one('done', function() {
            var endTime = new Date().getTime();
            nsUtil.fLog(' test took ' + (endTime - startTime) / 1000.0 + ' seconds ');
        });

        nsUtil.fLog('in the following hands, hand one should beat hand 2'); {
            cards1 = nsConvert.fConvertStringToCardObject(['A♥', 'K♣', 'Q♣', 'J♦', '5♦', '3♣', '2♠']);
            cards2 = nsConvert.fConvertStringToCardObject(['A♥', 'J♦', 'T♣', '7♦', '5♦', '3♣', '2♠']);
            hand1 = nsHand.fGetBestHand(cards1);
            hand2 = nsHand.fGetBestHand(cards2);

            nsUtil.fLog('hand 1 compared to hand 2 ' + nsHand.fCompareHand(hand1, hand2));
        }

        {
            //one pair better kickers in first hand
            cards1 = nsConvert.fConvertStringToCardObject(['A♥', 'K♣', 'Q♣', 'J♦', 'J♣', '3♣', '2♠']);
            cards2 = nsConvert.fConvertStringToCardObject(['A♥', 'J♦', 'T♣', 'J♣', '5♦', '3♣', '2♠']);
            hand1 = nsHand.fGetBestHand(cards1);
            hand2 = nsHand.fGetBestHand(cards2);

            nsUtil.fLog('hand 1 compared to hand 2 ' + nsHand.fCompareHand(hand1, hand2));
        }

        {
            //straight flush vs. straight
            cards1 = nsConvert.fConvertStringToCardObject(['A♥', 'K♥', 'Q♥', 'J♥', 'T♥', '3♣', '2♠']);
            cards2 = nsConvert.fConvertStringToCardObject(['A♥', 'K♥', 'Q♥', 'J♥', 'T♠', '3♣', '2♠']);
            hand1 = nsHand.fGetBestHand(cards1);
            hand2 = nsHand.fGetBestHand(cards2);

            nsUtil.fLog('hand 1 compared to hand 2 ' + nsHand.fCompareHand(hand1, hand2));
        }


        nsUtil.fLog('in the following hands should be the same rank'); {
            //two straights
            cards1 = nsConvert.fConvertStringToCardObject(['6♥', '5♥', '4♣', '3♦', '2♣', '2♥', '2♠']);
            cards2 = nsConvert.fConvertStringToCardObject(['6♣', '5♣', '4♣', '3♦', '2♣', '2♥', '2♠']);
            hand1 = nsHand.fGetBestHand(cards1);
            hand2 = nsHand.fGetBestHand(cards2);
            nsUtil.fLog('hand 1 compared to hand 2 ' + nsHand.fCompareHand(hand1, hand2));
            //one pair same kickers
            cards1 = nsConvert.fConvertStringToCardObject(['6♥', '5♥', '4♣', '3♦', '8♣', '2♥', '2♠']);
            cards2 = nsConvert.fConvertStringToCardObject(['6♣', '5♣', '4♦', '3♦', '8♣', '2♥', '2♠']);
            hand1 = nsHand.fGetBestHand(cards1);
            hand2 = nsHand.fGetBestHand(cards2);

            nsUtil.fLog('hand 1 compared to hand 2 ' + nsHand.fCompareHand(hand1, hand2));
        }
    });

    $("#test_long").click(function() {
        nsUI.fDeleteBoard();
        //$('#known_1 span').html ('A' + nsConvert.suitToDisplayChar(1)).addClass("known_card_set"); //should be authomatic instead of boiler plate code
        //$('#known_2 span').html ('8' + nsConvert.suitToDisplayChar(2)).addClass("known_card_set");
        //$('#known_3 span').html ('2' + nsConvert.suitToDisplayChar(4)).addClass("known_card_set");
        //$('#known_4 span').html ('2' + nsConvert.suitToDisplayChar(3)).addClass("known_card_set"); //add one more because browser didn't like the big search yet 

        nsUI.fSetBoardCard('6♣5♣4♦3♦');

        //20130802
        //106.004 20130802 19:31
        //105.516 19:46 small opimization of loops
        /*v0.1 results
          total win count: 1961911 total loss count: 2386125 total draw count: 325472
          total win %: 0.41979408187596984 total loss %: 0.5105640131567123 total draw %: 0.06964190496731791 */
        /*V 0.2 WRONG ??total win count: (8 more) 1961919 total loss count: (10 fewer) 2386115 total draw count: (2 more) 325474 
        	total win %: 41.979579365222015 total loss %: 51.056187343639934 total draw %: 6.964233291138049 */
        /*AFTER BUGFIX total win count: 1961931 total loss count: 2386096 total draw count: 325481 range.js:60
        	total win %: 41.97983613165956 total loss %: 51.05578079678049 total draw %: 6.96438307155995 */
        //65.56 seconds after filtering out flush redundancy
        //56 seconds after further optimization of flush redundancy
        //20.3 seconds with 3 webworkers
        //16.896 seconds with 4 of them
        //41.437 same with firefox + firebug
        //19.8, 20.7 seconds (with a different board) 2013085
        //9.08 seconds  sending the pairs as objects
        //test took 9.238 seconds  test.js:136
        //total win count: 2477156 total loss count: 2314243 total draw count: 481381 range.js:327
        //total win %: 50.83660661880898 total loss %: 47.49327899063779 total draw %: 1.6701143905532365 

        /*TEST STANDARDIZE FUNCTIONALITY*/

        //PROBABLY FAULTY total win count: 2886247 total loss count: 2354397 total draw count: 4100096 range.js:328
        //total win %: 54.042080310968146 total loss %: 44.083722480405335 total draw %: 1.87419720862652 
        //STILL UNEXPECTED total win count: 2570562 total loss count: 2205731 total draw count: 495540 range.js:328
        //total win %: 52.76375442261671 total loss %: 45.275176714801184 total draw %: 1.9610688625821122 
        //STILL WRONG total win count: 2571931 total loss count: 2203982 total draw count: 496867 range.js:328
        //total win %: 52.781594900652195 total loss %: 45.230484446250394 total draw %: 1.9879206530974105 
        //CORRECT WIN, WRONG DRAW, WRONG LOSS BUT ACTUALLY SLOWER THAN BEFORE test took 13.395 seconds 
        //total win count: 2477156 total loss count: 2301294 total draw count: 494330 range.js:328
        //total win %: 50.83660661880898 total loss %: 47.22753746321402 total draw %: 1.9358559179770072 	

        //flopyomama 0.6 after optimization of hand.js
        //test took 8.865 seconds  test.js:152
        //total win count: 2477156 total loss count: 2314243 total draw count: 481381 range.js:328
        //total win %: 50.83660661880898 total loss %: 47.49327899063779 total draw %: 1.6701143905532365 


        $("#range_slider").slider('value', 25.0);

        var startTime = new Date().getTime();
        nsUtil.fLog(' starting long test (THIS MAY TAKE A WHILE)');
        nsRange.fGetAllUnknownCombinationsThreaded();
        //progress.one
        $('#win_percent_bar').one('done', function() {
            var endTime = new Date().getTime();
            nsUtil.fLog(' test took ' + (endTime - startTime) / 1000.0 + ' seconds ');
        });

    });

    $("#test_ultra").click(function() {
        nsUI.fDeleteBoard();
        if (confirm('This could take a REALLY long time. Proceed?')) {
            $('#known_1 span').html('T' + nsConvert.suitToDisplayChar(1)).addClass("known_card_set"); //should be authomatic instead of boiler plate code
            $('#known_2 span').html('4' + nsConvert.suitToDisplayChar(2)).addClass("known_card_set");


            $("#range_slider").slider('value', 25.0);

            var startTime = new Date().getTime();
            console.log(' starting long test (THIS MAY TAKE A VERY LONG TIME)');
            nsRange.fGetAllUnknownCombinationsThreaded();
            //progress.one
            $('#results_progress').one('done', function() {
                var endTime = new Date().getTime();
                nsUtil.fLog(' test took ' + (endTime - startTime) / 1000.0 + ' seconds ');
            });
        }
    });
});