var nsHtml = {};

nsHtml.fGetBoardSelectionTable = function() { 
	var sReturn = "<div id='board_selection_table'>";
	var aCards = flopYoMama.allCards; 

	for (var suit=4; suit>0; suit--){          
		sReturn += "<div style='white-space: nowrap;'>";
		aCards.each(function(c) {
			if (c.get('suit') != suit) {
				return;
			}

			var found = flopYoMama.knownCards.allKnown().where({
				'suit': c.get('suit'), 'rank': c.get('rank')}
			).length > 0;
			sReturn += nsHtml.fWrapCard(c.attributes, found, found);
		});
		sReturn +="</div>";
	}
	sReturn += "<div>";
	return sReturn + "<span class='glyphicon glyphicon-remove'></span></div>";
};

//this is inefficient if we've just got a little change
nsHtml.fRedrawBoardSelectionTable = function() {
	$('#board_selection_table').parent().html(nsHtml.fGetBoardSelectionTable);
};

nsHtml.fWrapCard = function(id, bDisabled, bSelected) {
	var disabledString = bDisabled ? ' disabled ' : '';
	var selectedString = bSelected ? ' selected ' : '';
	
	var oCard =id;
		
	if (nsUtil.fType(id) === 'string') {
		oCard = nsConvert.fConvertStringToCardObject(id); //here we could do conversion
	}
	var innerString = nsConvert.rankNumberToChar(oCard.rank)  + nsConvert.suitToDisplayChar(oCard.suit);		
	var span = '<span class="card suit_'+nsConvert.suitToChar(oCard.suit) +' rank_'+oCard.rank + selectedString+disabledString +'">' +
         innerString +'</span>';

    return span;      
};

nsHtml.fAbbreviateDrawingHandStrings = function(sDrawing) {
	var aSplit = sDrawing.split("-"), i;
	
	for (i=0; i< aSplit.length; i++) {
		aSplit[i] = aSplit[i].trim();
	}

	var returnString = '';//nsHtml.fAbbreviateHandType(aSplit[0]);
	
	for (i=0; i< aSplit.length; i++) {
		returnString = returnString + "&nbsp;" + nsHtml.fAbbreviateHandType(aSplit[i]);
	}
	
	return returnString;
};

nsHtml.fAbbreviateInnerString = function(rankString) {
	var abrv = '';
	
	switch(rankString)
	{
		case "High Card":
		  	abrv = 'HC';
		  break;
		case "Pair":
		  	abrv = 'Pa';
		  break;
		case "Two Pair":
		  	abrv = '2P';
		  break;
		case "Three Of A Kind":
		  	abrv = '3K';
		  break;
		case "Straight":
		  	abrv = 'St';
		  break;
		case "Flush":
		  	abrv = 'Fl';
		  break;
		case "Full House":
		  	abrv = 'FH';
		  break;
		case "Four Of A Kind":
		  	abrv = '4K';
		  break;
		case "Straight Flush":
		  	abrv = 'SF';
		  break;
		case "Top Pair":
			abrv = 'TP';
			break;
		case "Backdoor Straight Draw":
			abrv = "SD(Bd)";
			break;
		case "Backdoor Flush Draw":
		  abrv = "FD(Bd)";	   
			break;		
		case "Gutshot Straight Draw":
			abrv = "SD(Gs)";
			break;
		case "Open Ended Straight Draw":
			abrv = "SD(OE)";
			break;
		case "Flush Draw":
			abrv = "FD";
			break;	
		default:
			abrv = 'UNKNOWN !!!!';
		  break;
	}
	return abrv;
};

nsHtml.fAbbreviateHandType = function(rankString) {
	
	var abrv = nsHtml.fAbbreviateInnerString(rankString); 
	return "<abbr data-toggle='tooltip' title='" + rankString +"'>" + abrv + "</abbr>";
	
};

