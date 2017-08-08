var AWModel = require('./AWModel');
var AWCollection = require('./AWCollection');
var Backbone = require('backbone');

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

        Backbone.Model.apply(this, prm);
    },
    collection: AWCollection,
    _numToPrm: function() {
        return this._collection._numToPrm();
    },
    _objToPrm: function() {
        return this._collection._objToPrm();
    },
    _stringToPrm: function() {
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

module.exports = AWCollectionModel;
