"use strict"
var AWModel = require('../Core/AWModel');
var SettingsModel = AWModel.extend({
    initialize: function() {

        //four colors
        var clFourColors = "four_color";
        this.on('change:fourColors', function() {
            var fc = this.get('fourColors');
            if (fc) {
                $('body').addClass(clFourColors);
            } else {
                $('body').removeClass(clFourColors);
            }

            nsUtil.fSetLocalStorage(clFourColors, fc);
            this.generateDataURI();
        });

        this.set('fourColors', nsUtil.fGetLocalStorage(clFourColors));
    },
    generateDataURI: function() {
        var json = nsUtil.fExportLocalStorage();

        var href = "data:application/json;charset=UTF-8," +
            encodeURIComponent(json);
        this.set('exportURI', href);
    }
});
module.exports = SettingsModel;
