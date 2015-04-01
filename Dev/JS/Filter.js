var nsFilter = {};
nsFilter.bEdited = false;
nsFilter.sOriginalJSON = '';
nsFilter.sEditedJSON = '';

/*standard empty filters*/
nsFilter.nsStandard = {};
nsFilter.nsStandard.oGroup = {"sub_filter_type":"class_group", "group_log_op":"log_op_or"};
nsFilter.nsStandard.oMadeHand = {"sub_filter_type":"class_made_hand","comparator_op":"at_least","made_hand_op":"made_hand_0"};
nsFilter.nsStandard.oDrawingHand = {"sub_filter_type":"class_drawing_hand","comparator_op":"at_least","drawing_hand_op":"drawing_hand_3"};

/*standard filters*/
nsFilter.nsStandardFilters = {};
nsFilter.nsStandardFilters['filter_strong_hand'] = {
											"oValues":{
												"sub_filter_type":"class_group","group_log_op":"log_op_or"},
											"sub":[
												{"oValues":{"sub_filter_type":"class_made_hand","comparator_op":"at_least","made_hand_op":"made_hand_2"}},
												{"oValues":{"sub_filter_type":"class_drawing_hand","comparator_op":"at_least","drawing_hand_op":"drawing_hand_3"}}],
											"name": 'Strong Hand'
											};

nsFilter.nsStandardFilters['filter_junk'] = {
										"oValues":
											{"sub_filter_type":"class_group","group_log_op":"log_op_and"},
										"sub":[
											{"oValues":{"sub_filter_type":"class_made_hand","comparator_op":"at_most","made_hand_op":"made_hand_0"}},
											{"oValues":{"sub_filter_type":"class_drawing_hand","comparator_op":"at_most","drawing_hand_op":"drawing_hand_2"}}],
										"name": 'Junk'
										}; 
										
nsFilter.nsStandardFilters['filter_bluffy'] =	{
											"oValues":{"sub_filter_type":"class_group","group_log_op":"log_op_or"},
											"sub":[{"oValues":{"sub_filter_type":"class_filter","sub_filter_op":"filter_strong_hand"}},{"oValues":{"sub_filter_type":"class_filter","sub_filter_op":"filter_junk"}}],
											'name':'Bluffy'};
											
nsFilter.nsStandardFilters['filter_monster'] =	{"oValues":{"sub_filter_type":"class_made_hand","comparator_op":"at_least","made_hand_op":"made_hand_3"},
										'name':'Monster'} 

nsFilter.sFilterNamesKey = 'filters_saved';

//Check if the local storage looks like it's empty. If it's not empty, 
//it initializes it based on the values of the standard filters. 
nsFilter.fInit = function() {
	var loc = nsUtil.fGetLocalStorage(nsFilter.sFilterNamesKey);
	if (loc == null || typeof(loc) == "undefined") {
		loc = _.keys(nsFilter.nsStandardFilters);
		nsUtil.fSetLocalStorage(nsFilter.sFilterNamesKey, loc);
	} 
};

//save filter
nsFilter.fSaveFilter = function() {
	var oJson = nsFilter.fCurrentToJSON(); 
	var sName = 'filter_' + nsFilter.nsHtml.fGetCurrentFilterNameIntern();
	nsUtil.fSetLocalStorage(sName,oJson);
	var aExisting = nsUtil.fGetLocalStorage(nsFilter.sFilterNamesKey);
	if (!aExisting)
		aExisting =[];
	if (aExisting.indexOf(sName) ===-1)
		aExisting.push(sName);
	nsUtil.fSetLocalStorage(nsFilter.sFilterNamesKey, aExisting);	
};

//delete filter. only removes the filter from the saved filters
//list (does not delete the json.) if name is undefined it uses
//the name of the current filter
nsFilter.fDeleteFilter = function(name) {
	if(typeof name === "undefined") {
		name = nsFilter.nsHtml.fGetCurrentFilterNameIntern();
	}
	name = 'filter_' + name;
	//update the saved key so it no longer contains name
	var aSavedKeys = nsUtil.fGetLocalStorage(nsFilter.sFilterNamesKey);
	if(!aSavedKeys) {
		return;
	}
	var index = aSavedKeys.indexOf(name);
	if (index > -1) {
		aSavedKeys.splice(index, 1);	
	}
	nsUtil.fSetLocalStorage(nsFilter.sFilterNamesKey, aSavedKeys);

};

