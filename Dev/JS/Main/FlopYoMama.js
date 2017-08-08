FlopYoMama = require('./FlopYoMamaModel');
$(document).ready(function() {
    /**********************************************PROGRESS BARS***************************************************************/

    $('#results_progress').bind('done', function() {
        $(this).removeClass('active');
        $(this).children('div').addClass('progress-bar-success').css('width', '100%');
    });

    $('#results_progress').bind('start', function() {
        $(this).addClass('active');

        $(this).children('div').removeClass('progress-bar-success').css('width', '0%');
        //$(this).children('div').css('width','0%');
    });

    $('#win_percent_bar div').popover({
        content: function() {
            var str = '';
            if ($(this).hasClass('progress-bar-success'))
                str += 'Hero wins: ';
            else if ($(this).hasClass('progress-bar-danger'))
                str += 'Hero loses: ';
            else
                str += 'Hero draws: ';

            var widthStr = $(this)[0].style.width;
            str += parseFloat(widthStr).toFixed(2) + '%';
            return str; //.css('width');
        },
        container: 'body',
        placement: 'auto bottom',
        trigger: 'hover',
        html: true
    });

    $('#win_percent_bar').bind('start', function() { //resets the progress bar to 0 without css transitions
        nsUI.fDeleteLongStatistics();
    });

    /**********************************RANGE GRID & SLIDER******************************************/



    /*window resizing*/
    var bResultsToggled = false,
        bRandToggled = false,
        bRangesToggled = false;
    var sResultsClass = $('#results_col').attr('class');

    $(window).resize(function(e) {
        var width = window.innerWidth,
            ranges, rand, results;
        if (innerWidth <= 992) { //result pop down
            if (!bResultsToggled) {
                results = $('#results_col').detach();
                results.removeClass().addClass('row').appendTo('#content');
                bResultsToggled = true;
            }
        } else if (bResultsToggled) {
            results = $('#results_col').detach();
            results.removeClass().addClass(sResultsClass).appendTo('#range_row');
            bResultsToggled = false;
        } else
            return;

        if (innerWidth <= 768) {
            if (!bRandToggled) {
                rand = $('#rand_buttons').detach();
                rand.appendTo('#my_cards');
                bRandToggled = true;
            }

            if (!bRangesToggled) {
                ranges = $('#range_col').detach();
                ranges.appendTo('#content');
                bRangesToggled = true;
            }
        } else {
            if (bRandToggled) {
                rand = $('#rand_buttons').detach();
                rand.appendTo('#board');
                bRandToggled = false;
            }

            if (bRangesToggled) {
                ranges = $('#range_col').detach();
                ranges.prependTo('#range_row');
                bRangesToggled = false;
            }
            return;
        }
    });
    $(window).triggerHandler('resize');

    $('body').on('click', '.expanded_pair .pair_string', function() {
        $(this).toggleClass('selected');

        var panel = $(this).parent();
        var pairString = panel.attr('id').split('_')[2];
        var iPairsTotal = panel.children().length;
        var iPairsActivated = panel.children('.selected').length;

        var tableCell = $("#op_range_" + pairString);
        var tableCellBg = tableCell.find('.static_bg');

        tableCellBg.find('.glyphicon-cog').remove();
        if (iPairsActivated > 0) {
            tableCell.addClass('selected');
            if (iPairsTotal !== iPairsActivated) {
                tableCellBg.append('<span class="glyphicon glyphicon-cog"></span>');
            }
        } else {
            tableCell.removeClass('selected');
        }
    });

    $('#range_slider').append('<div class="range_slider_bg">&nbsp;</div>');
    /**************************HAND FLOP BOARD************************/

    $("#known_cards").popover({
        content: function() {
            return nsHtml.fGetBoardSelectionTable();
        },
        container: '#known_cards',
        placement: 'bottom',
        /*was 'auto bottom' ... new version of bootstrap broke it*/
        trigger: 'manual',
        html: true
    });

    //toggle board selection table when we didn't hit a button
    $('#known_cards [id^=known]').click(function(e) {
        if (!$('#board_selection_table').is(':visible'))
            $("#known_cards").popover('show');
    });

    $('body').on('click', '#board_selection_table .glyphicon-remove', function(e) { //only toggle cards when we didn't hit a button		
        $("#known_cards").popover('hide');
    });

    /*
    TODO: if we want the event to fire only once the click is complete,
    we can save the focused object on the mousedown event
    var focusedBoardAtMousedown = null;
    $('body').on('mousedown','#board_selection_table .card',function(e){ 
    	
    });	*/
    //only toggle cards when we didn't hit a button		
    $('body').on('mousedown', '#board_selection_table .card', function(e) {

        //if it's selected remove it from the board and mark
        //it as not selected not disabled
        if ($(this).is('.selected')) {
            nsUI.fSelectKnown($(this).html());
            nsUI.fDeleteBoard($(this).html());
            //select this part of the board

            $(this).removeClass('disabled selected');
        } else { //if it's not selected, select it and added to the board, mark it as selected and disabled
            var sReplaced = flopYoMama.knownCardsView.setBoardCard($(this).html());
            if (sReplaced !== EMPTY_CARD_STRING) { //we replaced a card so disable it in the board
                $('#board_selection_table .card').each(function() {
                    if ($(this).html() === sReplaced) {
                        $(this).removeClass('disabled selected');
                    }
                });
            }

            $(this).addClass('disabled selected');
            flopYoMama.knownCardsView.selectNext(true);
        }

        flopYoMama.knownCardsView.updateModel();
        flopYoMama.knownCards.trigger('finalize');
        return false; //prevent focusout events

    });

    //keypress misses some 

    $(document).bind('keydown', function(e) {
        var keyCode = e.keyCode ? e.keyCode : e.which;
        nsUI.fHandleKeyPress(keyCode, e, flopYoMama.knownCardsView);
    });

    //var $('#known_cards .selected').text-decoration: underline;

    /*filter menu*/
    $('#filter_config_menu').on('click', 'li:not(#new_edit_filter)', function(e) {
        e.preventDefault();
        nsUI.fToggleCheckableMenu(this, true);

        if ($(this).hasClass('active')) {
            nsUtil.fSetLocalStorage("filter_settings", $(this).attr('id'));
            var sTitleString = 'Filter ' + $(this).find('a').html();
            sTitleString = sTitleString.substring(0, sTitleString.indexOf('<'));
            $('#filter_config').attr('title', sTitleString); //can do this later... maybe give the filters a description
        } else {
            $('#filter_config').attr('title', 'Filter');
            nsUtil.fSetLocalStorage("filter_settings", '');
        }
        flopYoMama.updateRoute();
        flopYoMama.knownCards.evaluateKnownCards();
    });
    //do this AFTER all document.ready functions are called	
    setTimeout(function() {
        $('[title]').tooltip({
            container: 'body'
        });
    }, 1);
});

var flopYoMama = {};
$(function() {
    $('#content').removeClass('preload');
    flopYoMama = new FlopYoMama(); 
    flopYoMama.setUp();
});
