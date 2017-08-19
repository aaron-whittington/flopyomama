
var SettingsModel = require('./Settings');
var SettingsView = require('./SettingsView');
var LinkEditorView = require('./LinkEditor');
var $ = require('jquery');
module.exports = function() {
    
    var sm = new SettingsModel();
    var sv = new SettingsView({
        model: sm,
        el: $('#settings_modal .modal-body')[0]
    });
    sv.render();

    //new LinkEditorView();
};