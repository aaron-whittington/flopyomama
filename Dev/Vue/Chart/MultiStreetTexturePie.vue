<script>
import Vue from 'vue'
import VueChart from 'vue-chartjs'
import nsDrawingHand from '../../JS/Hand/DrawingHand'

export default Vue.component('texture-pie', {
  extends: VueChart.Pie,
  mixins: [VueChart.mixins.reactiveData],
  props: ['streets', 'showColumns', 'colors'],
  data: function(){
     var chartData = this.getChartDataFromStreets();
     return {
       chartData: chartData 
     }
  },
  watch: {
     streets : {
        handler: function() {
            this.chartData = this.getChartDataFromStreets();
        },
        deep: true
    } 
  },
  methods: {
     getChartDataFromStreets: function() {

        //find all props 
        var streets = [this.streets.flop, this.streets.turn, this.streets.river];

        //first find all texture objects

        var villainStats = streets.map( function(s) {
            if(s && s.textures.oVillainStat)
                return s.textures.oVillainStat;
            else 
                return {};
        });

        //find all props 
        var textureLabels = [],
            textureDataSets = [];
        var props = [];
        
        villainStats.forEach(function(textures) {
            for(prop in textures) {
                if(props.indexOf(prop) == -1) 
                    props.push(prop);
            } 
        });

        //sort props, low rank first
        props.sort(function(a, b) { 
            if(a == 'H0') return - 1;
            if(b == 'H0') return 1;
            
            else return a < b ? -1 : 1;
        });

        var labelString;
        
        //generate labels
        props.forEach(function(prop) {
            labelString = nsDrawingHand.fKeyToHandString(prop);
            textureLabels.push(labelString);
        });

        //finally, get the data for each leg
        villainStats.forEach(function(textures) {
            var textureData = [];
            props.forEach(function(prop) {
                if(typeof textures[prop] != "undefined") {
                    textureData.push(textures[prop].count);
                } else {
                    textureData.push(0);
                }
            });
            textureDataSets.push(textureData);
        });

        var datasets = [
            {
                data: textureDataSets[0], 
                backgroundColor: this.colors.normal.concat(this.colors.dark),
                //borderColor: [this.colors.lossBorder, this.colors.winBorder, this.colors.drawBorder], 
                label: 'Flop'
            }
        ];

        if(textureDataSets.length > 1) {
            datasets.push({
                data: textureDataSets[1], 
                backgroundColor: this.colors.normal.concat(this.colors.dark),
                //borderColor: [this.colors.lossBorder, this.colors.winBorder, this.colors.drawBorder], 
                label: 'Turn'
            });
        }

        if(textureDataSets.length > 1) {
            datasets.push({
                data: textureDataSets[2], 
                backgroundColor: this.colors.normal.concat(this.colors.dark),
                //borderColor: [this.colors.lossBorder, this.colors.winBorder, this.colors.drawBorder], 
                label: 'River',
            });
        }

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
        cutoutPercentage: 25,
        onClick: function(event, elements) {
        },
        tooltips: {
          callbacks: {
            'label' : function(tooltip, data) {           

                var dataset = data.datasets[tooltip.datasetIndex]
                var datum = dataset.data[tooltip.index];
                var label = data.labels[tooltip.index];
                
                var labelStreet = dataset.label;
                return labelStreet + ': ' + label + ' ' + datum;
              
            }
          }
        },
        
    })
  }
  
})
</script>