nsHtml.fDrawMultProgressBar = function (sId,sClass, flWin,flDraw,flLoss, flOuterWidth) {

		if (!sId)
			sId = "";
		if (!sClass)
			sClass = "";
		var sOuterWidth = "";
		if(flOuterWidth) {
			var minWidth =1.5; //prevent invisible scrollbars
			flOuterWidth = Math.max(minWidth,flOuterWidth); 
			sOuterWidth = "style='width:"+flOuterWidth +"%;'";
		}
		
		
		var html ='';		
		html = html + '<div id="' + sId + '" class="progress ' + sClass + '"' + sOuterWidth +'>';
		html = html + '<div class="progress-bar progress-bar-success" style="width:' +flWin+ '%"></div>';
		html = html + '<div class="progress-bar" style="width:'+flDraw+'%"></div>';
		html = html + '<div class="progress-bar progress-bar-danger" style="width: '+flLoss+'%"></div>';
		html = html + '</div>';
		return html;
};

nsHtml.fUpdateMultProgressBar = function (sel, flWin,flDraw,flLoss) {
	$(sel).children().each(function(i){
			if (i===0)
				$(this).css('width', flWin +'%');
			if (i===1)
				$(this).css('width', flDraw + '%');
			if(i===2)
				$(this).css('width',flLoss+'%');
		
		});
};

nsHtml.fSetupTextureHover = function(oResult) {
	var oStat = oResult.oVillainStat;
	
	$('#textures .row').mouseenter(function() {
			$('#op_range').addClass('board_highlight');
		var rankString = nsHtml.oTextureResultDic[$(this).attr('id')];
		var oPairRecord = oStat[rankString].oPairRecord;
		for (var prop in oPairRecord) {
			$("#op_range_" + prop).addClass('highlight');
		}		
	});
	
	$('#textures .row').mouseleave(function() {
		$('#op_range').removeClass('board_highlight');
		$("#op_range_table td").removeClass('highlight');		
	});
		
	//oVillainStat: Object
	//	High Card: Object
	//		count: 3
	//		oPairRecord: Object
	//			KJs: 1
	//			KQs: 1
	//			KTs: 1
};

nsHtml.oTextureResultDic = {};

nsHtml.fGetTextureHtml = function(oResult) {
	var oStat = oResult.oVillainStat;
	var iCount = oResult.count;
	var returnHtml = '';
	
	var aPropArray=[], prop;
	for (prop in oStat) {
			aPropArray.push(prop);
	}		
	
	aPropArray.sort(function(a,b){return oStat[b].count - oStat[a].count;});
	var flHighestPercent = 0.0;
	for(var i=0;i<aPropArray.length;i++){
		prop = aPropArray[i];
		var cardRecord = oStat[prop];
		var hits = cardRecord.count;
		var flTotalPercent = hits/iCount *100.0;
		if (i===0) {
			flHighestPercent = flTotalPercent; 
		}
		var id = 'texture_result_'+i;
		nsHtml.oTextureResultDic[id] = prop;
		var sTotalPercent = (flTotalPercent).toFixed(1)+'%';
		var pb = nsHtml.fDrawMultProgressBar("texture_result_" + i,'sub_result_pb',0.0,100.0,0.0,flTotalPercent / flHighestPercent *100.0);
		var abbr = nsHtml.fAbbreviateHandType(prop);
		returnHtml = returnHtml + '<div class=row id="'+id+'"><div class="col-lg-6"> '+
		' <p class="text-info">'+'<span class="glyphicon glyphicon-star-empty"></span>' + abbr + ' <span class="stat_percent">('+ sTotalPercent +')</span> </p></div><div class="col-lg-6">' +
			pb + ' </div></div>';//fDrawMultProgressBar	
	}
	return returnHtml;	
};

nsHtml.PIE_THRESHOLD = 1.5;

nsHtml.fGetPieCharLegendColor = function() {
	var color = $('#palette .btn-default').css('color');
	//nsUtil.fLog('legend color ' + color);
	return color;
};

