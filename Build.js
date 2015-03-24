console.log("NOW LOADING SCRIPT Build.js");
var less = require( 'less' );
var fs = require( 'fs' );
var path = require('path');
var async = require('async');



 
var nsBuild = {};

nsBuild.aMinJs = [];


nsBuild.fStart = function(aCommandLine) {
	console.log('NOW START BUILD WITH CONFIG ' +aCommandLine[2])
	nsBuild.fMain(aCommandLine[2]);
}

var B_RELEASE = true;
var B_DEV = true;
nsBuild.fMain = function(config, done) {
	START_TIME = new Date().getTime();

	
	if (config == 'dev')
		B_RELEASE = false;
	/*LESS*/
	
	var devFunctions = [];
	
	if (B_DEV)
		devFunctions.push(function(callback) {
				nsBuild.fReadLessDev(undefined,undefined,callback); 
				//callback(null, 'Main Less');
			}
		);
	
	if (B_DEV)
		for(var i in A_THEMES) {
			devFunctions.push( function(callback) {
								nsBuild.fReadLessDev(undefined,A_THEMES[i],callback) 
								}
							)
		};
	
	var relFunctions = [];
	
	if (B_RELEASE)
		relFunctions.push(function(callback) {
				nsBuild.fReadLessRelease(undefined,undefined,callback)
		});
	
	if (B_RELEASE)
		for(var i in A_THEMES) {
			relFunctions.push(
				function(callback) {
					nsBuild.fReadLessRelease(undefined,A_THEMES[i],callback) 
					
				})
		};
	
	var allLessFunctions = devFunctions.concat(relFunctions);
	

	
	var fLessMainFunction = function(callback) {
		console.log('NOW CREATING LESS, number of functions = ' + allLessFunctions.length);
		async.parallel(allLessFunctions,
				function(err, results){
					if(err) {
						throw err;
					
					}					
					console.log('DONE CREATING LESS');
					console.log('');
					callback();
				}
		);
	}
	
	var fClosureMainFunction = function(callback) {
		console.log('NOW RUNNING CLOSURE');		
		nsBuild.nsClosure.start(function() {				
				console.log('DONE RUNNING CLOSURE');
				console.log('');
				callback();				
			}
		);
	}
	
	var fCopyNeedFilesFunction = function(callback) {
		console.log('NOW COPYING FILES');		
		nsBuild.nsCopy.fCopyNeededFiles(function() {
			console.log('DONE COPYING FILES');
			console.log('');		
			callback();
		})	
	}
	
	var fDoTemplates = function(callback) {
		console.log("NOW STARTING fDoTemplates");		
		nsBuild.fEditHtml(function() {
			console.log("fDoTemplates done");
			callback();
		})	
	}
	
	
	var mainFunctions = [];
	
	
	mainFunctions.push(fLessMainFunction);
	mainFunctions.push(fDoTemplates);
	
	
	if (B_RELEASE) {
		mainFunctions.push(fCopyNeedFilesFunction);
		mainFunctions.push(fClosureMainFunction);
	}
	
	console.log("NOW STARTING MAIN FUNCTIONS: count " + mainFunctions.length );
	async.series(mainFunctions,
		function(err, results){			
			
			if(err)
				throw err;	
			var END_TIME = new Date().getTime();			
			console.log('Success. Operation took ' + (END_TIME - START_TIME) /1000.0 + 's');
			done();
		}
	);
	
	//	nsBuild.nsCopy.fCopyNeededFiles(function() {
	//	});	
}

nsBuild.fEditHtml = function(callback) {

	console.log('now reading file FlopYoMamaTemplate.html');
	
	fs.readFile( './Dev/FlopYoMamaTemplate.html', 'utf-8', function(error,data) {							
		
		console.log("EDIT HTML INNER");
		
		if(error) {
			console.log("ERROR " + error);
			throw error;
		}
		
		var aDevScripts = [
			"AWModel.js",
			"AWView.js",
			"route.js",
			"flopyomama.js",
			"hand.js",
			"convert.js",
			"maths.js", 
			"ui.js",
			"html.js",
			"range.js",
			"util.js",
			"test.js",
			"drawinghand.js",
			"filter.js", 
			"filterHtml.js",
			"preferences.js",
			/*"advanced-pie.js",*/
			"slider.js",
			"card.js",
			"pair.js",
			"board.js",
			"rangetable.js",
			"menu.js"
			];
		
		
		var	aReleaseScripts = ["flopyomama.min.js",
			"lib.min.js",
			"advanced-pie.min.js"];
		
		var devClassString = 'DEV_VERSION';
		var relClassString = 'RELEASE_VERSION';
		var scriptPH = '<%SCRIPTS%>';
		var classPH = '<%DEVTYPE%>';
		var fTagFromName = function(name) {
				return '<script type="text/javascript" src="js/' + name + '"></script>';
		}
		var sRelease ='',sDev ='';
		for(var i=0; i<aDevScripts.length; i++) {
			sDev += fTagFromName(aDevScripts[i]);
		}
	
		for(var i=0; i<aReleaseScripts.length; i++) {
			sRelease += fTagFromName(aReleaseScripts[i]);
		}
			
		var releaseHtml = data.replace(scriptPH,sRelease).replace(classPH,relClassString); // this is
		var devHtml = data.replace(scriptPH,sDev).replace(classPH,devClassString); // this is
		
		var counter =0;
		
		fs.writeFile('Release/FlopYoMama.html', releaseHtml, function (err) {				
				counter++;
				if (err){
					throw 'Trouble writing file FlopYoMama.html';
				}
				else {
					console.log('FlopYoMama.html refactored');
					if(counter==2)
							callback(err,'');
				}
			}
		);	

		fs.writeFile('Dev/FlopYoMama.html', devHtml, function (err) {
				counter++;		
						if (err){
							throw 'Trouble writing file FlopYoMama.html';
						}
						else { 
							console.log('FlopYoMama.html refactored');
						
							if(counter==2)
									callback(err,'');
						}
					}
				);			
	});
}

