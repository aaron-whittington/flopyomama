<script>
import Vue from 'vue'
import VueChart from 'vue-chartjs'
import nsDrawingHand from '../../JS/Hand/DrawingHand'
import tinycolor from 'tinycolor2';

export default Vue.component('texture-pie', {
  extends: VueChart.Pie,
  mixins: [VueChart.mixins.reactiveData],
  props: ['data', 'showColumns', 'colors'],
  data: function(){
     var chartData = this.getChartDataFromStreets();
     return {
       chartData: chartData 
     }
  },
  watch: {
     data : {
        handler: function() {
            this.chartData = this.getChartDataFromStreets();
        },
        deep: true
    } 
  },
  methods: {
     getChartDataFromStreets: function() {

        var loss = this.data.winLossDraw.loss * 100;
    
        var win = this.data.winLossDraw.win * 100;

        var draw = this.data.winLossDraw.draw * 100;
        
        var textures = this.data.textures.oVillainStat;

        var textureLabels = [],
            textureData = [];

        var props = [];
        for(var prop in textures) {
            props.push(prop);
        } 

        //sort props, low rank first
        props.sort(function(a, b) { 
            if(a == 'H0') return - 1;
            if(b == 'H0') return 1;
            
            else return a < b ? -1 : 1;
        });

        //loop for the main data
        props.forEach(function(prop) {
            var labelString = nsDrawingHand.fKeyToHandString(prop);
            textureLabels.push(labelString);
            textureData.push(textures[prop].count);
        });

        //dummy data for the inner ring        
        var drawingHandData = textureData.map(function() {
            return 0;
        }); 

        var mainColors = this.colors.normal.concat(this.colors.dark);

        //dummy data for the inner ring
        var drawingHandColors = textureData.map(function() {
            return 'white';
        }); 

        //loop for the secondary data
        props.forEach(function(prop, i) {
            var labelString = nsDrawingHand.fKeyToHandString(prop);

            var totalAdded = 0,
                newColor,
                toAdd;

            //first round to find out how much to add
            for(var drawingHandProp in textures[prop].drawingHands) {
                
                toAdd = textures[prop].drawingHands[drawingHandProp].count;
                totalAdded += toAdd;
            }

            //add the normal data (high card with nothing, or flush with no draw)
            drawingHandData.push(textures[prop].count - totalAdded);
            var blandColor = tinycolor(mainColors[i]).lighten(9.0).toRgbString();
            drawingHandColors.push(blandColor);
            textureLabels.push(labelString + ' (no drawing hand)');

            //now do the actual adding
            var count = 1,
                textureLabel;

            //todo, sort the damned props
            for(var drawingHandProp in textures[prop].drawingHands) {
                
                toAdd = textures[prop].drawingHands[drawingHandProp].count;
                drawingHandData.push(toAdd);

                newColor = tinycolor(mainColors[i]);
                newColor.darken(count * 9.0);
                newColor = newColor.toRgbString();
                drawingHandColors.push(newColor);
                textureLabel = labelString + ' & ' + nsDrawingHand.fKeyToHandString(drawingHandProp);
                textureLabels.push(textureLabel);
                count++;
            }

        });

        var datasets = [
            {
                data: textureData, 
                backgroundColor: mainColors,               //borderColor: [this.colors.lossBorder, this.colors.winBorder, this.colors.drawBorder], 
                label: 'Villain Textures'
            }, {
                data: drawingHandData, 
                backgroundColor: drawingHandColors
            } 
        ];

        return {
          labels: textureLabels,
          datasets: datasets
        };
      }
  },
  mounted () {
    var chart = this;
    this.renderChart(this.chartData, {
        responsive: true, //why not, maybe true? 
        maintainAspectRatio: true,
        cutoutPercentage: 50,
        onClick: function(event, elements) {
        },
        tooltips: {
        },
        legend: {
            labels: {
                generateLabels: function(chart) {
                    var mainSet = chart.data.datasets[0];
                    //console.log(mainSet);
                    var labels = chart.data.labels;
                    var returnValues = mainSet.data.map(function(set, i) {
                        return {
                            text: labels[i],
                            fillStyle: mainSet.backgroundColor[i],
                        }
                    }); 

                    console.log(returnValues);


                    return returnValues;
                }
            }
        }
        
    })
  }
  
})
</script>