nsHtml.fGetPieChartColors = function(i) {
	var counter = 0;
	var returnArray=[];
	var round = 0;

	var colorer = function(index, node) {
			var color = $(node).css('background-color');
			//nsUtil.fLog('color: ' + color + ' round:' + round + 'class ' + $(this).attr('class'));
			var even = counter % 2 === 0;
			if (round===0)
				color = even ? color : Chromath.lighten(color,0.3).toHexString();
			else if (round===1)
				color = even ? Chromath.lighten(color,0.4).toHexString() : Chromath.darken(color,0.4).toHexString();
			else if (round===2)
				color = even ? Chromath.darken(color,0.6).toHexString() : Chromath.lighten(color,0.6).toHexString();
			else if (round===3)
				color = Chromath.lighten(color,0.2).toHexString();
			else if (round===4)
				color = Chromath.lighten(color,0.3).toHexString();
			else if (round===5)
				color = Chromath.lighten(color,0.4).toHexString();
			
			if (counter %7 === 6)
			color = Chromath.desaturate(color,1).toHexString();
			
			//nsUtil.fLog('color transformed: ' + color);
			returnArray.push(color);
			counter++;
	};

	while (counter<i) {
		

		$('#palette .btn').not('.btn-default').not('.btn-link').not('.btn-primary').each(colorer);	

		round++;
	}

 

	return returnArray;
};

nsHtml.fDrawTexturePie = function(oResult) {

	$('#inner-stats .tab-pane').removeClass('active'); //rendering not done correctly in hidden divs
	$('#textures').addClass('active');
	
	var oStat = oResult.oVillainStat, iCount = oResult.count, returnHtml = '',
		aPropArray=[], prop, jqOldActive = $('#inner-stats .tab-pane.active');
	
	for (prop in oStat) {
			aPropArray.push(prop);
	}		
	
	aPropArray.sort(function(a,b){return oStat[b].count - oStat[a].count;});
	var flHighestPercent = 0.0;
	
	$("#textures svg").remove();
	
	var pieData =[],aLegend =[], asPercent = [];
	for(var i=0;i<aPropArray.length;i++){
		
		
		prop = aPropArray[i];
		var cardRecord = oStat[prop];
		var hits = cardRecord.count;
		pieData.push(hits);
		
		var abbr = nsHtml.fAbbreviateInnerString(prop) + '\xA0' + '\xA0' + '\xA0' + '\xA0'; // some extra space;
		aLegend.push(abbr);
		
		var id = 'texture_result_'+i;
		nsHtml.oTextureResultDic[id] = prop;		
		
		
		/*save percentages*/ 
		var flTotalPercent = hits/iCount *100.0;
		var sTotalPercent = (flTotalPercent).toFixed(1)+'%';
		asPercent.push(sTotalPercent);
		
	}
	//pie = r.piechart(320, 240, 100, [55, 20, 13, 32, 5, 1, 2, 10], { legend: ["%%.%% - Enterprise Users", "IE Users"], legendpos: "west", href: ["http://raphaeljs.com", "http://g.raphaeljs.com"]});

	
	$('#textures').prepend('<strong id="pie_hover_title" style="position:absolute;left:5px;top:5px"></strong>'); //to do: styling in css
	
	var r = Raphael("textures",320,260);
	var aColors = nsHtml.fGetPieChartColors(pieData.length);
	var pie = r.piechart(200, 140, 110, pieData,{
		legend:aLegend,
		legendpos:'west',
		minPercent:nsHtml.PIE_THRESHOLD, 
		colors: aColors,
		legendcolor: nsHtml.fGetPieCharLegendColor()
	});
		
	
	pie.hover(function () {
		$('#op_range').addClass('board_highlight');
        this.sector.stop();
        this.sector.scale(1.1, 1.1, this.cx, this.cy);
		
		var jsNode = $(this.sector[0]);
		var index = jsNode.index('#textures svg path');
		if(index === -1) //if just one category graphael only draws a circle, no paths
			index = 0;
		$('#pie_hover_title').html(aPropArray[index] + ' ' + asPercent[index]);//todo write the percentage here
		
		var rankKey = 'texture_result_' +index;
		var rankString = nsHtml.oTextureResultDic[rankKey];
		var oPairRecord = oStat[rankString].oPairRecord;
		for (var prop in oPairRecord) {
			$("#op_range_" + prop).addClass('highlight');
		}	
							
        if (this.label) {
            this.label[0].stop().attr({ r: 7.5, "font-weight": 800  });
            
        }
    }, function () {
		$('#op_range').removeClass('board_highlight');
		$('#pie_hover_title').html('');
        this.sector.animate({ transform: 's1 1 ' + this.cx + ' ' + this.cy }, 500, "bounce");
		$("#op_range_table td").removeClass('highlight');	
        if (this.label) {
            this.label[0].animate({ r: 5 }, 500, "bounce");
            this.label[1].attr({ "font-weight": 400 });
        }
    });				
	//tooltips
	$('#inner-stats .tab-pane').removeClass('active'); //rendering not done correctly in hidden divs
	jqOldActive.addClass('active');
	
};