//returns the active filter as an object
nsFilter.fActiveFilter = function(sName, bUnpack) {
	if (typeof(sName) === 'undefined' || sName===null)
		sName = nsFilter.fGetActiveFilter();
	
	nsUtil.fLog('now unpacking ' + sName) 
	
	var oFilter = nsUtil.fGetLocalStorage(sName);
	
	if (!oFilter) //get it from the standard names if not
		oFilter = nsFilter.nsStandardFilters[sName]; 
	
	if(!oFilter) {	
		return;
	}
	oFilter = nsUtil.fClone(oFilter);
	
	if (bUnpack === true) {
		oFilter = nsFilter.fUnpack(oFilter);
	}
	
	return oFilter;
};

//note that this also modifies oFilter						
nsFilter.fUnpack = function(oFilter) {	
	var returnVal = oFilter; 
	var vals = returnVal.oValues;
	var type = vals.sub_filter_type;
	if (type === "class_filter") {
		return nsFilter.fActiveFilter(vals.sub_filter_op, true);
	}
	else if(type === "class_group") {
		for(var i=0; i<returnVal.sub.length; i++) {
			var sub = returnVal.sub[i];
			returnVal.sub[i] = nsFilter.fUnpack(sub);
		}
		return returnVal;
	}
	else
		return returnVal;
};
/************************************************** JSON PACKAGING ****************************************************************************/

nsFilter.fCurrentToJSON = function () {
	var oRow = $('#filter_loaded').children().first();
	var oReturn = nsFilter.fCurrentToJSONRec(oRow);
	oReturn['name'] =$('#sel_filter input').val();
	//var sReturn = JSON.stringify(oReturn);	
	return oReturn;	
};


nsFilter.fCurrentToJSONRec = function (oRow) {

	var oReturn = {
					oValues:{}
				  };
	var oButtonGroup = oRow.find('.btn-group').first();
	var nSelected = oButtonGroup.find('li.selected');
	
	nSelected.each(function() {
		var sSelected = $(this).parent('ul').attr('selection-type');
		oReturn.oValues[sSelected] = $(this).find('a').attr('class');
	});
	
	if(oRow.next().is('.filter_group_subgroup')) {		
		oReturn.sub = [];
		var filterSub = oRow.next().children('.row');
		filterSub.each(function() {
			var rec = nsFilter.fCurrentToJSONRec($(this));
			oReturn.sub.push(rec);
		});	
	}
	
	return oReturn;
};

nsFilter.nsEvaluate = {};

nsFilter.oFilterRecord = {};

nsFilter.fClearFilter = function() {
	$("#op_range_table td").removeClass('filtered filtered_out');
	$("#op_range_table .glyphicon-filter").remove();  
	nsFilter.oFilterRecord = {};
};

nsFilter.fGetActiveFilter = function() {
	var jqActiveFilter = $('#filter_config_menu li.active');
	if (jqActiveFilter.length===0)
		return null;
		
	var sName = $(jqActiveFilter).attr('id');
	return sName;
};

nsFilter.fDrawFilterToBoard = function(oFilterRecord) {
	for(var sPairName in oFilterRecord) {
		var aPair = oFilterRecord[sPairName];
		if (aPair.length > 0) {
				$('#op_range_' + sPairName).addClass('filtered');

				var oPair = new Pair(sPairName);
				var aAllPairs = oPair.toArray(nsUI.fGetKnownCards());

				if (aAllPairs.length === aPair.length)
					$('#op_range_' + sPairName).addClass('filtered_out');
				
				if( $('#op_range_' + sPairName + ' .glyphicon-filter').length ===0)
					$('#op_range_' + sPairName + ' .static_bg').append('<span class="glyphicon glyphicon-filter"></span>');
		}			
	}
};

nsFilter.nsEvaluate.fEval = function(sName,varCards) {
	/*here i should read them from the fileStorage if present*/
	var oFilter = nsFilter.fActiveFilter(sName);
	return nsFilter.nsEvaluate.fEvaluateFilter(oFilter,varCards);
};

nsFilter.nsEvaluate.oCurrentHand = null;

