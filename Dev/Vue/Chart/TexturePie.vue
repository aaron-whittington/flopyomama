<script>
import Vue from 'vue'
import VueChart from 'vue-chartjs'
import nsDrawingHand from '../../JS/Hand/DrawingHand'
import tinycolor from 'tinycolor2';
import _ from 'underscore';
import nsMath from '../../JS/Core/Math';

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

        /* Breaks chart
         if(this.data == null) {
            return {
                labels: ["NO DATA"],
                datasets: [{
                    data: [100.00]
                },{
                    data: [100.00]
                }]
            }; 
        }*/

        var textures = this.data.textures.oVillainStat;

        var textureLabels = [],
            textureData = [];

        var props = _.keys(textures);         

        //sort props, low rank first
        props.sort();

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

            var drawingHandDic = textures[prop].drawingHands;
            var drawingHandProps = _.keys(drawingHandDic);

            drawingHandProps.sort();
            //first round to find out how much to add
            var totalAdded = drawingHandProps.reduce(function(sum, dhProp){
                return sum + drawingHandDic[dhProp].count; 
            }, 0);

            //add the normal data (high card with nothing, or flush with no draw)
            drawingHandData.push(textures[prop].count - totalAdded);
            var blandColor = tinycolor(mainColors[i]).lighten(9.0).toRgbString();
            drawingHandColors.push(blandColor);
            
            var noDrawingLabelString = totalAdded == 0 ? labelString : labelString + ' (no draws)';   

            textureLabels.push(noDrawingLabelString);

            //now do the actual adding
            var textureLabel, newColor;

            //todo, sort the damned props
            drawingHandProps.forEach(function(dhProp, index) {
                drawingHandData.push(drawingHandDic[dhProp].count);
                newColor = tinycolor(mainColors[i]);
                newColor.darken((index + 1)* 10.0);
                newColor = newColor.toRgbString();
                drawingHandColors.push(newColor);
                textureLabel = nsDrawingHand.fKeyToHandString(dhProp);
                textureLabels.push(textureLabel);
            });

        });

        // convert both datasets to percentages
        var textureDataSum = textureData.reduce(nsMath.sum, 0);
        var drawingHandDataSum = drawingHandData.reduce(nsMath.sum, 0);
        textureData = textureData.map(function(d) {
            return ((d * 100.0)/textureDataSum);
        })
        drawingHandData = drawingHandData.map(function(d) {
            return ((d * 100.0)/drawingHandDataSum);
        })

        var datasets = [{
                data: drawingHandData, 
                backgroundColor: drawingHandColors
            }, {
                data: textureData, 
                backgroundColor: mainColors,               //borderColor: [this.colors.lossBorder, this.colors.winBorder, this.colors.drawBorder], 
                label: 'Villain Textures'
            }];

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
          callbacks: {
            'label' : function(tooltip, data) {           
                var dataset = data.datasets[tooltip.datasetIndex]
                var value = dataset.data[tooltip.index];
                var labelText = data.labels[tooltip.index];
                var labelEnding = '%';
                return labelText + ' ' + value.toFixed(2) + labelEnding;
              
            }
          }
        },
        legend: {
            labels: {
                generateLabels: function(chart) {
                    var mainSet = chart.data.datasets[1];
                    //console.log(mainSet);
                    var labels = chart.data.labels;
                    var returnValues = mainSet.data.map(function(set, i) {
                        return {
                            text: labels[i],
                            fillStyle: mainSet.backgroundColor[i],
                        }
                    }); 

                    return returnValues;
                }
            }
        }
        
    })
  }
  
})
</script>