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
        
        //todo add something like debounce
        slider.on('update', function(values) {
            that.model.set({
                value: values[0] 
            });
        });        

        slider.on('end', function(values) {
            that.model.trigger('finalize', values[0]);
        });        

        this.listenTo(this.model, "change:value", this.render);
        this.on('update', this.update);
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
    
    },
    update: function(value) { //changing the slider programatically
        if (typeof value == "undefined")
            value = this.model.get("value");
        //nsUtil.fLog('manual SET trigger with value ' +this.model.get('value'));
        this.slider.set(value);    
    }
});

module.exports = SliderView;
