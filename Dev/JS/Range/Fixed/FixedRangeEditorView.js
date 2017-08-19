
AWView = require('../../Core/AWView');
FixedRangeEditorItemView = require('./FixedRangeEditorItemView');
//collection view for the fixed-range editor
FixedRangeEditorView = AWView.extend({
    initialize: function() {
        this.compiledTemplate = Mustache.compile(this.template);
        this.render();
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.collection, 'remove', this.render);
        this.listenTo(this.collection, 'add', this.render);
    },
    render: function() {
        this.destroy();
        var oData = this.renderData();
        var output = this.compiledTemplate(oData);
        $('#fixed_range_editor .modal-body').append(output);
        this.$el = $(".fixed_range_editor." + oData.id);
        var that = this;
        this.collection.each(function(m) {
            var view = new FixedRangeEditorItemView({
                model: m,
                parent: that
            });
        });
    },
    renderData: function() {
        console.log('fixedRangeEditor now rendering data');
        //the model is just the current range with no description
        //or name
        var mod = this.model;
        var atts = _.clone(mod.attributes);
        var cust = mod.get('custom');
        var sCust = "";
        if (cust) {
            var as = _.map(cust, function(o) {
                return o.toCustomString();
            });
            var sCust = as.join(', ');
        }
        atts.custom = sCust;
        return atts;
    },
    updateModelFromForm: function() {
        var modName = $('#fef_name').val();
        var modDesc = $('#fef_desc').val();
        //todo, put validation on the model
        if (modName.length < 2) {
            return false;
        }
        this.model.set({
            'name': modName,
            'desc': modDesc
        });
        return true;
    },
    trySave: function() {
        if (!this.updateModelFromForm()) {
            alert('Please enter a model name with at least 1 character.');
        } else {
            var that = this;
            var doSave = function() {

                that.model.trigger('save');

                //now update the collection. if one with the same id is there
                //remove it
                var foundOne = that.collection.findWhere({
                    id: that.model.get('id')
                });

                if (foundOne) {
                    that.collection.remove(foundOne);
                }

                //add it back to the collection 
                that.collection.add(that.model);

                //we have to close now or else fix up the fact
                //that we have the model now as this.model AND in the collection
                $('#fixed_range_editor').modal('hide');
            };

            var key = FixedRangeList.itemPrefix + this.model.get('id');
            var confirmMessage = "Do you wnat to overwrite existing range, " +
                this.model.get('name') + "?";
            var requireConfirm = false;
            if (nsUtil.fGetLocalStorage(key)) {
                requireConfirm = true;
            }

            if (requireConfirm) {
                if (confirm(confirmMessage)) {
                    doSave();
                }
            } else {
                doSave();
            }
        }
    },
    destroy: function() {
        $('#fixed_range_editor .modal-body').html("");
    },
    template: '<form class="fixed_range_editor_form">' +
        '<div class="form-group">' +
        '<label for="fef_name">Name</label>' +
        '<input type="text" id="fef_name" class="form-control" ' +
        'placeholder="Enter a name here" value={{{name}}}>' +
        '<label for="fef_desc">Description</label>' +
        '<textarea id="fef_desc" class="form-control" ' +
        'placeholder="Enter a description here">' +
        '{{{desc}}}' +
        '</textarea>' +
        '</div>' +
        '<div class="form-group">' +
        '<label for="fef_scale_val">Scale</label>' +
        '<input type="text" class="form-control" id="fef_scale_val"' +
        ' value="{{{sliderVal}}}%" disabled="disabled">' +
        '<label for="fef_scale_fn">Range</label>' +
        '<input type="text" class="form-control" id="fef_scale_fn"' +
        ' value="{{{sliderScale}}}" disabled="disabled">' +
        '<label for="fef_custom">Custom</label>' +
        '<textarea type="text" class="form-control" id="fef_custom" disabled="disabled">' +
        '{{{custom}}}' +
        '</textarea>' +
        '</div>' +
        '</form>' +
        '<div class="row fixed_range_editor_title">' +
        '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"><strong></strong></div>' +
        '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"><strong>Name</strong></div>' +
        '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"><strong>Scale</strong></div>' +
        '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6"><strong>Custom</strong></div>' +
        '</div>'
});

module.exports = FixedRangeEditorView;