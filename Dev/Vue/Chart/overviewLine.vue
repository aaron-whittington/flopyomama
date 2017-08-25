<script>
VueChartJs = require('vue-chartjs');

Vue.component('overview-line', {
  extends: VueChartJs.Bar,
  mixins: [VueChartJs.VueCharts.mixins.reactiveData],
  props: ['streets', 'showColumns', 'stacked'],
  data: function(){
     var chartData = this.getChartDataFromStreets();
     return {
       chartData: chartData 
     }
  },
  watch: {
     streets : function() {
        this.chartData = this.getChartDataFromStreets();
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
        var losses = this.streets.map(function(a)  {
             return a.loss * 100;
         });
      
        var wins = this.streets.map(function(a)  {
             return a.win * 100;
         });
      
        var draws = this.streets.map(function(a) {
             return a.draw * 100;
         });
         
        var equity = this.streets.map(function(a) {
              var money = 100;
              return a.win * money + a.draw * money / 2;
         });
       
        var equityVillain = this.streets.map(function(a) {
             var money = 100;
             return a.loss * money + a.draw * money / 2;
        });
         
        var labels = this.streets.map(function(a) {
            return a.label;
        }); 
       
        var datasets = [
            {
                label: 'Win',
                backgroundColor: 'rgba(0,250,0,0.5)',
                borderColor: 'rgba(0,125,0,0.5)',
                borderWidth: 1,
                data: wins,
                hidden: !this.showColumns.win,
            }, {
                label: 'Loss',
                backgroundColor: 'rgba(250,0,0,0.5)',
                borderColor: 'rgba(125,0,0,0.5)',
                borderWidth: 1,  
                data: losses,
                hidden: !this.showColumns.loss,  
            },  {
                label: 'Draw',
                backgroundColor: 'rgba(125,125,125,0.5)',
                borderColor: 'rgba(125,125,125,0.5)',
                borderWidth: 1,  
                data: draws,
                hidden: !this.showColumns.draw,
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
        responsive: false, //why not, maybe true? 
        maintainAspectRatio: true,
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
                return labelText + ' ' + tooltip.yLabel + labelEnding;
              
            }
          }
        },
        
    })
  }
  
})
</script>