nsHtml.fGetResultStatHtml = function(oHeroStat,oDoneRecord) {
	//sort the props
		var aPropArray=[], prop;
		for (prop in oHeroStat) {
			aPropArray.push(prop);
		}
		aPropArray.sort( function(a,b) {
			return oHeroStat[b].wonCount + oHeroStat[b].lossCount + oHeroStat[b].drawCount -
				(oHeroStat[a].wonCount + oHeroStat[a].lossCount + oHeroStat[a].drawCount);
		});
								
	
	//generate the html
	var heroStatHtml = '';	
	
	for(i=0;i<aPropArray.length;i++){
	 prop = aPropArray[i];
	 var firstProp = aPropArray[0];
	 var totalCountFirstProp = oHeroStat[firstProp].wonCount + oHeroStat[firstProp].lossCount + oHeroStat[firstProp].drawCount;
	 var flTotalPercentFirstProp = totalCountFirstProp / oDoneRecord.total *100.0;
	 
	 
	 var winCount = oHeroStat[prop].wonCount;
	 var lossCount = oHeroStat[prop].lossCount;
	 var drawCount = oHeroStat[prop].drawCount;
	 var totalCount = winCount + lossCount + drawCount;
	 
	 
	 var flWinPercent = (winCount / totalCount *100.0);
	 var flLossPercent = (lossCount / totalCount *100.0);
	 var flDrawPercent = (drawCount / totalCount *100.0);
	 var flTotalPercent = (totalCount / oDoneRecord.total *100.0);
	 
	 var sWinPercent = (winCount / totalCount *100.0).toFixed(1) +'%';
	 var sLossPercent = (lossCount / totalCount *100.0).toFixed(1)+'%';
	 var sDrawPercent = (drawCount / totalCount *100.0).toFixed(1)+'%';
	 var sTotalPercent = (totalCount / oDoneRecord.total *100.0).toFixed(1)+'%';
	 var flOuterWidth = flTotalPercent / flTotalPercentFirstProp * 100.0;
	 
	 var abbrv = nsHtml.fAbbreviateHandType(prop);
	 var pb = nsHtml.fDrawMultProgressBar("hero_result_" + i,'sub_result_pb',flWinPercent,flDrawPercent,flLossPercent,flOuterWidth);

						
	 heroStatHtml = heroStatHtml + '<div class=row><div class="col-lg-4"> '+
	 ' <p class="text-info">'+'<span class="glyphicon glyphicon-star-empty"></span>' + abbrv + ' <span class="stat_percent">('+ 
	 	sTotalPercent +')</span> </p></div><div class="col-lg-8">' + pb + ' </div></div>';//fDrawMultProgressBar
	
	 //need timeout because of damned cats								
	}
	return heroStatHtml;

};

