nsFilter.nsHtml = {};

nsFilter.nsHtml.fGetFilterUI = function() {
    var sHtml = '<div class="row form-group">';
    sHtml += '<label id="sel_filter_label" for="sel_filter" class="col-lg-3 control-label">Select filter</label>';
    sHtml += '<div class="col-lg-9">';
    sHtml += nsFilter.nsHtml.fGetFilterCombobox();
    sHtml += '</div>';
    sHtml += '</div>';
    return sHtml;
};


nsFilter.nsHtml.fReBuildFilterMenu = function() {
    //first delete existing
    $('#filter_config_menu li.filter').remove();
    var sHtml = '';

    var aSavedKeys = nsUtil.fGetLocalStorage(nsFilter.sFilterNamesKey);

    //if (isNot(aSavedKeys))
    if (!aSavedKeys)
        aSavedKeys = [];

    for (var i = 0; i < aSavedKeys.length; i++) {
        var sName = aSavedKeys[i];
        var oFilter = nsFilter.fActiveFilter(sName);
        //nsUtil.fLog('FReBuildFilter Menu filter ' + JSON.stringify(oFilter));
        var name = oFilter.name;
        if (!name) {
            name = 'Name Unknown';
        }

        sHtml += "<li id ='" + sName + "' class='filter'>";
        sHtml += "<a href='#" + sName + "'>" + name + "</a>";
        sHtml += '</li>';
    }
    $('#filter_config_menu').prepend(sHtml);
};

nsFilter.nsHtml.fGetFilterCombobox = function() {
    var aValues = [],
        aDisplay = [];
    $('#filter_config_menu .filter').each(function() {
        /*var aSplit = $(this).attr('id').split('_');
        aSplit.pop();
        var value = aSplit.join('_');*/
        var value = 'sel_' + $(this).attr('id');
        var sRaw = $(this).find('a').html();
        var index = sRaw.indexOf('<');
        var sSub;
        if (index > 0)
            sSub = sRaw.substring(0, index);
        else
            sSub = sRaw;
        aDisplay.push(sSub);
        aValues.push(value);
    });
    return nsUI.clBootstrapCombobox('sel_filter', aValues, aDisplay, 'Click button or type (new) name');
};

nsFilter.nsHtml.fWrapSubFilterButtonGroup = function(sBtnGroup) {
    var colOffsetTag = '',
        iIndent = 0;
    var colTag = 'col-lg-' + (12 - iIndent);

    sHtml = '';
    sHtml += '<div class="row filter_ctrl_row">';
    sHtml += '<div class="filter_ctrl_col ' + colTag + ' ' + colOffsetTag + '">';
    sHtml += sBtnGroup;
    sHtml += '</div>';
    sHtml += '</div>';
    return sHtml;
};

//fuer untergruppen damit wir einen baum struktur behalten
nsFilter.nsHtml.fWrapSubFilterGroup = function(sGroupGroup) {
    sHtml = '<div class = "filter_group_subgroup"><img class="brace" src="Style/GullBraceLeft.svg">' + sGroupGroup + '</div>';
    return sHtml;
};

nsFilter.nsHtml.fFilterHtmlFromSelect = function(sVal) {
    var sHtml = '<div id="filter_loaded" class="well">';

    var oSettings = nsFilter.fActiveFilter(sVal);
    if (typeof oSettings !== 'undefined' && oSettings !== null) {
        //get the json object		
        sHtml += nsFilter.nsHtml.fLoadFilterFromObject(oSettings);

    } else { //new
        sHtml += nsFilter.nsHtml.fWrapSubFilterButtonGroup(nsFilter.nsHtml.fSubFilterButtonGroup(nsFilter.nsStandard.oGroup));
    }
    sHtml += '</div>';
    return sHtml;
};

nsFilter.nsHtml.fLoadNew = function() {
    var sHtml = nsFilter.nsHtml.fGetFilterUI();
    $('#filter_editor .modal-body').html(sHtml);
};


