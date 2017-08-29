<template>
 <section> 
     <h4>Visualize</h4>
     <win-loss-draw-bar :streets="streets" :colors="colors"/> 
 </section>
</template>

<script>
    import Vue from 'vue';
    import WinLossDrawBar from './WinLossDrawBar.vue';
    import tinycolor from 'tinycolor2';

    export default Vue.component('visualize', {
        props: ['streets'], 
        data: function() {
            var primary = $('#palette .btn-primary').css('background-color');
            var success = $('#palette .btn-success').css('background-color');
            var danger = $('#palette .btn-danger').css('background-color');
            var info = $('#palette .btn-info').css('background-color');

            var processed = [primary, success, danger, info].map(function(hex){
                var color = tinycolor(hex);
                color.setAlpha(0.5);
                return color.toRgbString();
            });
            return {
                colors: {
                    win:  processed[1],
                    loss: processed[2],
                    draw: processed[3]
                }
            }
        }
    });
</script>