var START_TIME;


MAIN_LESS_FILE = 'Dev/Style/FlopYoMama.less';
A_THEMES = ["Amelia","Slate","United"];

nsBuild.fReadLessDev = function (filename,themename,callback) {
	filename = MAIN_LESS_FILE;	
	
	fs.readFile(filename, function(error,data) {
		if (error)
			throw error;
		console.log("Now reading file " + filename);
		nsBuild.fCreateLessDev(error,data,themename,callback)
	});
}

nsBuild.fReadLessRelease = function (filename,themename,callback) {
	filename = MAIN_LESS_FILE;	
	fs.readFile(filename, function(error,data) {
		nsBuild.fCreateLessRelease(error,data,themename,callback);
		
	});
}


nsBuild.nsClosure = {};

nsBuild.nsClosure.start = function(callback) {			
	fs.readdir(closureInputDir, function(err, result)  {
		nsBuild.nsClosure.fReadDirCallback(err,result,callback);
	});		
}

var outputFile = __dirname + "/Release/JS/" + "lib.min.js"; 
var closureInputDir = __dirname +"/Dev/JS/";
var closureJar = __dirname + "/DevTools/compiler.jar";


nsBuild.nsClosure.fReadDirCallback = function(err,aFiles, callback) {
		var aMain=[];
		var aToFilterOut=["flopyomama.js","altloading.js","workertextures.js","worker.js","workerfilter.js","advanced-pie.js","test.js"];
		var aFilterOutNames =[];
		var aFilterOuts=[];
		//var sAltLoading = "altloading.js";
		
		for(var i=0; i< aFiles.length; i++) {
				var toLower = aFiles[i].toLowerCase();
				var toAdd = '--js "' + __dirname +'/Dev/Js/' + toLower + '"' ;
				//not a FilterOut
				//console.log('toLower: ' + toLower);
				if (toLower.indexOf('--') === 0 || toLower.length < 4)
					continue;
					
				if (aToFilterOut.indexOf(toLower) == -1) { //FilterOut names should be created individually
					aMain.push(toAdd);
					nsBuild.aMinJs.push(toLower);
				}
				else {
					var sName = toLower.split('.')[0] + '.min.' + 'js';
					aFilterOutNames.push(sName);
					aFilterOuts.push(toAdd);
					
				}
		}
			
		var sMainFiles = aMain.join(' ');
			
			//console.log('Closure compiler now processing main files');
		var aJarCommands =[];
		aJarCommands.push('java -jar "'+ closureJar+'" '+sMainFiles+' --js_output_file "'+ outputFile+'"');
			
		//now the FilterOuts
		for(var i=0; i<aFilterOuts.length;i++) {
			var sName = aFilterOutNames[i];
			var outputFileFilterOut = __dirname + "/Release/JS/" + sName; 
			aJarCommands.push('java -jar "'+ closureJar+'" '+aFilterOuts[i]+' --js_output_file "'+ outputFileFilterOut+'"');
		}
		
		
		var singleJarCallback = function() {
		
		};
		
		var aJarFunctions =[];
		var j=0;
		for(var i=0;i<aJarCommands.length;i++) {
				nsBuild.fRunCommandLine(aJarCommands[i], 'SUCCESS!', function() {				
					j++; 	
					//console.log('creating min file ' + j);
					if (j==aJarCommands.length) {
						callback();
					};
				});			
		};
		
		
		/*async.parallel(aJarFunctions,
			// optional callback
			function(err, results){
				callback(err,results);
			}
		);*/
		
		

	}

nsBuild.nsCopy = {};	


