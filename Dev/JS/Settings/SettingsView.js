var Backbone = require('backbone');

var SettingsView = Backbone.View.extend({
    initialize: function() {
        var that = this;
        //bind here because the backbone events are incompatible
        //with the bootstrap checkboxes
        $('body').on('click', '.four_colors', function() {
            that.toggleFourColors();
            console.log('toggle four colors');
        });

        //when we show the dialog, we generate the datauri	
        $('body').on('show.bs.modal', '#settings_modal', function() {
            that.model.generateDataURI();
        });

        this.listenTo(this.model, 'change:exportURI', function() {
            $('#export_btn').attr('href', this.model.get('exportURI'));
            console.log('listenTo model change:exportURI');
        });

    },
    template: '<form class="settings">' +
        '<div class="checkbox four_colors">' +
        '<label>' +
        '<input type="checkbox" {{{checked}}}>' +
        'Four Colors' +
        '</label>' +
        '</div>' +
        '<div class="form-group">' +
        '<label for="tools_import">Import Data</label>' +
        '<textarea id="tools_import" class="form-control">' +
        '</textarea>' +
        '<button id="import_btn" class="btn" type="button">Import Data <span class="glyphicon glyphicon-upload"></span></button>' +
        '</div>' +
        '<div class="form-group">' +
        '<a class="btn" href="{{{dataURI}}}" id="export_btn"' +
        'download="flopYoMama.json" type="a">' +
        'Export Data' +
        '<span class="glyphicon glyphicon-download"></span>' +
        '</button>' +
        '</div>' +
        '</form>',
    render: function() {
        var checked = this.model.get('fourColors') ? 'checked' : '';
        var html = Mustache.render(this.template, {
            'checked': checked,
            'dataURI': this.model.get('exportURI')
        });
        this.$el.html(html);
    },
    events: {
        'click #import_btn': 'importData',
    },
    toggleFourColors: function() {
        this.model.set('fourColors', $('.four_colors input').is(':checked'));
    },
    importData: function() {
        var val = $('#tools_import').val();
        try {
            nsUtil.fImportLocalStorage(val);
            alert('Data successfully imported.');
        } catch (e) {
            alert('Data import failed. Please paste exported data in the text area.');
        }
    }
});

module.exports = SettingsView;