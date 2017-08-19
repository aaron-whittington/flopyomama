/*standard filters*/
nsStandardFilters = {};
nsStandardFilters['filter_strong_hand'] = {
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

nsStandardFilters['filter_junk'] = {
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

nsStandardFilters['filter_bluffy'] = {
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

nsStandardFilters['filter_monster'] = {
    "oValues": {
        "sub_filter_type": "class_made_hand",
        "comparator_op": "at_least",
        "made_hand_op": "made_hand_3"
    },
    'name': 'Monster'
}
/*standard empty filters*/
nsStandardFilters.meta = {};
nsStandardFilters.meta.group = {
    "sub_filter_type": "class_group",
    "group_log_op": "log_op_or"
};
nsStandardFilters.meta.madeHand = {
    "sub_filter_type": "class_made_hand",
    "comparator_op": "at_least",
    "made_hand_op": "made_hand_0"
};
nsStandardFilters.meta.drawingHand = {
    "sub_filter_type": "class_drawing_hand",
    "comparator_op": "at_least",
    "drawing_hand_op": "drawing_hand_3"
};

module.exports = nsStandardFilters;