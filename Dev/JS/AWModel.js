//modell with custom constructors
var AWModel = Backbone.Model.extend({
	//call constructor methods with args from special classes 
	className: 'AWModel',
	constructor: function() {
		var prm = arguments;
		var oPrms;
		if (prm.length >0) {
			if(_.isString(prm[0])) {			
				oPrms = this._stringToPrm(prm);
			}
			else if(_.isNumber(prm[0])) {
				oPrms = this._numToPrm(prm);
			}
			else if(_.isArray(prm[0])) {
				oPrms = this._arrToPrm(prm);
			}
		}

		//send it down the chain
		if(!_.isUndefined(oPrms)) {
			Backbone.Model.apply(this,[oPrms]);
		}
		//argument[0] was an object so we do the default initialization
		else {
			Backbone.Model.apply(this,prm);
		}
	},
	toggle: function(attr) {
		//todo: implement for arrays, ggf. strings, objects
		var val = !this.get(attr);
		this.set(attr,val);
		return val;
	},
	/*The _*ToPrm functions are used so that subclasses can use constructors
	 * with types other than object (which is the backbone default)*/
	_numToPrm : function() {
	
	},
	_arrToPrm : function() {
	
	},
	_stringToPrm : function() {
	
	},
	//some attributes do not need to be serialized 
	//for example, I don't want the 
	attributesToSave: function() {
		return this.attributes;
	},
	_loadFromURL: function() {


	},
	_loadFromLocalStorage: function() {

	},
	load: function() {
			
	
	},
	toString: function() {

	},
	toDisplayString: function() {
		return this.toString();
	},
	test: function() {
		json = JSON.stringify(this.toJSON());
		sInter = this.toString();
		sExter = this.toDisplayString();
		nsUtil.fLog('TEST: ' + this.className + ' id: ' + this.id);
		nsUtil.fLog('	JSON:	' + json );
		nsUtil.fLog('	toString:	' + sInter);
		nsUtil.fLog('	toDisplayString:	' +sExter); 
	}
});	

//collection with custom constructors
var AWCollection = Backbone.Collection.extend({
	className: 'AWCollection',
	//call constructor methods with args from special classes 
	constructor: function() {
		var prm = arguments, aPrms;
		if (prm.length >0 && prm[0] != null) {
		//special case, constructor called from AWCollectionModel
			if (prm[0].bAWUnpack) {
				prm = prm[0];
			}		
			//nsUtil.fLog(JSON.stringify(this));
			
			if(_.isString(prm[0])) {			
				aPrms = this._stringToPrm(prm);
			}
			else if(_.isNumber(prm[0])) {
				aPrms = this._numToPrm(prm);
			}
			else if(_.isObject(prm[0]) && !_.isArray(prm[0])) {	
				aPrms = this._objToPrm(prm);
			}
		}	
		
		//send it down the chain
		if(!_.isUndefined(aPrms)) {
			Backbone.Collection.apply(this,[aPrms]);
		}
		else {
			Backbone.Collection.apply(this,prm);
		}
	},
	_numToPrm : function() {
	
	},
	_objToPrm : function() {
	
	},
	_stringToPrm : function() {
	
	},	 
	_prepareModel: function(attrs, options) {
      if (attrs instanceof Backbone.Model) {
        if (!attrs.collection) attrs.collection = this;
        return attrs;
      }
      options || (options = {});
      options.collection = this;
      var model = new this.model(attrs, options);
      if (!model._validate(attrs, options)) {
        this.trigger('invalid', this, attrs, options);
        return false;
      }
      return model;
    },
	toString: function() {
		var s= ''
		this.forEach(function(oItem) {
			s+=oItem.toString();
		});
		return s;
	},
	toDisplayString: function(bSeparator) {
		var s= '';
		this.forEach(function(oItem) {
			s+=oItem.toDisplayString();
			if(bSeparator)
				s+=' ';
		});
		return s;		
	},
	test: function() {
		var oJson =this.toJSON();
		json = JSON.stringify(oJson);
		sInter = this.toString();
		sExter = this.toDisplayString();
		nsUtil.fLog('TEST: ' + this.className + ' id: ' + this.id);
		nsUtil.fLog('	JSON:	' + json );
		nsUtil.fLog('	toString:	' + sInter);
		nsUtil.fLog('	toDisplayString:	' +sExter); 
	}
});	

//wraps a collection so it can be used as a model
var AWCollectionModel = AWModel.extend({
	className: 'AWCollectionModel',
	_collection: null,
	getCollection: function() {
		return this._collection;
	},
	constructor: function() {
		var prm = arguments;
		prm.bAWUnpack = true;
		this._collection = new this.collection(
			prm
		);
		
		Backbone.Model.apply(this,prm);
	},
	collection: AWCollection,
	_numToPrm : function() {
		return this._collection._numToPrm();
	},
	_objToPrm : function() {
		return this._collection._objToPrm();
	},
	_stringToPrm : function() {
		return this._collection._stringToPrm();
	},
	toString: function() {
		return this._collection.toString();
	},
	toDisplayString: function() {
		return this._collection.toDisplayString(true);		
	},
	test: function() {
		this._collection.test();
	},
	toJSON: function() { //i'd actually have to implement here all the collection classes
		return this._collection.toJSON(); 
	}
});	


