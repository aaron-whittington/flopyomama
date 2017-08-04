
var nsUtil = {};

var fCombineObjects = function(a, b, fn) {

    //combines the two objects and performs the function with the properties of the arguments
    var returnObject = {},
        prop;
    for (prop in a) {
        returnObject[prop] = fn(a[prop], b[prop]);
    }
    for (prop in b) {
        if (typeof a[prop] === "undefined")
            returnObject[prop] = fn(a[prop], b[prop]);
    }
    return returnObject;
};


var fSortPropertiesOfObject = function(ob, fn) {
    var returnProp = [];
    for (var prop in oVillainStat) {
        returnProp.push(prop);
    }
};


var TYPES = {
        'undefined': 'undefined',
        'number': 'number',
        'boolean': 'boolean',
        'string': 'string',
        '[object Function]': 'function',
        '[object RegExp]': 'regexp',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object Error]': 'error'
    },
    TOSTRING = Object.prototype.toString;

//todo replace with underscore
nsUtil.fType = function(o) {
    return TYPES[typeof o] || TYPES[TOSTRING.call(o)] || (o ? 'object' : 'null');
};

//sets an object ot local storage as json, with automatic wrapping
//if object is an array
nsUtil.fSetLocalStorage = function(k, v) {

    var vType = nsUtil.fType(v);
    var sJson;
    if (vType === 'array')
        sJson = JSON.stringify({
            json_array_data_conversion: v
        }); //wrapper for arrays
    else
        sJson = JSON.stringify(v);
    localStorage.setItem(k, sJson);
};

nsUtil.fClone = function(o) {
    return JSON.parse(JSON.stringify(o));
};

nsUtil.fImportLocalStorage = function(sFile) {
    var oParsed = JSON.parse(sFile);
    for (var prop in oParsed) {
        var gotOne = oParsed[prop];
        localStorage.setItem(prop, gotOne);
    }
};

nsUtil.fExportLocalStorage = function(fTest) {
    if (nsUtil.fType != 'function') {
        fTest = function() {
            return true;
        };
    }
    var item, o = {};
    for (prop in localStorage) {
        item = localStorage.getItem(prop);
        if (fTest(prop, item)) {
            o[prop] = item;
        }
    }
    return JSON.stringify(o);
}

nsUtil.fGetLocalStorage = function(v) {
    var sJson = localStorage.getItem(v);

    try {
        var o = JSON.parse(sJson);
    } catch (e) {
        console.log("unexpected localStorage key, val: " + v + ", " + sJson);
        return null;
    }
    if (typeof(o) === "object" && o !== null && o.json_array_data_conversion) {
        return o.json_array_data_conversion;
    } else
        return o;
};

nsUtil.fLog = function(text) {
    console.log(text);
};