nsFilter.nsHtml.fUpdateUI = function() {
    var sString = 'Select filter';
    var bReturn = true;
    if (nsFilter.sOriginalJSON !== nsFilter.sEditedJSON) {
        sString = 'Edit name';
        $('#sel_filter .btn').not('.close').addClass('disabled');
        $('#sel_filter .validate.btn').addClass('btn-warning').removeClass('btn-default btn-primary');

        if ($('#sel_filter input').val().length > 0) //name validation
            $('#save_filter').removeClass('btn-default btn-success disabled');

        $('#discard_filter').removeClass('disabled');
        $('#delete_filter').addClass('disabled');
    } else {
        $('#sel_filter .btn').removeClass('btn-default btn-warning disabled');
        $('#sel_filter .validate.btn').addClass('btn-primary').removeClass('btn-default btn-warning');
        $('#save_filter').addClass('disabled');
        $('#discard_filter').addClass('disabled');
        $('#delete_filter').removeClass('disabled');
        bReturn = false;
    }

    $('#sel_filter_label').html(sString);
    return bReturn;
};

nsFilter.nsHtml.fLoadFilterFromObject = function(oSettings, bDeleteButton) {
    var sHtml = '';
    if (typeof bDeleteButton === "undefined")
        bDeleteButton = false;
    sHtml += nsFilter.nsHtml.fWrapSubFilterButtonGroup(nsFilter.nsHtml.fSubFilterButtonGroup(oSettings.oValues, bDeleteButton));
    if (typeof(oSettings.sub) !== 'undefined') {
        var sInnerHtml = '';
        for (var i = 0; i < oSettings.sub.length; i++) {
            sInnerHtml += nsFilter.nsHtml.fLoadFilterFromObject(oSettings.sub[i], true);
        }

        sInnerHtml = nsFilter.nsHtml.fWrapSubFilterGroup(sInnerHtml);
        sHtml += sInnerHtml;
    }
    return sHtml;
};

nsFilter.nsHtml.fAddSubRow = function(thisRow, sType) {
    if (typeof sType === 'undefined')
        sType = 'class_made_hand';
    var thisCol = thisRow.children().first();
    //var iThisIndent = nsFilter.fGetIndent(thisCol);
    var sHtml = nsFilter.nsHtml.fSubFilterButtonGroup(sType, true);
    var sHtmlRow = nsFilter.nsHtml.fWrapSubFilterButtonGroup(sHtml, 0);
    if (thisRow.next().is('.filter_group_subgroup')) {
        thisRow.next().append(sHtmlRow);
    } //wrapper for subfilters already there
    else { //need new subfilter container
        var sHtmlWrappedRow = nsFilter.nsHtml.fWrapSubFilterGroup(sHtmlRow);
        thisRow.after(sHtmlWrappedRow);
    }
};

nsFilter.nsHtml.fTypeStringToClass = function(sPrefix, sType) {
    return sPrefix + sType.replace(/\s+/g, '_').toLowerCase();
};

nsFilter.nsHtml.fSubFilterButtonGroup = function(oValues, bRemoveButton) {
    var sType = nsUtil.fType(oValues);
    if (sType === "string")
        sSelected = oValues;
    else {
        if (typeof oValues === 'undefined' || typeof oValues.sub_filter_type === 'undefined')
            sSelected = 'class_group';
        else
            sSelected = oValues.sub_filter_type;
    }

    if (typeof oValues === 'undefined')
        oValues = {};

    sHtml = '';
    //generate a class for this type
    var sClass = nsFilter.nsHtml.fTypeStringToClass('filter_btns_', sSelected);
    sHtml += '<div class="btn-group ' + sClass + '  filter_ctrl_btn_group">';

    if (typeof bRemoveButton === 'undefined')
        bRemoveButton = false;

    switch (sSelected) {
        case 'class_group':
            sHtml += nsFilter.nsHtml.fGroupTypeFilterButtonGroup(oValues);
            break;
        case 'class_made_hand':
            sHtml += nsFilter.nsHtml.fMadeHandTypeFilterButtonGroup(oValues);
            break;
        case 'class_drawing_hand':
            sHtml += nsFilter.nsHtml.fDrawingHandTypeFilterButtonGroup(oValues);
            break;
        case 'class_filter':
            sHtml += nsFilter.nsHtml.fFilterTypeFilterButtonGroup(oValues);
            break;
        default:
    }

    if (bRemoveButton)
        sHtml += nsFilter.nsHtml.fRemoveFilterButton();

    sHtml += '</div>'; // end btn-group
    return sHtml;
};

nsFilter.nsHtml.fGroupTypeFilterButtonGroup = function(oValues) {
    var sHtml = '';
    sHtml += nsFilter.nsHtml.fSubFilterTypeButtons('class_group');
    sHtml += nsFilter.nsHtml.fLogicalOpButtons(oValues.group_log_op);
    sHtml += nsFilter.nsHtml.fNewSubFilterButton();
    return sHtml;
};