nsHtml.fDrawResultsStatPie = function(oHeroStat,oDoneRecord,sId) {
		//sort the props
	var jqOldActive = $('#inner-stats  .tab-pane.active');	
	$('#inner-stats .tab-pane').removeClass('active'); //rendering not done correctly in hidden divs
	$('#'+sId).addClass('active');
	
	var aPropArray=[], prop;
	for (prop in oHeroStat) {
		aPropArray.push(prop);
	}
	aPropArray.sort(function (a,b) {
		return oHeroStat[b].wonCount + oHeroStat[b].lossCount + oHeroStat[b].drawCount-
			(oHeroStat[a].wonCount + oHeroStat[a].lossCount + oHeroStat[a].drawCount);
		}
	);
		
		
	var flHighestPercent = 0.0;
	
	$("#" +sId +" svg").remove();
	
	var pieData =[], aLegend =[], asTitle = [];
	var asPercent = [], asPercentWin = [], asPercentDraw = [];
	var asPercentLoss = [];	
	var sOthersLegend = '';
	var sOthers = '';
	var i, sWinPercent, sDrawPercent,sTotalPercent,flOuterWidth;
	for(i=0;i<aPropArray.length;i++){
		 prop = aPropArray[i];
		 var firstProp = aPropArray[0];
		 var totalCountFirstProp = oHeroStat[firstProp].wonCount + oHeroStat[firstProp].lossCount + oHeroStat[firstProp].drawCount;
		 var flTotalPercentFirstProp = totalCountFirstProp / oDoneRecord.total *100.0;
		 
		 
		 var winCount = oHeroStat[prop].wonCount;
		 var lossCount = oHeroStat[prop].lossCount;
		 var drawCount = oHeroStat[prop].drawCount;
		 var totalCount = winCount + lossCount + drawCount;
		 
		 
		 var flWinPercent = (winCount / totalCount *100.0);
		 var flLossPercent = (lossCount / totalCount *100.0);
		 var flDrawPercent = (drawCount / totalCount *100.0);
		 var flTotalPercent = (totalCount / oDoneRecord.total *100.0);
		 
		 sWinPercent = (winCount / totalCount *100.0).toFixed(1) +'%';
		 sLossPercent = (lossCount / totalCount *100.0).toFixed(1)+'%';
		 sDrawPercent = (drawCount / totalCount *100.0).toFixed(1)+'%';
		 sTotalPercent = (totalCount / oDoneRecord.total *100.0).toFixed(1)+'%';
		 flOuterWidth = flTotalPercent / flTotalPercentFirstProp * 100.0;
			
		pieData.push(totalCount);
		
		var abbr;
		
		abbr = nsHtml.fAbbreviateInnerString(prop) + '\xA0' + '\xA0' + '\xA0' + '\xA0'; // some extra space
		aLegend.push(abbr); //no way to make some room
		
	
		
		/*save percentages*/
		asPercent.push(sTotalPercent);
		asPercentWin.push(sWinPercent);
		asPercentDraw.push(sDrawPercent);
		asPercentLoss.push(sLossPercent);
			
		var sTitle;
		if (flTotalPercent < nsHtml.PIE_THRESHOLD) {
			sTitle = '%OTHERS%';
		}
		else {
			sTitle = aPropArray[i] + ' ' + asPercent[i] +
					' Win: ' + asPercentWin[i] + ' Draw: ' + asPercentDraw[i] + ' Loss: ' + asPercentLoss[i];
		}
		asTitle.push(sTitle);
	}
	
	for (i=0; i< asTitle.length;i++) {
		if (asTitle[i] === '%OTHERS%')
			sOthers = sOthers + ' ' + aPropArray[i] + ' WIN: ' +sWinPercent + ' ';
			//should figure it out here
	}
	
	for (i=0; i< asTitle.length;i++) {
		if (asTitle[i] === '%OTHERS%')
			asTitle[i] = sOthers;
	}
	
	
	//pie = r.piechart(320, 240, 100, [55, 20, 13, 32, 5, 1, 2, 10], { legend: ["%%.%% - Enterprise Users", "IE Users"], legendpos: "west", href: ["http://raphaeljs.com", "http://g.raphaeljs.com"]});

	$('#' + sId).prepend('<strong id="pie_hover_title_'+sId+'" style="position:absolute;top:5px;left:5px;"></strong>'); //todo styling in css
	var r = Raphael(sId,320,260);
	
	var aColors = nsHtml.fGetPieChartColors(pieData.length);
	var pie = r.piechart(200, 140, 110, pieData,{legend:aLegend,
				legendpos:'west',
				minPercent:nsHtml.PIE_THRESHOLD, 
				colors: aColors,
				legendcolor: nsHtml.fGetPieCharLegendColor()
				});
	
	pie.hover(function () {
                    this.sector.stop();
                    this.sector.scale(1.1, 1.1, this.cx, this.cy);
					
					var jsNode = $(this.sector[0]);
					var index = jsNode.index('#'+ sId+ ' svg path');
					if(index === -1) //if just one category graphael only draws a circle, no paths
						index = 0;
					var sHtml = asTitle[index]; 
					$('#pie_hover_title_' +sId).html(sHtml);//todo write the percentage here
															
                    if (this.label) {
                        this.label[0].stop();
                        this.label[0].attr({ r: 7.5 });
                        this.label[1].attr({ "font-weight": 800 });
                    }
                }, function () {
					$('#pie_hover_title_' + sId).html('');
                    this.sector.animate({ transform: 's1 1 ' + this.cx + ' ' + this.cy }, 500, "bounce");
					if (this.label) {
                        this.label[0].animate({ r: 5 }, 500, "bounce");
                        this.label[1].attr({ "font-weight": 400 });
                    }
                });		
	$('#inner-stats .tab-pane').removeClass('active'); //rendering not done correctly in hidden divs
	jqOldActive.addClass('active');
};

