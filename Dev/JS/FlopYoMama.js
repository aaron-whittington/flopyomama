var TOTAL_STARTING_COMBINATIONS = 1326.0;

var modern = Modernizr.csstransforms &&
	Modernizr.csstransforms3d &&
	Modernizr.csstransitions &&
	Modernizr.svg &&
	Modernizr.webworkers;

if(!modern) {
	
	if( confirm("FlopYoMama uses some advanced browser features. " +
		"We reccomend the latest Chrome/Safari/Chromium " +
		"on a relatively fast computer.\n\n" +
		"Redirect to the Google Chrome site?")) {
		window.location.href = "http://www.google.com/chrome/";
	}
	throw new Error("Browser not supported");
}

$(document).ready(function() {
	//were we ever modern?

	nsFilter.nsHtml.fReBuildFilterMenu();
	//filter settings before slider, because slider triggers eval
	var localFilterSettings = nsUtil.fGetLocalStorage("filter_settings");
	if (localFilterSettings !== null && localFilterSettings !== '') {
		nsUI.fToggleCheckableMenu($('#' + localFilterSettings),true);
		nsUtil.fLog('toggle: ' +localFilterSettings);
		//$('#filter_config_menu').attr('title', 'Filter' + $('#' + localFilterSettings).find('a').html().substring());
	}
	
	/*changing the themes*/
	$('#dev_menu .theme_select li').click(function(){
		var themeName = $(this).children('a').first().attr('href').substring(1);
		var refMain = "style/flopyomama.css";
		var refBS = "lib/bootstrap/dist/css/bootstrap.min.css";
		if(themeName !=='default_theme'){
			refMain = "style/themes/" + themeName +"/flopyomama.css";
			refBS = "style/themes/" + themeName +"/bootstrap.min.css";
		}
		nsUtil.fLog(refMain);
		nsUtil.fLog(refBS);		
		$('link.btstrap').attr('href',refBS);
		$('link.main').attr('href',refMain);
		nsUI.fEvaluateKnownCards(); //colors refresh. would be better just to redraw the pies...also won't work if the css isn't there yet
		/*$('link.main').one('load',function() {
			nsUI.fEvaluateKnownCards(); //colors refresh. would be better just to redraw the pies...
		});*/
	});
	
	nsUI.fRestoreBoard();
		
	/**********************************************PROGRESS BARS***************************************************************/

	$('#results_progress').bind('done',function(){
		$(this).removeClass('active');		
		$(this).children('div').addClass('progress-bar-success').css('width','100%');
	});
	
	$('#results_progress').bind('start',function(){
		$(this).addClass('active');		
		
		$(this).children('div').removeClass('progress-bar-success').css('width','0%');
		//$(this).children('div').css('width','0%');
	});
	
	$('#win_percent_bar div').popover({
		content: function(){
			var str = '';
			if ($(this).hasClass('progress-bar-success'))
				str += 'Hero wins: ';
			else if ($(this).hasClass('progress-bar-danger'))
				str += 'Hero loses: ';
			else
				str += 'Hero draws: ';
				
			var widthStr = $(this)[0].style.width;
			str += parseFloat(widthStr).toFixed(2) +'%';	
			return str;//.css('width');
		}, 
		container: 'body',
		placement: 'auto bottom',
		trigger: 'hover',
		html: true
	});
	
	$('#win_percent_bar').bind('start',function() { //resets the progress bar to 0 without css transitions
		nsUI.fDeleteLongStatistics();
	});

	/**********************************RANGE MENU*****************************************************/

	$('#fixed_ranges li').popover ({
		content: function(){
						
							return '<span class="btn"> <abbr title="Under the Gun">UTG</abbr></span> <span class="btn">EP</span>' + 
							'<span class="btn">MP</span>' + 
						'<span class="btn">LP</span> <span class="btn">CO</span>'+
						'<span class="btn">SB</span> <span class="btn">BB</span>';
				}, 
		container: 'body',
		placement: 'auto right',
		html: true		
	});
	
	/**********************************RANGE GRID & SLIDER******************************************/
	
		
	//Clear custom selection
	$('#clear_selection').click(function() {
		$('#op_range td').removeClass('custom');
		$("#range_slider").slider('value',$("#range_slider").slider('value')); //make rangeslider redraw
	});
		 
	
	/*window resizing*/
	var bResultsToggled = false, bRandToggled = false, bRangesToggled = false;
	var sResultsClass = $('#results_col').attr('class');
	

	$(window).resize(function(e){
		var width = window.innerWidth, ranges, rand, results;
		if (innerWidth <= 992) { //result pop down
			if(!bResultsToggled) {
				results = $('#results_col').detach();
				results.removeClass().addClass('row').appendTo('#content');
				bResultsToggled = true;
			}
		}
		else if (bResultsToggled) {
			results = $('#results_col').detach();
			results.removeClass().addClass(sResultsClass).appendTo('#range_row');
			bResultsToggled = false;
		}
		else
			return;
		
		if (innerWidth <= 768) {
			if(!bRandToggled) {
				rand = $('#rand_buttons').detach();
				rand.appendTo('#my_cards');
				bRandToggled = true;
			}
			
			if(!bRangesToggled) {
				ranges = $('#range_col').detach();
				ranges.appendTo('#content');
				bRangesToggled = true;
			}
		}
		else {
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
	
	$('body').on('click','.expanded_pair .pair_string',function(){
		$(this).toggleClass('selected');
	
		var panel = $(this).parent();
		var pairString = panel.attr('id').split('_')[2];
		var iPairsTotal = panel.children().length;
		var iPairsActivated = panel.children('.selected').length;
	
		var tableCell = $("#op_range_"+pairString);
		var tableCellBg = tableCell.find('.static_bg');
		
		tableCellBg.find('.glyphicon-cog').remove();
		if(iPairsActivated>0) {
			tableCell.addClass('selected');
			if (iPairsTotal !== iPairsActivated) {
				tableCellBg.append('<span class="glyphicon glyphicon-cog"></span>');
			}
		}
		else {
			tableCell.removeClass('selected');
		}
	});

	var bSliderInitialized = false;

	//Range Scale Selection
	$('#range_scales li').click(function() {
		bActivated = nsUI.fToggleCheckableMenu(this, true);	
		if (bActivated) {
			var id = $(this).attr('id');
			//var storedSliderVal = nsUtil.fGetLocalStorage("range_slider_val");
			//$("#range_slider").slider('value',storedRangeSliderVal);
			nsUtil.fSetLocalStorage("range_type", id);
			
			if (id === "sklansky") {
				fRangeFunction = fGetSlanskyFromPercent;
			}			
			else if (id === "statistical") {
				fRangeFunction = fGetStatisticalFromPercent;
			}
			if(bSliderInitialized)
				$("#range_slider").slider('value',$("#range_slider").slider('value')); //make rangeslider redraw
		}
	});
	
	
	var rangeFunctionStored = nsUtil.fGetLocalStorage("range_type");
	if (rangeFunctionStored === null) {
			rangeFunctionStored = 'statistical';
	}
	 
	if (typeof fRangeFunction === 'undefined')
		fRangeFunction = fGetSlanskyFromPercent;
	 
	$('#'+rangeFunctionStored).triggerHandler('click');
	
		
	$('#range_slider').append('<div class="range_slider_bg">&nbsp;</div>');
		$('[title]').tooltip({container: 'body'});
		
	/**************************HAND FLOP BOARD************************/

	$("#known_cards").popover({
		content: function(){
					return nsHtml.fGetBoardSelectionTable();
				}, 
		container: '#known_cards',
		placement: 'bottom', /*was 'auto bottom' ... new version of bootstrap broke it*/
		trigger: 'manual',
		html: true		
	});
	
	//toggle board selection table when we didn't hit a button
	$('#known_cards [id^=known]').click(function(e){ 		
		if(!$('#board_selection_table').is(':visible'))
			$("#known_cards").popover('show');
	});
	
	$('body').on('click','#board_selection_table .glyphicon-remove',function(e){ //only toggle cards when we didn't hit a button		
		$("#known_cards").popover('hide');
	});
	
	/*
	TODO: if we want the event to fire only once the click is complete, we can save the focused object on the mousedown event
	var focusedBoardAtMousedown = null;
	$('body').on('mousedown','#board_selection_table .card',function(e){ 
		
	});	*/		
	
	$('body').on('mousedown','#board_selection_table .card',function(e){ //only toggle cards when we didn't hit a button		
	
		//if it's selected remove it from the board and mark it as not selected not disabled
		if($(this).is('.selected')) {
			nsUI.fSelectKnown($(this).html());
			nsUI.fDeleteBoard($(this).html()); 
			//select this part of the board
			
			$(this).removeClass('disabled selected');
		}
		else {//if it's not selected, select it and added to the board, mark it as selected and disabled
			var sReplaced = nsUI.fSetBoardCard($(this).html());
			if (sReplaced !==EMPTY_CARD_STRING) { //we replaced a card so disable it in the board
				$('#board_selection_table .card').each(function() {
					if($(this).html()===sReplaced) {	
						$(this).removeClass('disabled selected');
					}
				});
			}
			
			$(this).addClass('disabled selected');
			nsUI.fSelectNext(true);
		}
		
		//handle board changes
		nsUI.fAfterBoardChange();
		
		return false; //prevent focusout events
		
	});
	
	//keypress misses some 
	
	$(document).bind('keydown',function(e){		
		var keyCode = e.keyCode ? e.keyCode : e.which;
		nsUI.fHandleKeyPress(keyCode, e);			
	});
	
	//var $('#known_cards .selected').text-decoration: underline;
	
	/*filter menu*/	
	$('#filter_config_menu').on('click','li:not(#new_edit_filter)', function(e) {			
		e.preventDefault();
		nsUI.fToggleCheckableMenu(this,true);
		
		if ($(this).hasClass('active')) {
			nsUtil.fSetLocalStorage("filter_settings", $(this).attr('id'));
			var sTitleString = 'Filter ' + $(this).find('a').html();
			sTitleString = sTitleString.substring(0, sTitleString.indexOf('<'));
			$('#filter_config').attr('title',sTitleString); //can do this later... maybe give the filters a description
		}
		else {
			$('#filter_config').attr('title', 'Filter');
			nsUtil.fSetLocalStorage("filter_settings", '');
		}
		nsUI.fEvaluateKnownCards();
	
		//{oPair: oPair, aPair: actualPairs, sPair: pairString}
		//nsUtil.fSetLocalStorage("random_settings", aRandomSetting);
	});	
});

$(function(){

	$('#content').removeClass('preload');
	
	$('#filter_editor').bind('hide.bs.modal', function() {	
		if(nsFilter.nsHtml.fUpdateUI()) {
			if (confirm('You have unsaved changes. Do you wish to discard them?'))
				return true;
			else return false;
		}
	});
	
	$('#discard_filter').click(function() {
		if (confirm('Discard changes?')){
			nsFilter.sEditedJSON = nsFilter.sOriginalJSON;
			nsFilter.nsHtml.fLoadFilterFromObject(nsFilter.sOriginalJSON);
			nsFilter.nsHtml.fUpdateUI();
		}
	});
	
	$('#delete_filter').click(function() {
		//nsFilter.fCurrentToJSON();	
	});
	
	$('#save_filter').click(function() {
		nsFilter.fSaveFilter();
		nsFilter.nsHtml.fReBuildFilterMenu();
		nsFilter.sEditedJSON = nsFilter.sOriginalJSON;
		nsFilter.nsHtml.fUpdateUI();
	});
	
	//new subfilter clicks	
	$('#filter_editor').on('click',  '.new_subfilter', function() {		
			var thisRow = $(this).parents('.filter_ctrl_row');
			nsFilter.nsHtml.fAddSubRow(thisRow);											
			nsFilter.fSetEditedJson();
			nsFilter.nsHtml.fUpdateUI();
	});			
	
	//delete subfilter clicks
	$('#filter_editor').on('click',  '.delete_subfilter', function() {
			var thisRow = $(this).parents('.filter_ctrl_row');
			var next = thisRow.next();
			if (thisRow.next().is('.filter_group_subgroup')) {
				if(thisRow.next().children().length >0)
					if (confirm('Deleting a group requires deleting all sub-elements! Continue?')) {
						next.remove();
						thisRow.remove();
					}					
			}				//wrapper for subfilters already there
			else { //need new subfilter container
				thisRow.remove();
				
			}
										
			nsFilter.fSetEditedJson();
			nsFilter.nsHtml.fUpdateUI();
		});			
		
	//dropdown menu clicks
	$('#filter_editor').on('click','#filter_loaded .dropdown-menu li', function() {
			var labelButton = $(this).parent().parent().prev();
			var hasDeleteButton = false;
			var buttonContainer = $(this).parent().parent().parent().parent();
			var thisRow = $(this).parents('.filter_ctrl_row');
			
			if ($(this).parents('.filter_group_subgroup').length >0)
				hasDeleteButton = true;
			var displayVal = $(this).find('a').html();
			var val =	$(this).find('a').attr('class');	
			var bNothingChanged = $(this).hasClass('selected');
			
			$(this).addClass('selected active').siblings().removeClass('selected active');
			
			//do nothing if val isn't new
			if (!bNothingChanged) {
				//changing the type of the row				
				if($(this).parent().is('.sub_filter_type')) { 
					var sHtml = nsFilter.nsHtml.fSubFilterButtonGroup(val, hasDeleteButton);
						
					//changing the type of the row may require deleting subnodes
					if (thisRow.next().is('.filter_group_subgroup')) {
						if(thisRow.next().children().length >0)
							if (confirm('Changing this group type will delete sub-elements! Continue?')) {
								thisRow.next().remove();
								buttonContainer.html(sHtml);
							}					
						}
					else
						buttonContainer.html(sHtml);
				}
				else {
					labelButton.html(displayVal);
				}
											
				nsFilter.fSetEditedJson();
				nsFilter.nsHtml.fUpdateUI();
			}
	});	
	
	//open empty modal		
	$('body').on('show.bs.modal','#filter_editor',function(){
		nsFilter.nsHtml.fLoadNew();
						
		setTimeout(function(){
			nsUI.fAddEventsToCombobox('sel_filter'); 
			
			$('#sel_filter').keypress(function() {
				nsFilter.nsHtml.fUpdateUI();
				}
			);
			nsFilter.sEditedJSON = '';
			nsFilter.sOriginalJSON = '';
			nsFilter.nsHtml.fUpdateUI();
			$('#sel_filter').bind('validated',function() {			
				if (nsFilter.sOriginalJSON !== nsFilter.sEditedJSON)
					return;
				$('#filter_loaded').remove();
				var filterId;
				var sId = $('#sel_filter li.active').attr('id'); 
				
				if (sId)
					filterId = sId.substring('sel_'.length);
				else
					filterId='';
					
				sInnerHtml = nsFilter.nsHtml.fFilterHtmlFromSelect(filterId);
				$('#filter_editor .modal-body').append(sInnerHtml);			
			
				var original = nsFilter.fCurrentToJSON(); 			
				nsFilter.sEditedJSON = original;
				nsFilter.sOriginalJSON = original;		
			});					
		},1);
	});
	

});

var FlopYoMama = AWModel.extend({	
	initialize : function() {
		
		/*router*/
		this.router = new TableRouter();
		Backbone.history.start({pushState: false}); //, root: "/dev/flopyomama.html"
		
		/*slider*/		
		routerValueSlider = routerValues.slider;
		
		if(typeof routerValueSlider !== "undefined")
			this.slider = new Slider({value:routerValueSlider});
		else
			this.slider = new Slider();
		
		this.sliderView = new SliderView({
			model:this.slider, 
			el:$("#range_slider")[0]
		});
						
		/*range table*/
		this.rangeTable = new RangeTable();
		this.rangeTable.listenToSlider(this.slider);
		this.rangeTableView = new RangeTableView({model:this.rangeTable});
	
		this.listenTo(this.rangeTable, 'finalize', this.finalizeHandler);
			
		this.slider.trigger('finalize');					
		
	},
	finalizeHandler: function(args) {
		nsUtil.fLog('Main Ap Finalize');
		nsUI.fEvaluateKnownCards();
		this.router.navigate("slider=" + this.slider.get('value'),
			{trigger: false});
		
	}
});


$(function() { 
		
	window.flopYoMama = new FlopYoMama();

});

