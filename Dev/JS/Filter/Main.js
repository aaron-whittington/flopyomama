var nsFilter = require('./Filter');
var nsFilterHtml = require('./FilterHtml');
var nsUtil = require('../Core/Util');

module.exports = function() {
    nsFilter.fInit();
    nsFilterHtml.fReBuildFilterMenu();
    
    var localFilterSettings = nsUtil.fGetLocalStorage("filter_settings");
    if (localFilterSettings !== null && localFilterSettings !== '') {
        nsUI.fToggleCheckableMenu($('#' + localFilterSettings), true);
        nsUtil.fLog('toggle: ' + localFilterSettings);
    }

    $('#filter_editor').bind('hide.bs.modal', function() {
        if (nsFilterHtml.fUpdateUI()) {
            if (confirm('You have unsaved changes. Do you wish to discard them?'))
                return true;
            else return false;
        }
    });

    $('#discard_filter').click(function() {
        if (confirm('Discard changes?')) {
            nsFilter.sEditedJSON = nsFilter.sOriginalJSON;
            nsFilterHtml.fLoadFilterFromObject(nsFilter.sOriginalJSON);
            nsFilterHtml.fUpdateUI();
        }
    });

    $('#delete_filter').click(function() {
        //todo add name
        if (confirm('Really delete this filter?')) {
            nsFilter.fDeleteFilter();
            nsFilterHtml.fReBuildFilterMenu();
            nsFilter.fClearFilter();
            $('#filter_editor').trigger('show.bs.modal');
        }
    });

    $('#save_filter').click(function() {
        nsFilter.fSaveFilter();
        nsFilterHtml.fReBuildFilterMenu();
        nsFilter.sEditedJSON = nsFilter.sOriginalJSON;
        nsFilterHtml.fUpdateUI();
    });

    //new subfilter clicks	
    $('#filter_editor').on('click', '.new_subfilter', function() {
        var thisRow = $(this).parents('.filter_ctrl_row');
        nsFilterHtml.fAddSubRow(thisRow);
        nsFilter.fSetEditedJson();
        nsFilterHtml.fUpdateUI();
    });

    //delete subfilter clicks
    $('#filter_editor').on('click', '.delete_subfilter', function() {
        var thisRow = $(this).parents('.filter_ctrl_row');
        var next = thisRow.next();
        if (thisRow.next().is('.filter_group_subgroup')) {
            if (thisRow.next().children().length > 0)
                if (confirm('Deleting a group requires deleting all sub-elements! Continue?')) {
                    next.remove();
                    thisRow.remove();
                }
        } //wrapper for subfilters already there
        else { //need new subfilter container
            thisRow.remove();

        }

        nsFilter.fSetEditedJson();
        nsFilterHtml.fUpdateUI();
    });

    //dropdown menu clicks
    $('#filter_editor').on('click', '#filter_loaded .dropdown-menu li', function() {
        var labelButton = $(this).parent().parent().prev();
        var hasDeleteButton = false;
        var buttonContainer = $(this).parent().parent().parent().parent();
        var thisRow = $(this).parents('.filter_ctrl_row');

        if ($(this).parents('.filter_group_subgroup').length > 0)
            hasDeleteButton = true;
        var displayVal = $(this).find('a').html();
        var val = $(this).find('a').attr('class');
        var bNothingChanged = $(this).hasClass('selected');

        $(this).addClass('selected active').siblings().removeClass('selected active');

        //do nothing if val isn't new
        if (!bNothingChanged) {
            //changing the type of the row				
            if ($(this).parent().is('.sub_filter_type')) {
                var sHtml = nsFilterHtml.fSubFilterButtonGroup(val, hasDeleteButton);

                //changing the type of the row may require deleting subnodes
                if (thisRow.next().is('.filter_group_subgroup')) {
                    if (thisRow.next().children().length > 0)
                        if (confirm('Changing this group type will delete sub-elements! Continue?')) {
                            thisRow.next().remove();
                            buttonContainer.html(sHtml);
                        }
                } else
                    buttonContainer.html(sHtml);
            } else {
                labelButton.html(displayVal);
            }
            nsFilter.fSetEditedJson();
            nsFilterHtml.fUpdateUI();
        }
    });

    //open empty modal		
    $('body').on('show.bs.modal', '#filter_editor', function() {
        nsFilterHtml.fLoadNew();

        setTimeout(function() {
            nsUI.fAddEventsToCombobox('sel_filter');

            $('#sel_filter').keypress(function() {
                nsFilterHtml.fUpdateUI();
            });
            nsFilter.sEditedJSON = '';
            nsFilter.sOriginalJSON = '';
            nsFilterHtml.fUpdateUI();
            $('#sel_filter').bind('validated', function() {
                if (nsFilter.sOriginalJSON !== nsFilter.sEditedJSON)
                    return;
                $('#filter_loaded').remove();
                var filterId;
                var sId = $('#sel_filter li.active').attr('id');

                if (sId)
                    filterId = sId.substring('sel_'.length);
                else
                    filterId = '';

                sInnerHtml = nsFilterHtml.fFilterHtmlFromSelect(filterId);
                $('#filter_editor .modal-body').append(sInnerHtml);

                var original = nsFilter.fCurrentToJSON();
                nsFilter.sEditedJSON = original;
                nsFilter.sOriginalJSON = original;
            });
        }, 1);
    });
};