<script>
import Vue from 'vue'
import VueChart from 'vue-chartjs'

export default Vue.component('win-loss-draw-bar', {
  extends: VueChart.Bar,
  mixins: [VueChart.mixins.reactiveData],
  props: ['streets', 'showColumns', 'stacked'],
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
     },
     stacked: function() {
        this.chartData = this.getChartDataFromStreets();
     },
     showColumns :{ 
         handler: function() {
            this.chartData = this.getChartDataFromStreets();
        }, deep: true
     }
  },
  methods: {
     getChartDataFromStreets: function() {

        var streetArray = [];
        for(var key in this.streets) {
            if(this.streets[key]) {
                streetArray.push(this.streets[key]);
            }
        }
        
        var losses = streetArray.map(function(a)  {
             return a.winLossDraw.loss * 100;
         });
      
        var wins = streetArray.map(function(a)  {
             return a.winLossDraw.win * 100;
         });

        var draws = streetArray.map(function(a) {
             return a.winLossDraw.draw * 100;
         });
         
        var labels = streetArray.map(function(a) {
            return a.getLabel();
        }); 
       
        var datasets = [
            {
                label: 'Win',
                backgroundColor: 'rgba(0,250,0,0.5)',
                borderColor: 'rgba(0,125,0,0.5)',
                borderWidth: 1,
                data: wins,
               // hidden: !this.showColumns.win,
            }, {
                label: 'Loss',
                backgroundColor: 'rgba(250,0,0,0.5)',
                borderColor: 'rgba(125,0,0,0.5)',
                borderWidth: 1,  
                data: losses,
                //hidden: !this.showColumns.loss,  
            },  {
                label: 'Draw',
                backgroundColor: 'rgba(125,125,125,0.5)',
                borderColor: 'rgba(125,125,125,0.5)',
                borderWidth: 1,  
                data: draws,
                //hidden: !this.showColumns.draw,
            }
         ];
       
        if (this.stacked) {
           //reorder stacked datasets with data in the middle
           datasets = [datasets[0], datasets[2], datasets[1]];
        }
        return {
          labels: labels,    
          datasets: datasets
        };
      }
  },
  mounted () {
    this.renderChart(this.chartData, {
        responsive: true, //why not, maybe true? 
        maintainAspectRatio: false,
        scales: {
            xAxes: [{               
                categoryPercentage: 0.9,
                barPercentage: 1.0,
                stacked: this.stacked,
                
            }], 
            yAxes: [{
                stacked: this.stacked,
                gridLines: {
                  display: true
                }, ticks: {
                    min: 0,
                    max: 100, 
                    callback: function(s) {
                       return Math.abs(s) + '%'; 
                   }
                } 
            } ]
        },     
        tooltips: {
          mode: 'index',
          intersect: true,
          callbacks: {
            'label' : function(tooltip, data) {           
                var dataset = data.datasets[tooltip.datasetIndex]
                var labelText = dataset.label;
                var yAxisId = dataset.yAxisID;
                var labelEnding =  yAxisId == 'moneyAxis' ? '$' : '%';
                return labelText + ' ' + tooltip.yLabel.toFixed(2) + labelEnding;
              
            }
          }
        },
        
    })
  }
  
})
</script>