nsFilter.nsHtml.fMadeHandTypeFilterButtonGroup = function(oValues) {
    var sHtml = '';
    sHtml += nsFilter.nsHtml.fSubFilterTypeButtons('class_made_hand');
    sHtml += nsFilter.nsHtml.fAtLeastFilterTypeButtons(oValues.comparator_op);
    sHtml += nsFilter.nsHtml.fMadeHandFilterTypeButtons(oValues.made_hand_op);
    return sHtml;
};

nsFilter.nsHtml.fDrawingHandTypeFilterButtonGroup = function(oValues) {
    var sHtml = '';
    sHtml += nsFilter.nsHtml.fSubFilterTypeButtons('class_drawing_hand');
    sHtml += nsFilter.nsHtml.fAtLeastFilterTypeButtons(oValues.comparator_op);
    sHtml += nsFilter.nsHtml.fDrawingHandFilterTypeButtons(oValues.drawing_hand_op);
    return sHtml;
};

nsFilter.nsHtml.fFilterTypeFilterButtonGroup = function(oValues) {
    var sHtml = '';
    sHtml += nsFilter.nsHtml.fSubFilterTypeButtons('class_filter');
    sHtml += nsFilter.nsHtml.fSubFilterSelectionButtons(oValues.sub_filter_op);
    return sHtml;
};

nsFilter.nsHtml.fSubFilterTypeButtons = function(sSelected) {
    if (typeof sSelected === 'undefined')
        sSelected = 'class_group';

    var asClass = [];
    asClass[0] = 'class_group';
    asClass[1] = 'class_filter';
    asClass[2] = 'class_made_hand';
    asClass[3] = 'class_drawing_hand';

    var asDisplay = [];
    asDisplay[0] = 'Group';
    asDisplay[1] = 'Filter';
    asDisplay[2] = 'Made Hand';
    asDisplay[3] = 'Drawing Hand';

    var selectedIndex = 0,
        i;
    if (typeof sSelected !== 'undefined') {
        for (i = 0; i < asClass.length; i++) {
            if (sSelected === asClass[i]) {
                selectedIndex = i;
                break;
            }
        }
    }

    var sHtml = '';
    sHtml += '<button type="button" class="btn btn-primary ' + sSelected.toLowerCase() + '">'; //group type			
    //sHtml += '<strong>'; we'll do this by css to keep our code simple
    sHtml += asDisplay[selectedIndex];
    //sHtml += '</strong>';
    sHtml += '</button>';
    sHtml += '<div class="btn-group">'; //button group
    sHtml += '<button type="button" class="btn dropdown-toggle btn-primary" data-toggle="dropdown">';
    sHtml += '<span class="caret"></span>';
    sHtml += '</button>';
    sHtml += '<ul selection-type="sub_filter_type" class="dropdown-menu sub_filter_type">';
    for (i = 0; i < asClass.length; i++) {
        var sClass = "";
        if (sSelected === asClass[i])
            sClass = "selected active";

        sHtml += '<li class="' + sClass + '"><a href="#" class="' + asClass[i] + '">' + asDisplay[i] + '</a></li>';

    }
    sHtml += '</ul>';
    sHtml += '</div>'; //end button group
    return sHtml;
};

nsFilter.nsHtml.fLogicalOpButtons = function(sSelected) {

    var asClass = [];
    asClass[0] = 'log_op_or';
    asClass[1] = 'log_op_and';

    var asDisplay = [];
    asDisplay[0] = 'OR';
    asDisplay[1] = 'AND';

    var selectedIndex = 0,
        i;
    if (typeof sSelected !== 'undefined') {
        for (i = 0; i < asClass.length; i++) {
            if (sSelected === asClass[i]) {
                selectedIndex = i;
                break;
            }
        }
    }

    var sHtml = '';
    sHtml += '<button type="button" class="btn btn-default log_op_or">';
    sHtml += asDisplay[selectedIndex];
    sHtml += '</button>';
    sHtml += '<div class="btn-group">';
    sHtml += '<button type="button" class="btn dropdown-toggle btn-default" data-toggle="dropdown">';
    sHtml += '<span class="caret"></span>';
    sHtml += '</button>';
    sHtml += '<ul selection-type="group_log_op"  class="group_log_op dropdown-menu">'; //drop down AND/OR
    for (i = 0; i < asClass.length; i++) {
        var sClass = "";
        if (i === selectedIndex)
            sClass = "selected active";
        sHtml += '<li class="' + sClass + '"><a href="#" class="' + asClass[i] + '"  >' + asDisplay[i] + '</a></li>';
    }
    sHtml += '</ul>';
    sHtml += '</div>';
    return sHtml;
};