//returns true if the filter hits
nsFilter.nsEvaluate.fEvaluateFilter = function(oFilter,varCards) {
	//varCards can actually be an array or the finished object...
	var oHand = {};
	if (nsUtil.fType(varCards) === 'array')
		oHand = nsDrawingHand.fGetDrawingHands(varCards);
	else
		oHand = varCards;
	
	var ns = nsFilter.nsEvaluate; 
	//code smell: quit doing side effects, Aaron	
	ns.oCurrentHand = oHand; //save this to prevent having to do it again
	
	if (!oFilter) 
		return true; //always passes null filter

	var returnVal = false;
	switch(oFilter.oValues.sub_filter_type)
	{
		case 'class_made_hand':		  
			returnVal= ns.fEvaluateMadeHand(oFilter.oValues,oHand);
			break;
		case 'class_drawing_hand':
			returnVal= ns.fEvaluateDrawingHand(oFilter.oValues,oHand);
			break;
		case 'class_filter':
			returnVal= ns.fEvaluateSubFilter(oFilter.oValues,oHand);
			break;
		case 'class_group':	
			returnVal = ns.fEvaluateGroup(oFilter,oHand);
			break;
		default: 
			returnVal = false; //should throw exception here
			console.error('filter failed');
			break;
	}
	
	
	//nsUtil.fLog('hand rank is ' + oHand.rank + ' and return value ' + returnVal )
	return returnVal;
};

nsFilter.nsEvaluate.fEvaluateGroup = function(oFilter, oHand) {
	var sub = oFilter.sub;
	//boilerplate for clarity (??)
	if (oFilter.oValues.group_log_op === 'log_op_and') { //must all be true
		for (var i=0;i<sub.length;i++) {
			var bSubResult = nsFilter.nsEvaluate.fEvaluateFilter(sub[i], oHand); 
			if (bSubResult === false)
				return false;
	
		}
		return true;
	}
	else if (oFilter.oValues.group_log_op === 'log_op_or'){ //only one must be true	
		for (var i=0;i<sub.length;i++) {
			var bSubResult = nsFilter.nsEvaluate.fEvaluateFilter(sub[i], oHand); 
			if (bSubResult === true)
				return true;
		}
		return false;		
	}					
};

nsFilter.nsEvaluate.fEvaluateSubFilter = function(oValues, oHand) {
	var sName = oValues.sub_filter_op; //"strong_hand"
	var aSplit = sName.split('_');
	var aSliced = aSplit.slice(2);
	var sFinal = aSliced.join('_');
	return nsFilter.nsEvaluate.fEval(sFinal,oHand);
};

nsFilter.nsEvaluate.fEvaluateMadeHand = function(oValues, oHand) {
	var iFilterRank = parseInt( oValues.made_hand_op.split('_')[2] );
	if (oValues.comparator_op === 'at_least') {
		if (oHand.rank >= iFilterRank)
			return true;
		else
			return false;
	}
	else if(oValues.comparator_op === 'at_most') {
		if (oHand.rank <= iFilterRank)
			return true;
		else
			return false;
	}
	
	//should never get here
};

nsFilter.nsEvaluate.fEvaluateDrawingHand = function(oValues, oHand) {
	var iFilterRank = parseInt( oValues.drawing_hand_op.split('_')[2] );
	
	var iDrawingHandRank = -1;
	if (oHand.drawingHands.length > 0)
		iDrawingHandRank = oHand.drawingHands[0].rank; //THESE SHOULD ALREADY BE SORTED
	
	if (oValues.comparator_op === 'at_least') {
		if (iDrawingHandRank >= iFilterRank)
			return true;
		else
			return false;
	}
	else if(oValues.comparator_op === 'at_most') {
		if (iDrawingHandRank <= iFilterRank)
			return true;
		else
			return false;
	}
};

nsFilter.fSetEditedJson = function() {
	nsFilter.sEditedJSON = JSON.stringify(nsFilter.fCurrentToJSON());
};

 

/*
nsFilter.nsStandardFilters['strong_hand'] = {
											"oValues":{
												"sub_filter_type":"class_group","group_log_op":"log_op_or"},
											"sub":[
												{"oValues":{"sub_filter_type":"class_made_hand","comparator_op":"at_least","made_hand_op":"made_hand_2"}},
												{"oValues":{"sub_filter_type":"class_drawing_hand","comparator_op":"at_least","drawing_hand_op":"drawing_hand_3"}}]};

nsFilter.nsStandardFilters['junk'] = {
										"oValues":
											{"sub_filter_type":"class_group","group_log_op":"log_op_and"},
										"sub":[
											{"oValues":{"sub_filter_type":"class_made_hand","comparator_op":"at_most","made_hand_op":"made_hand_0"}},
											{"oValues":{"sub_filter_type":"class_drawing_hand","comparator_op":"at_most","drawing_hand_op":"drawing_hand_2"}}]}; 
										
nsFilter.nsStandardFilters['bluffy'] =	{
											"oValues":{"sub_filter_type":"class_group","group_log_op":"log_op_or"},
											"sub":[{"oValues":{"sub_filter_type":"class_filter","sub_filter_op":"strong_hand"}},{"oValues":{"sub_filter_type":"class_filter","sub_filter_op":"junk"}}]} */


