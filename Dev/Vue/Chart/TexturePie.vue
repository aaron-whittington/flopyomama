<script>
import Vue from 'vue'
import VueChart from 'vue-chartjs'
import nsDrawingHand from '../../JS/Hand/DrawingHand'

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
        for(prop in textures) {
            props.push(prop);
        } 

        //sort props, low rank first
        props.sort(function(a, b) { 
            if(a == 'H0') return - 1;
            if(b == 'H0') return 1;
            
            else return a < b ? -1 : 1;
        });

        var labelString;
        props.forEach(function(prop) {
            labelString = nsDrawingHand.fKeyToHandString(prop);
            textureLabels.push(labelString);
            textureData.push(textures[prop].count);
        });

        var datasets = [
            {
                data: textureData, 
                backgroundColor: this.colors.normal.concat(this.colors.dark),
                //borderColor: [this.colors.lossBorder, this.colors.winBorder, this.colors.drawBorder], 
                label: 'Villain Textures'
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
        
    })
  }
  
})
</script>