nsFilter.nsHtml.fAtLeastFilterTypeButtons = function(sSelected) {

    var asClass = [];
    asClass[0] = 'at_least';
    asClass[1] = 'at_most';

    var asDisplay = [];
    asDisplay[0] = 'At Least';
    asDisplay[1] = 'At Most';

    var selectedIndex = 0;
    if (typeof sSelected !== 'undefined') {
        for (var i = 0; i < asClass.length; i++) {
            if (sSelected === asClass[i]) {
                selectedIndex = i;
                break;
            }
        }
    }


    var sHtml = '';
    sHtml += '<button type="button" class="btn btn-default at_least">';
    sHtml += asDisplay[selectedIndex];
    sHtml += '</button>';
    sHtml += '<div class="btn-group">';
    sHtml += '<button type="button" class="btn dropdown-toggle btn-default" data-toggle="dropdown">';
    sHtml += '<span class="caret"></span>';
    sHtml += '</button>';
    sHtml += '<ul selection-type="comparator_op" class="comparator_op dropdown-menu">'; //drop down AND/OR
    for (var i = 0; i < asClass.length; i++) {
        var sClass = "";
        if (i === selectedIndex)
            sClass = "selected active";
        sHtml += '<li class="' + sClass + '"><a href="#" class="' + asClass[i] + '"  >' + asDisplay[i] + '</a></li>';
    }
    sHtml += '</ul>';
    sHtml += '</div>';
    return sHtml;
};

nsFilter.nsHtml.fMadeHandFilterTypeButtons = function(sSelected) {

    /*oHand.HIGH_CARD = 0;
    oHand.PAIR = 1;
    oHand.TWO_PAIR = 2;
    oHand.THREE_OF_A_KIND = 3;
    oHand.STRAIGHT = 4;
    oHand.FLUSH = 5;
    oHand.FULL_HOUSE = 6;
    oHand.FOUR_OF_A_KIND = 7;
    oHand.STRAIGHT_FLUSH = 8;*/
    var asRank = [];
    var asClass = [];
    for (var iHandType = 0; iHandType < 9; iHandType++) {
        var oHand = {};
        oHand.rank = iHandType;
        var rankString = nsHand.fHandToString(oHand);
        asRank.push(rankString);
        asClass.push('made_hand_' + iHandType);
        //need ot store the int here somewhere
    }

    var selectedIndex = 0;
    if (typeof sSelected !== 'undefined') {
        for (var i = 0; i < asClass.length; i++) {
            if (sSelected === asClass[i]) {
                selectedIndex = i;
                break;
            }
        }
    }

    var sHtml = '';
    sHtml += '<button type="button" class="btn btn-default">';
    sHtml += asRank[selectedIndex];
    sHtml += '</button>';
    sHtml += '<div class="btn-group">';
    sHtml += '<button type="button" class="btn dropdown-toggle btn-default" data-toggle="dropdown">';
    sHtml += '<span class="caret"></span>';
    sHtml += '</button>';
    sHtml += '<ul selection-type="made_hand_op" class="made_hand_op dropdown-menu">'; //drop down AND/OR
    for (var i = 0; i < asRank.length; i++) {
        var sClass = "";
        if (i === selectedIndex)
            sClass = "selected active";
        sHtml += '<li class="' + sClass + '"><a href="#" class="' + asClass[i] + '" >' + asRank[i] + '</a></li>'; //need ot store the int here somewhere
    }

    sHtml += '</ul>';
    sHtml += '</div>';
    return sHtml;
};

nsFilter.nsHtml.fGetCurrentFilterNameIntern = function() {
    var valDisplay = $('#sel_filter input').val();
    return valDisplay.split(' ').join('_').toLowerCase();
};

