var AWView = require('../../Core/AWView');
//item view for the fixed range editor
FixedRangeEditorItemView = AWView.extend({
    initialize: function() {
        this.compiledTemplate = Mustache.compile(this.template);
        //we have to render this when created, otherwise
        //teh click events will not work because the $el must be set up
        this.render();
    },
    render: function() {
        var oData = this.renderData();
        var output = this.compiledTemplate(oData);
        $('#fixed_range_editor .modal-body').append(output);
        this.$el = $(".fixed_range_editor." + oData.id);
    },
    renderData: function() {
        //generate the custom string 
        var cust = this.model.get('custom');
        var sCust = "";
        if (cust) {
            var as = _.map(cust, function(o) {
                return o.toCustomString();
            });

            var sCust = as.join(', ');
        }
        return {
            id: this.model.getIdName(),
            name: this.model.get('name'),
            desc: this.model.get('desc'),
            sliderVal: this.model.get('sliderVal'),
            sliderScale: this.model.get('sliderScale'),
            custom: sCust
        }
    },
    events: {
        'click .edit': 'handleEdit',
        'click .delete': 'handleDelete'
    },
    handleEdit: function() {
        var parent = this.options.parent;
        parent.model.set(this.model.toJSON());
    },
    handleDelete: function() {
        var model = this.model;
        //TODO: here, we can check if it's a default and give a different message
        //but we need to implement this for both this and the filter editor
        if (confirm("Really delete " + model.get('name') + '?')) {
            this.model.collection.remove(model);
        }
    },
    template: '<div class="row fixed_range_editor {{{id}}}" title="{{{desc}}}">' +
        '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">' +
        '<div class="btn-group" role="group" ' +
        'aria-label="buttons for editing this">' +
        '<button type="button" class="btn edit btn-default">' +
        '<span class="glyphicon glyphicon-pencil"/>' +
        '</button>' +
        '<button type="button" class="btn delete btn-danger">' +
        '<span class="glyphicon glyphicon-trash"/>' +
        '</button>' +
        '</div>' +
        '</div>' +
        '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">{{{name}}}</div>' +
        '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">{{{sliderScale}}} {{{sliderVal}}}%</div>' +
        '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">{{{custom}}}</div>' +
        '</div>'
});

module.exports = FixedRangeEditorItemView;