var nsPrefs = {};

nsPrefs.nsConst = {};

nsPrefs.Preference = function(oDefault, sDescription, fDrawControl) {
    var oValue = null;
    this.fGet = function() {
        if (oValue !== null)
            return oValue;
        else
            return oDefault; //here we should evaluate oDefault if it is a function
    };

    this.fSet = function(val) {
        oValue = val;
    };
};

nsPrefs.oAutomaticSearch = new nsPrefs.Preference(true, 'Long searches are started automatically, rather than by button press');


nsPrefs.nsConst.BAR_GRAPHS = 0;

nsPrefs.nsConst.PIE_GRAPHS = 1;

nsPrefs.oGraphType = new nsPrefs.Preference(nsPrefs.nsConst.PIE_GRAPHS, 'Pie charts are yummy.');

module.exports = nsPrefs;