var Backbone = require('backbone');
var noUiSlider = require('nouislider');

var SliderView = Backbone.View.extend({
    initialize: function() {
        var that = this;
        var sliderRange = {
            'min': [0, 0.5],
            '25%': [5, 0.5],
            '50%': [15, 0.5],
            '75%': [25, 0.5],
            'max': [50]
        }        
        var slider = noUiSlider.create(this.el, {
            start: that.model.get('value'),
            connect: [true, false],
            range: sliderRange,
            pips: { 
                mode: 'range',
                stepped: false,
                density: 3 
            },
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
        this.slider = slider;
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
        this.model.trigger('finalize', value);
    }
});

module.exports = SliderView;
