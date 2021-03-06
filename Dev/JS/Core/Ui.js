﻿"use strict";
var globalUi = require('../Constants/Ui');
var nsUtil = require('./Util');
var nsUI = {};

//this can stay in the ui and not move to the known cards because 
//it may hand key presses outside of the known cards
nsUI.fHandleKeyPress = function(keyCode, e, knownCardsView) {
    var d = e.srcElement || e.target;

    if (!$(d).hasClass('known')) {
        //nsUI.fHandleKeyPressAnywhereElse(keyCode,e);
        return;
    } else {
        knownCardsView.handleKeyPressKnown(keyCode, e);
    }
};

nsUI.fSetWinPercentBarZero = function() {
    var oldTransition = $('#win_percent_bar').children().first().css('transition');
    $(this).children().css('transition', 'none').css('-webkit-transition', 'none');
    $('#win_percent_bar').children().css('width', '0px');
    setTimeout(function() {
        $('#win_percent_bar').children().css('transition', oldTransition).css('-webkit-transition', oldTransition);
    }, 1);
};


nsUI.fGetKnownCards = function() {
    var jqCards = $('.known');
    var aCards = [];
    jqCards.each(function() {
        var raw = $(this).val();
        if (raw !== globalUi.EMPTY_CARD_STRING)
            aCards.push(nsConvert.fConvertStringToCardObject(raw));
    });
    return aCards;
};

nsUI.fToggleCheckableMenu = function(node, bTurnOffOthers, bForceTrue) {

    if (!bForceTrue) {
        $(node).toggleClass('active');
    } else {
        $(node).addClass('active');
    }

    if ($(node).hasClass('active')) {

        if ($(node).find('.glyphicon-ok').length == 0)
            $(node).find('a').append('<span class = "glyphicon glyphicon-ok"></span>');

        if (bTurnOffOthers) {
            $(node).siblings().removeClass('active').find('.glyphicon-ok').remove();
        }

        return true;
    } else {
        $(node).find('.glyphicon-ok').remove();
        return false;
    }
};

nsUI.clBootstrapCombobox = function(sId, aOptions, aDisplay, sHelpText, iSeparatorIndex) {
    var sHtml = '<div class="input-group" id ="' + sId + '">';
    sHtml += '<div class="input-group-btn">';
    sHtml += '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>';
    sHtml += '<ul class="dropdown-menu">';
    for (var i = 0; i < aOptions.length; i++) {
        sHtml += '<li id="' + aOptions[i] + '"><a href="#">' + aDisplay[i] + '</a></li>';
        // <li class="divider"></li>
    }
    sHtml += '</ul>';
    sHtml += '<button type="button" class="validate btn btn-default dropdown-toggle" data-toggle="dropdown"></button>';
    sHtml += '</ul>';
    sHtml += '</div>';
    sHtml += '<input type="text" class="form-control" placeholder="' + sHelpText + '">';
    sHtml += '</div>';
    return sHtml;
};

nsUI.fAddEventsToCombobox = function(sId, fVal) {

    //restore after autocomplete
    $('#' + sId + ' .btn').click(function() {
        $('#' + sId + ' .input-group-btn').removeClass('open');
        $('#' + sId + ' li').css('display', 'block').removeClass('active');
        $('#' + sId + ' ul').css('left', 0 + 'px');
    });


    $('#' + sId).on('click', 'li', function() {
        var val = $(this).attr('id');
        var display = $(this).children().first().html();
        $('#' + sId + ' input').val(display);

        $(this).addClass('active');
        $(this).siblings().removeClass('active');

        fVal();
    });
    var aOpen = [];
    var aNotOpen = [];
    var bExact = false;
    $('#' + sId + ' input').keyup(function(e) {

        //todo autocomplete
        bExact = false;
        aOpen = [];
        aNotOpen = [];
        $('#' + sId + ' li').each(function() {
            var liLower = $(this).find('a').html();
            liLower = liLower.toLowerCase();
            var thisLower = $('#' + sId + ' input').val().toLowerCase();
            if (liLower === thisLower && thisLower.length > 0) {
                $(this).addClass('active');
                $(this).siblings().removeClass('active');
                bExact = true;

            } else if (liLower.indexOf(thisLower) > -1 && thisLower.length > 0) { //found a hit
                aOpen.push(this);
            } else
                aNotOpen.push(this);

        });
        if (!bExact) {
            if (aOpen.length > 0) {
                $('#' + sId + ' .input-group-btn').addClass('open');
                var position = $('#' + sId + ' input').position();
                $(aOpen).css('display', 'block');
                $(aNotOpen).css('display', 'none').removeClass('active'); //active and it assumes the value is that
                //seems to be buggy when two hits
                $('#' + sId + ' ul').css('left', position.left + 'px');
                $('#' + sId + ' li').removeClass('active');
            } else {
                $('#' + sId + ' .input-group-btn').removeClass('open');
                $('#' + sId + ' li').css('display', 'block').removeClass('active');
                $('#' + sId + ' ul').css('left', 0 + 'px');
                //if (!bExact) //wenn genauer treffer lassen wir die li active
                //$('#' + sId + ' li').removeClass('active');
            }
        }

        fVal();
    });

    //tab key for autocomoplete
    $('#' + sId + ' input').keydown(function(e) {
        var keyCode = e.keyCode ? e.keyCode : e.which; //TAB_CODE
        if (keyCode === TAB_CODE && $('#' + sId + ' .input-group-btn').hasClass('open')) {
            var sHtml = $(aOpen[0]).find('a').html();
            $(aOpen[0]).addClass('activated');
            $('#' + sId + ' input').val(sHtml);
            $('#' + sId + ' .input-group-btn').removeClass('open');
            nsUtil.fLog('autocomplete ' + sHtml);
            $(this).triggerHandler('keyup');
        }

    });


    var fStandardValidate = function() {
        var val = $('#' + sId + ' input').val();
        var valButton = $('#' + sId).find('.validate');
        if (val === '') {
            valButton.html('<span class="glyphicon glyphicon-remove"></span>');
            return false;
        } else if (val === $('#' + sId + ' li.active a').html())
            valButton.html('<span class="glyphicon glyphicon-ok"></span>');
        else
            valButton.html('<span class="glyphicon glyphicon-plus-sign"></span>');

        nsUtil.fLog('triggering validated');
        $('#' + sId).trigger('validated');
        return true;
    };

    if (typeof fVal === 'undefined')
        fVal = fStandardValidate;

    fVal();
};

module.exports = nsUI;
