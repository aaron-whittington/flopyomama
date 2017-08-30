<template>
 <section> 
     <h4>Visualize</h4>
     <div v-show="selectedStreet == 0">
         <select v-model="barOrLine">
             <option value="bar">Bar</option>
             <option value="line">Line</option>
         </select>    
        <div v-if="barOrLine == 'line' && streets.flop != null" >
            <win-loss-draw-line :streets="streets" :colors="colors"/>
        </div>
        <div v-else>
            <win-loss-draw-bar :streets="streets" :colors="colors"/>
        </div>
     </div> 
 </section>
</template>

<script>
    import Vue from 'vue';
    import WinLossDrawBar from './WinLossDrawBar.vue';
    import WinLossDrawLine from './WinLossDrawLine.vue';
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
                barOrLine: 'line',
                selectedStreet: 0, //overview
                colors: {
                    win:  processed[1],
                    winBorder: success,
                    loss: processed[2],
                    lossBorder: danger,
                    draw: processed[3],
                    drawBorder: info
                }
            }
        }
    });
</script>