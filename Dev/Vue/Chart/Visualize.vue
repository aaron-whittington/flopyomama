<template>
 <section> 
     <div v-if="selectedStreet == 'overview'">
        <select v-model="barOrLine" class="form-control">
            <option value="line">Wins Losses &amp; Draws - Line</option>
            <option value="bar">Wins Losses &amp; Draws - Bar</option>
        </select>    
        <div v-if="barOrLine == 'line' && streets.flop != null">
            <win-loss-draw-line :width='400' :height='372' @click-street='clickStreet($event)' :streets="streets" :colors="colors"/>
        </div>
        <div v-else>
            <win-loss-draw-bar :width='400' :height='372' @click-street='clickStreet($event)' :streets="streets" :colors="colors"/>
        </div>
     </div> 
     <div v-if="selectedStreet!='overview'">
        <span @click="selectedStreet ='overview'">
            <span class="glyphicon glyphicon-arrow-left"> 
            </span>
            Back to Overview
        </span>  

        <select v-model="selectedStreet" class="form-control">
            <option v-if="streets['flop']"  value="flop">Textures: Flop</option>
            <option v-if="streets['turn']" value="turn">Textures: Turn</option>
            <option v-if="streets['river']" value="river">Textures: River</option>
        </select>    
        <div class='main-chart'>
            <texture-pie :width='400' :height='340' :data="streets[selectedStreetSafe]" :colors="pieColors"/>
        </div>
     </div>    
 </section>
</template>
<script>
    import Vue from 'vue';
    import WinLossDrawBar from './WinLossDrawBar.vue';
    import WinLossDrawLine from './WinLossDrawLine.vue';
    import TexturePie from './TexturePie.vue';
    import tinycolor from 'tinycolor2';

    export default Vue.component('visualize', {
        props: ['streets'], 
        data: function() {
            //get colors
            var primary = $('#palette .btn-primary').css('background-color');
            var success = $('#palette .btn-success').css('background-color');
            var danger = $('#palette .btn-danger').css('background-color');
            var info = $('#palette .btn-info').css('background-color');
            var warning = $('#palette .btn-warning').css('background-color');

            var processed = [success, info, primary, warning, danger].map(function(hex){
                var color = tinycolor(hex);
                color.setAlpha(0.5);
                return color.toRgbString();
            });

            var processedDark = [success, info, primary, warning, danger].map(function(hex){
                var color = tinycolor(hex);
                color.setAlpha(0.5);
                color.darken(30);
                return color.toRgbString();
            });

            return {
                barOrLine: 'line',
                selectedStreet: "overview", //overview
                colors: {
                    win:  processed[0],
                    winBorder: success,
                    loss: processed[4],
                    lossBorder: danger,
                    draw: processed[1],
                    drawBorder: info
                }, 
                pieColors: {
                    normal: processed,
                    dark: processedDark, 
                }
            }
        },
        computed: {
            selectedStreetSafe: function() {
                if (this.streets[this.selectedStreet] == null) {
                        this.selectedStreet = "overview";
                }   
                return this.selectedStreet;
            }    
        },
        methods: {
            clickStreet: function(val) {
                
                switch(val) {
                    case 1:  
                    this.selectedStreet = "flop";
                    break;
                    case 2:  
                    this.selectedStreet = "turn";
                    break;
                    case 3:  
                    this.selectedStreet = "river";
                    break;
                }
            }
        }
    });
</script>