nsBuild.nsCopy.fCopyNeededFiles = function(callback) {
	var ncp = require('ncp').ncp;
	
	ncp.limit = 50000;
	var source  = __dirname + "/Dev/Lib";
	var destination = __dirname + "/Release/Lib";
	var ncp = require('ncp').ncp;
	var options = {};
	var iCounter = 0;
	options.filter = function(name) {
		
		var aSplit = name.split('/');
		var sLast = aSplit[aSplit.length-1];
		var aSplit2 = sLast.split('\\');
		name = aSplit2[aSplit2.length-1];
		
		//".jpeg",".jpg"
		var toFind = ["min.js","min.css",".png",".svg",".woff",".ttf","glyphicons.css"];		
		if (name.indexOf('.')==-1)  { //copy all folders, could clean up later			
			return true;
		}
		
		for (i=0; i< toFind.length;i++) {
			if (name.indexOf(toFind[i]) != -1) {
				iCounter++;
				return true;
			}
		}
		return false;
	};
	//ncp(source,destination,options);
	//copy the html file
	ncp(source, destination, options, function (err) {
		 if (err) {
		   throw err;
		 }	
		callback(err, '   ');
	});
}

nsBuild.fRunCommandLine = function(sCommand, sSuccess, callback) {
	var fCommand = require('child_process').exec;
	fCommand(sCommand, function( error, stdout, stderr) {
		
		   if ( error != null ) {
				console.log(stderr);
				console.log(sCommand);
				throw error;  // error handling & exit
		   }	  
			else {
				//if(sSuccess)
				//	console.log(sSuccess);
			}
		   if(stdout!=null &&stdout.length > 0)
				console.log('stdout: ' + stdout);
				
			if(callback)
				callback();
	   });
}


nsBuild.fCreateLessDev = function (error,data,theme,callback) {
	 var options = nsBuild.fGetLessDevOptions(theme);
	 nsBuild.fCreateLess(error, data, options, callback);
}

nsBuild.fCreateLessRelease = function (error,data,theme,callback) {
	 var options = nsBuild.fGetLessReleaseOptions(theme);
	 nsBuild.fCreateLess(error, data, options,callback);
}

nsBuild.fCreateLess = function ( error, data, options, callback ) {
  var dataString = data.toString();  
  if(!dataString) {
     console.log("ERROR AW Build.js no dataString with options " + options);
	 
  }
  var filename = options.filename;

  less.render(dataString, options)
	  .then(function(output) {
		
			fs.writeFile( options.outputDir + options.outputfile, output.css, 'utf8',
				callback );

		}, function(error) {
			
			  if ( error ) {
				less.writeError( error, options );
				throw error;
			  }


		});

  return;
}
 
//
nsBuild.ensureDirectory = function (filepath) {
  var dir = path.dirname(filepath);
  var existsSync = fs.existsSync || path.existsSync;
  if (!existsSync(dir)) { fs.mkdirSync(dir); }
};

nsBuild.fGetThemeVars = function(theme, sBaseDir){
	o={};
	
	o.variablesPath = "Dev/Lib/bootstrap/less";
	o.outputDir = sBaseDir; 
	
	if (typeof theme != 'undefined') {
		o.variablesPath = "Dev/Style/Themes/" + theme;
		o.outputDir = sBaseDir + '/themes/' + theme; 
	}
	
	console.log(o.variablesPath)
	
	return o;
}

nsBuild.fGetLessDevOptions = function(theme) {
	
	var oPaths = nsBuild.fGetThemeVars(theme,"Dev/Style");
	var options = {
    paths         : ["Dev/Style",oPaths.variablesPath],      // .less file search paths
    outputDir     : oPaths.outputDir,   // output directory, note the '/'
    optimization  : 1,                // optimization level, higher is better but more volatile - 1 is a good value
    filename      : "FlopYoMama.less",       // root .less file
    compress      : false,             // compress?
    yuicompress   : false              // use YUI compressor?
  };
  
  options = nsBuild.fCompleteOptions(options);
  return options;
}

nsBuild.fGetLessReleaseOptions = function(theme) {
	var oPaths = nsBuild.fGetThemeVars(theme,"Release/Style");
	
	var options = {
    paths         : ["Dev/Style",oPaths.variablesPath],      // .less file search paths
    outputDir     : oPaths.outputDir,   // output directory, note the '/'
    optimization  : 1,                // optimization level, higher is better but more volatile - 1 is a good value
    filename      : "FlopYoMama.less",       // root .less file
    compress      : true,             // compress?
    yuicompress   : true              // use YUI compressor?
  };
  
  options = nsBuild.fCompleteOptions(options);
  return options;
}

nsBuild.fCompleteOptions = function(options) {
	 // Create a file name such that
  //  if options.filename == gaf.js and options.compress = true
  //    outputfile = gaf.min.css
  options.outputfile = options.filename.split(".less")[0]  + ".css"; //same name + (options.compress ? ".min" : "")
  // Resolves the relative output.dir to an absolute one and ensure the directory exist
  options.outputDir = path.resolve( process.cwd(), options.outputDir) + "/";
  
  nsBuild.ensureDirectory( options.outputDir );
  return options;
}

module.exports = {
	nsBuild: nsBuild
}


//nsBuild.fStart(process.argv);
