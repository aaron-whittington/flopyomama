var Backbone = require('backbone');
var noUiSlider = require('nouislider');

var SliderView = Backbone.View.extend({
    initialize: function() {
        var that = this;
        
        var slider = noUiSlider.create(this.el, {
            start: that.model.get('value'),
            connect: [true, false],
            range: {
                min: that.model.get('min'),
                max: that.model.get('max')
            },/*
            pips: { // Show a scale with the slider
                mode: 'steps',
                stepped: true,
                density: 10 
            },*/ 
            tooltips: false
        }); 
        
        slider.on('update', function(values) {
            that.model.set({
                value: values[0] 
            });
        });        
/*
        this.$el.slider({
            change: function(e, ui) {
                that.model.trigger('finalize', ui.value);
            },
            slide: function(event, ui) {
            },
            max: that.model.get("max"),
            min: that.model.get("min"),
            value: that.model.get("value")
        });
*/
        this.listenTo(this.model, "change:value", this.render);
        this.on('update', this.update);

        /*this.handle = $('.range_slider_bg').parent().find('a')[0];
        this.handleParent = $(this.handle).parent()[0];
        this.bg = $('.range_slider_bg')[0];*/
    },
    handle: null,
    handleParent: null,
    bg: null,
    render: function() {
        /*var handleLeft = this.handle.style.left;
        var valToSet =  100.0 - parseFloat(handleLeft) + '%';
        this.bg.style.right = valToSet; //('right',valToSet);*/
        var value = this.model.get('value');
        $("#range_slider_val").html(value + '%');
        $('.range_slider_bg').css('width', 100.0 * value / this.model.get('max') + '%');
    },
    update: function(value) { //changing the slider programatically
        if (typeof value == "undefined")
            value = this.model.get("value");
        //nsUtil.fLog('manual SET trigger with value ' +this.model.get('value'));
        this.$el.slider({
            "value": value
        });
    }
});

module.exports = SliderView;
