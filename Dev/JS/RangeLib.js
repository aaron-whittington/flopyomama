 //-if no hero cards are set, we will only calculate villains results, and not win results, these will have to include drawing hands
//-FUTURE if no flop is set, and the hero puts a hand in, we will estimate the equity of that hand compared to the range
//-if a partial flop is input, we will 
//-on the flop, turn, river we will log such stuff as, drawing hand, gutshot, flush draw, straight draw,  top pair/overpair, middle pair, weak pair 


/*SLANSKY RANGES http://en.wikipedia.org/wiki/Texas_hold_%27em_starting_hands*/
var nsRange = {};
var slanskyRanges = [];
slanskyRanges[0] = [];
slanskyRanges[1] = ["AA", "KK", "QQ", "JJ", "AKs"];
slanskyRanges[2] = ["TT", "AQs", "AJs", "KQs", "AKo"];
slanskyRanges[3] = ["99", "ATs", "KJs", "QJs", "JTs", "AQo"];
slanskyRanges[4] = ["88", "KTs", "QTs", "J9s", "T9s", "98s", "AJo", "KQo"];
slanskyRanges[5] = ["77", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s",
    "A2s", "Q9s", "T8s", "97s", "87s", "76s", "KJo", "QJo", "JTo"
];
slanskyRanges[6] = ["66", "55", "K9s", "J8s", "86s", "75s", "65s", "54s", "ATo", "KTo", "QTo"];
slanskyRanges[7] = ["44", "33", "22", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s",
    "Q8s", "T7s", "64s", "43s", "53s", "J9o", "T9o", "98o"
]; //65s missing from wiki
slanskyRanges[8] = ["J7s", "96s", "85s", "74s", "42s", "32s", "A9o", "K9o", "Q9o", "J8o",
    "T8o", "87o", "76o", "65o", "54o"
];

var range = {};

nsRange.fGetSlanskyFromPercent = function(fPercent) {
    var aReturn = [];
    var iHandsAdded = 0;
    for (var slanskyRange = 1; slanskyRange < slanskyRanges.length; slanskyRange++) {
        for (var iHand = 0; iHand < slanskyRanges[slanskyRange].length; iHand++) {
            var nextHand = slanskyRanges[slanskyRange][iHand];
            var oPair = new Pair(nextHand);
            iHandsAdded += oPair.get("comb");

            if (iHandsAdded / TOTAL_STARTING_COMBINATIONS < fPercent) {
                aReturn = fPushArrayMultiDim(aReturn, nextHand);
            } else
                return aReturn;
        }
    }
    return aReturn;
};

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

nsRange.fGetStatisticalFromPercent = function(fPercent) {
    var aReturn = [];
    var iHandsAdded = 0;
    var lastEquity = 0;
    for (var i = 0; i < range.aStatData.length; i++) {
        var hand = range.aStatData[i].sPair;
        var oPair = new Pair(hand);
        iHandsAdded += oPair.get("comb");
        if (oPair.get("suited") === false && oPair.get("rank1") !== oPair.get("rank2"))
            hand = hand[0] + hand[1] + 'o'; //add offsuit symbol
        if (iHandsAdded / TOTAL_STARTING_COMBINATIONS <= fPercent) {

            aReturn.push(hand);
            lastEquity = range.aStatData[i].flEq;
        } else if (lastEquity === range.aStatData[i].flEq) //when the equity is the same add them all (actually we should check this...)
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


nsRange.fGetAllUnknownCombinationsThreaded = function() {
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

    var aKnownCards = flopYoMama.knownCards.allKnown(true);
    var aUnknownCards = flopYoMama.knownCards.allUnknown(true);
    var aFixedBoardCards = flopYoMama.knownCards.get('board').map(function(m) {
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

        var sWorkerName = 'Worker.js';
        var state = window.history.state;
        if (state !== null) {
            var test = state.valueOf();
            var test2 = state.toString();

        }
        var worker = new Worker('JS/' + sWorkerName);
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

nsRange.fGetTextures = function() {
    if (typeof(Worker) === "undefined") {
        alert('Browser must support webworkers!');
        return;
    }
    $('.no_results').remove();
    //aoStartingHands,aKnownCards,aFixedBoardCards
    var aoStartingHands = nsRange.fGetStartingHandsFromRangeGrid();
    var aKnownCards = flopYoMama.knownCards.allKnown(true);
    var aFixedBoardCards = flopYoMama.knownCards.get('board').map(function(m) {
        return m.attributes;
    });
    var oFilter = nsFilter.fActiveFilter(null, true);

    var fStartWorker = function() {
        var sWorkerName = 'WorkerTextures.js';
        var worker = new Worker('JS/' + sWorkerName); //don't know why I specify path like this from html root	
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
            //nsUtil.fLog('message received: ' + e.data);
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

var fGetStartingHandStrings = function() {
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

var fIdenticalCards = function(a, b) {
    return (a.rank === b.rank && a.suit === b.suit);
};