nsFilter.nsHtml.fSubFilterSelectionButtons = function(sSelected) {

    var aValidSelections = [];
    var aValidSelectionStrings = [];
    var asClass = [];
    $('#filter_config_menu .filter').each(function() {

        var id = $(this).attr('id');
        var currentId = $('#sel_filter').val();
        var aTag = $(this).find('a').clone();;
        aTag.find('span').remove();
        var currentHtml = aTag.html();
        if (currentId !== id) {
            aValidSelections.push(id);
            aValidSelectionStrings.push(currentHtml);
            asClass.push(nsFilter.nsHtml.fTypeStringToClass('', currentHtml));
        }
    });

    var selectedIndex = 0;
    if (typeof sSelected !== 'undefined') {
        for (var i = 0; i < asClass.length; i++) {
            if (sSelected === asClass[i]) {
                selectedIndex = i;
                break;
            }
        }
    }
    var currentNameSearch = nsFilter.nsHtml.fGetCurrentFilterNameIntern();
    var sHtml = '';
    sHtml += '<button type="button" class="btn btn-default">';
    sHtml += aValidSelectionStrings[selectedIndex];
    sHtml += '</button>';
    sHtml += '<div class="btn-group">';
    sHtml += '<button type="button" class="btn dropdown-toggle btn-default" data-toggle="dropdown">';
    sHtml += '<span class="caret"></span>';
    sHtml += '</button>';
    sHtml += '<ul selection-type="sub_filter_op" class="dropdown-menu">'; //drop down AND/OR

    for (var i = 0; i < aValidSelections.length; i++) {

        if (currentNameSearch === asClass[i])
            continue; //filter cannot contain itself

        var sClass = "";
        if (i === selectedIndex)
            sClass = "selected active";
        sHtml += '<li class="' + sClass + '"><a href="#" class="' + asClass[i] + '">' + aValidSelectionStrings[i] + '</a></li>'; //need ot store the int here somewhere
    }
    sHtml += '</ul>';
    sHtml += '</div>';
    return sHtml;
};

nsFilter.nsHtml.fDrawingHandFilterTypeButtons = function(sSelected) {

    /*
    nsDrawingHand.BACKDOOR_STRAIGHT_DRAW=0;
    nsDrawingHand.GUTSHOT_STRAIGHT_DRAW=1;
    nsDrawingHand.BACKDOOR_FLUSH_DRAW=2;
    nsDrawingHand.OPEN_ENDED_STRAIGHT_DRAW=3;
    nsDrawingHand.FLUSH_DRAW=4;*/
    var asRank = [];
    var asClass = [];
    for (var iHandType = 0; iHandType < 5; iHandType++) {
        var oHand = {};
        oHand.rank = iHandType;
        var rankString = nsDrawingHand.fDrawingHandToShortString(oHand);
        asRank.push(rankString);

        asClass.push('drawing_hand_' + iHandType);
        //need ot store the int here somewhere
    }
    var selectedIndex = 0;
    if (typeof sSelected !== 'undefined') {
        for (var i = 0; i < asClass.length; i++) {
            if (sSelected === asClass[i]) {
                selectedIndex = i;
                break;
            }
        }
    }

    var sHtml = '';
    sHtml += '<button type="button" class="btn btn-default">';
    sHtml += asRank[selectedIndex];
    sHtml += '</button>';
    sHtml += '<div class="btn-group">';
    sHtml += '<button type="button" class="btn dropdown-toggle btn-default" data-toggle="dropdown">';
    sHtml += '<span class="caret"></span>';
    sHtml += '</button>';
    sHtml += '<ul selection-type="drawing_hand_op" class="drawing_hand_op dropdown-menu">'; //drop down AND/OR

    for (var i = 0; i < asRank.length; i++) {
        var sClass = "";
        if (i === selectedIndex)
            sClass = "selected active";
        sHtml += '<li class="' + sClass + '"><a href="#" class="' + asClass[i] + '"  >' + asRank[i] + '</a></li>'; //need ot store the int here somewhere
    }
    sHtml += '</ul>';
    sHtml += '</div>';
    return sHtml;
};

nsFilter.nsHtml.fNewSubFilterButton = function() {
    var sHtml = '';
    sHtml += '<button title="New Subfilter" class="new_subfilter btn-success btn" type="button">';
    sHtml += '<span class="glyphicon glyphicon-plus-sign"></span>';
    sHtml += '</button>';
    return sHtml;
};

nsFilter.nsHtml.fRemoveFilterButton = function() {
    var sHtml = '';
    sHtml += '<button title="Delete subfilter" class="delete_subfilter btn-warning btn" type="button">';
    sHtml += '<span class="glyphicon glyphicon-minus-sign"></span>';
    sHtml += '</button>';
    return sHtml;
};