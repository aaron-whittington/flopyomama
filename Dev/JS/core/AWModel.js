var _ = require('underscore');
var Backbone = require('backbone');
var nsUtil = require('../Util');
//modell with custom constructors
var AWModel = Backbone.Model.extend({
    //call constructor methods with args from special classes 
    className: 'AWModel',
    constructor: function() {
        var prm = arguments;
        var oPrms;
        if (prm.length > 0) {
            if (_.isString(prm[0])) {
                oPrms = this._stringToPrm(prm);
            } else if (_.isNumber(prm[0])) {
                oPrms = this._numToPrm(prm);
            } else if (_.isArray(prm[0])) {
                oPrms = this._arrToPrm(prm);
            }
        }

        //send it down the chain
        if (!_.isUndefined(oPrms)) {
            Backbone.Model.apply(this, [oPrms]);
        }
        //argument[0] was an object so we do the default initialization
        else {
            Backbone.Model.apply(this, prm);
        }
    },
    toggle: function(attr) {
        //todo: implement for arrays, ggf. strings, objects
        var val = !this.get(attr);
        this.set(attr, val);
        return val;
    },
    /*The _*ToPrm functions are used so that subclasses can use constructors
     * with types other than object (which is the backbone default)*/
    _numToPrm: function() {

    },
    _arrToPrm: function() {

    },
    _stringToPrm: function() {

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
        nsUtil.fLog('	JSON:	' + json);
        nsUtil.fLog('	toString:	' + sInter);
        nsUtil.fLog('	toDisplayString:	' + sExter);
    }
});

module.exports = AWModel;
