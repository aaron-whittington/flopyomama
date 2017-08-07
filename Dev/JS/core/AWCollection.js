var  _ = require('underscore');
var Backbone = require('backbone');
var nsUtil = require('../Util');

//collection with custom constructors
var AWCollection = Backbone.Collection.extend({
    className: 'AWCollection',
    //call constructor methods with args from special classes 
    constructor: function() {
        var prm = arguments,
            aPrms;
        if (prm.length > 0 && prm[0] != null) {
            //special case, constructor called from AWCollectionModel
            if (prm[0].bAWUnpack) {
                prm = prm[0];
            }
            //nsUtil.fLog(JSON.stringify(this));

            if (_.isString(prm[0])) {
                aPrms = this._stringToPrm(prm);
            } else if (_.isNumber(prm[0])) {
                aPrms = this._numToPrm(prm);
            } else if (_.isObject(prm[0]) && !_.isArray(prm[0])) {
                aPrms = this._objToPrm(prm);
            }
        }

        //send it down the chain
        if (!_.isUndefined(aPrms)) {
            Backbone.Collection.apply(this, [aPrms]);
        } else {
            Backbone.Collection.apply(this, prm);
        }
    },
    _numToPrm: function() {

    },
    _objToPrm: function() {

    },
    _stringToPrm: function() {

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
        var s = ''
        this.forEach(function(oItem) {
            s += oItem.toString();
        });
        return s;
    },
    toDisplayString: function(bSeparator) {
        var s = '';
        this.forEach(function(oItem) {
            s += oItem.toDisplayString();
            if (bSeparator)
                s += ' ';
        });
        return s;
    },
    test: function() {
        var oJson = this.toJSON();
        json = JSON.stringify(oJson);
        sInter = this.toString();
        sExter = this.toDisplayString();
        nsUtil.fLog('TEST: ' + this.className + ' id: ' + this.id);
        nsUtil.fLog('	JSON:	' + json);
        nsUtil.fLog('	toString:	' + sInter);
        nsUtil.fLog('	toDisplayString:	' + sExter);
    }
});

module.exports = AWCollection;