nsHtml.fGetPairFromString = function(sHtml, selected) {

	var oPair = new Pair(sHtml);
	var aUnjoined = oPair.toArray();	
	var aKnownCards = nsUI.fGetKnownCards();	 
	var returnString = "<div id='expanded_pair_" + sHtml + "' class='expanded_pair'>";		 
	for(i=0; i<aUnjoined.length;i++) {
		 var inKnownCards = false;
		for(var j=0;j<aKnownCards.length;j++) {
				if (aKnownCards[j].suit === aUnjoined[i][0].suit && 
					aKnownCards[j].rank === aUnjoined[i][0].rank)
					inKnownCards = true;
				else if	(aKnownCards[j].suit === aUnjoined[i][1].suit &&
					 	 aKnownCards[j].rank === aUnjoined[i][1].rank)
					inKnownCards = true;
			 }
		
		returnString = returnString + nsHtml.fWrapPair(nsHtml.fWrapCard(aUnjoined[i][0]) + 
			nsHtml.fWrapCard(aUnjoined[i][1]), inKnownCards, selected) + '    ';
	}
	returnString += "</div>";	
	return returnString;
};

nsHtml.fWrapPair = function (pairString, bDisabled, bSelected) {
	var disabledString = bDisabled ? 'disabled' : '';
	var selectedString = bSelected ? 'selected' : '';

	return "<div class = 'pair_string " +disabledString + " " + selectedString + " '>" + pairString + "</div>";
};


nsHtml.fSetMainStatBar = function(totalWonPer, totalDrawPer, totalLossPer) {
	$('#win_percent_bar div').each(function(i){
					if (i===0)
						$(this).css('width', totalWonPer +'%');
					if (i===1)
						$(this).css('width', totalDrawPer + '%');
					if(i===2)
						$(this).css('width',totalLossPer+'%');
				
	});
};

nsHtml.fInitResultPopovers = function(){
	//$(".sub_result_pb").popover('destroy');
	$("#inner-stats .sub_result_pb").popover({
		content: function(){
					var returnString = '';
					var parentWidth = parseFloat($(this).css('width'))/100.0;
					$(this).children().each(function(i){
						if (i===0)
							returnString = returnString + 'win: ' + (parseFloat($(this).css('width')) / parentWidth).toFixed(1) +'%';
						if (i===1)
							returnString = returnString + ' draw: ' + (parseFloat($(this).css('width'))/parentWidth).toFixed(1) +'%';
						if(i===2)
							returnString = returnString + ' loss: ' + (parseFloat($(this).css('width'))/parentWidth).toFixed(1) +'%';											
					});								
					return returnString;
				}, 								
		placement: 'bottom',	
		trigger: 'hover',
		html: true		
	});

};
