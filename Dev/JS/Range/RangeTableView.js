
var AWView = require('../Core/AWView');
var RangeItemView = require('./RangeItemView');
var _ = require('underscore');
var RangeTableView = AWView.extend({
    tagName: 'table',
    className: 'table',
    id: 'op_range_table',
    parent: 'op_range',
    currentRangeItemView: null,
    initialize: function() {
        var renderData = this.renderData;

        this.model.tableLoop(
            function(mod) {
                renderData.row.push([]);
            },
            function(mod) {
                if (!this.currentRangeItemView)
                    this.currentRangeItemView = new RangeItemView({
                        model: mod
                    });
                else
                    this.currentRangeItemView.setModel(mod);

                renderData.row[renderData.row.length - 1].push({
                    innerHtml: this.currentRangeItemView.render(),
                    id: this.currentRangeItemView.idPrefix() + this.currentRangeItemView.id(),
                    sClass: this.currentRangeItemView.className()
                });
            }
        );
        this.render();

        this.listenTo(this.model, 'change', function(oChanged) {
            if (!this.currentRangeItemView)
                this.currentRangeItemView = new RangeItemView({
                    model: oChanged
                });
            else
                this.currentRangeItemView.setModel(oChanged);

            this.currentRangeItemView.render();
            this.fFixCustomBorders();
        });
    },
    events: {
        "mousedown td": "handleMousedown"
    },
    modelFromTD: function(td) {
        var id = $(td).attr('id');
        var sId = id.split("_")[2];
        return this.model.findPairString(sId);
    },
    handleMouseEnterDragging: function(e) {
        this.bWasSimpleClick = false;
        var td = e.currentTarget;
        var model = this.modelFromTD(td);
        var originalSel = model.get(selected);

        var toSet = !this.bOriginalSelected;
        model.set('selected', toSet);

        if (originalSel !== toSet);
        model.toggle('custom');
        this.fFixCustomBorders();

    },
    handleMousedown: function(e) {
        var td = e.currentTarget;
        var table = e.delegateTarget;
        var oView = this;
        var model = this.modelFromTD(td);

        bNewVal = model.toggle('selected');
        model.toggle('custom');

        this.bOriginalSelected = !bNewVal;
        this.bWasSimpleClick = true;

        this.$('td').on('mouseenter', function(e) {
            oView.bWasSimpleClick = false;
            var td = e.currentTarget;
            var model = oView.modelFromTD(td);
            var originalSel = model.get('selected');

            var toSet = !oView.bOriginalSelected;
            model.set('selected', toSet);

            if (originalSel !== toSet)
                model.toggle('custom');
            oView.fFixCustomBorders();
        }); //start listening for mousenter while dragging

        $(td).one('mouseup', function() {
            if (oView.bWasSimpleClick)
                oView.model.trigger('finalize');
            oView.fFixCustomBorders();
        });

        $("body").one('mouseup', function() {
            oView.$('td').off('mouseenter');
            if (!oView.bWasSimpleClick)
                oView.model.trigger('finalize');
        });
        oView.fFixCustomBorders();
    },
    fFixCustomBorders: function() {
        this.$('td').removeClass('nbr nbl nbt nbb');
        this.$('td.custom').each(function() {
            var $this = $(this);
            var index = $this.index();
            var parent = $this.parent();

            var next = $this.next();
            var prev = $this.prev();
            var top = parent.prev().children().eq(index);
            var bottom = parent.next().children().eq(index);

            if (next.is('.custom')) {
                $this.addClass('nbr');
                next.addClass('nbl');
            }

            if (prev.is('.custom')) {
                $this.addClass('nbl');
                prev.addClass('nbr');
            }

            if (top.is('.custom')) {
                $this.addClass('nbt');
                top.addClass('nbb');
            }

            if (bottom.is('.custom')) {
                $this.addClass('nbb');
                bottom.addClass('nbt');
            }
        });
    },
    render: function() {
        ////suit offsuit pPair
        var oData = this.renderData;
        var output = Mustache.render(this.template, oData);
        this.el.innerHTML = output; //html(output);
        $(Mustache.render('#{{.}}', this.parent)).append(this.el);
    },
    renderData: {
        'class': _.isFunction(this.className) ? this.className() : this.className,
        'id': this.id,
        'row': []
    },
    template: "<table id='{{id}}' class='{{class}}'>\
					<tbody>\
						{{#row}}\
						<tr>\
								{{#.}}\
									<td id='{{id}}' class='{{sClass}}'>\
									{{{innerHtml}}}\
									</td>\
								{{/.}}\
						</tr>\
						{{/row}}\
					</tbody>\
				</table>"
});

module.exports = RangeTableView;
