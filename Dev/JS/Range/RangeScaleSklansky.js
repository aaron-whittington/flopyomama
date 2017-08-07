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
