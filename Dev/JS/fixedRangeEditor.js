
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
			if(cust) {
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
		'click .edit' : 'handleEdit',
		'click .delete' : 'handleDelete'
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

//collection view for the fixed-range editor
FixedRangeEditorView = AWView.extend({
	initialize: function() {
		this.compiledTemplate = Mustache.compile(this.template);
		this.render();
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.collection, 'remove', this.render);
		this.listenTo(this.collection, 'add',this.render);
	},
	render: function() {
		this.destroy();
		var oData = this.renderData();
		var output = this.compiledTemplate(oData);
		$('#fixed_range_editor .modal-body').append(output);
		this.$el = $(".fixed_range_editor." + oData.id);
		var that = this;
		this.collection.each(function(m) {
			var view = new FixedRangeEditorItemView({ model: m, parent: that});
		});
	},
	renderData:	function() {
		console.log('fixedRangeEditor now rendering data'); 
		//the model is just the current range with no description
		//or name
		var mod = this.model;
		var atts = _.clone(mod.attributes);
		var cust = mod.get('custom');
		var sCust = "";
			if(cust) {
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
		if(modName.length<2) {
			return false;
		}
		this.model.set({'name':modName,'desc':modDesc});
		return true;
	},
	trySave: function() {
		if(!this.updateModelFromForm()) {
			alert('Please enter a model name with at least 1 character.');
		}
		else {
			var that = this;
			var doSave = function() {

				that.model.trigger('save');

				//now update the collection
				var foundOne =that.collection.findWhere({
					id :that.model.get('id')
				}); 
				
				if(foundOne) {
					that.collection.remove(foundOne);			
				}
				
				that.collection.add(that.model);

				//we have to close now or else fix up the fact
				//that we have the model now as this.model AND in the collection
				$('#fixed_range_editor').modal('hide');	
			};

			var key = FixedRangeList.itemPrefix + this.model.get('id');
			var confirmMessage = "Do you wnat to overwrite existing range, " +
				this.model.get('name') + "?";
			var requireConfirm = false;
			if(nsUtil.fGetLocalStorage(key)) {
				requireConfirm = true;
			}

			if(requireConfirm) {
				if(confirm(confirmMessage)) {
					doSave();
				}
			} else {
				doSave();
			}
		}
	},
	destroy : function() {
		$('#fixed_range_editor .modal-body').html("");
	},
	template: '<form class="fixed_range_editor_form">' +
					'<div class="form-group">' +
						'<label for="fef_name">Name</label>'+
						'<input type="text" id="fef_name" class="form-control" ' + 
							'placeholder="Enter a name here" value={{{name}}}>' +
						'<label for="fef_desc">Description</label>'+
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
			 '<div class="row fixed_range_editor_title">'+
				'<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"><strong></strong></div>' +
				'<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"><strong>Name</strong></div>' +
				'<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"><strong>Scale</strong></div>' +
				'<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6"><strong>Custom</strong></div>' +
			  '</div>'
});

