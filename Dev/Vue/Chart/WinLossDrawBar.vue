<script>
import Vue from 'vue'
import VueChart from 'vue-chartjs'

export default Vue.component('win-loss-draw-bar', {
  extends: VueChart.Bar,
  mixins: [VueChart.mixins.reactiveData],
  props: ['streets', 'showColumns', 'stacked', 'colors'],
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
                backgroundColor: this.colors.win, 
                borderColor: this.colors.winBorder, 
                borderWidth: 2,
                data: wins,
               // hidden: !this.showColumns.win,
            }, {
                label: 'Loss',
                backgroundColor: this.colors.loss, 
                borderColor: this.colors.lossBorder, 
                borderWidth: 2,  
                data: losses,
                //hidden: !this.showColumns.loss,  
            },  {
                label: 'Draw',
                backgroundColor: this.colors.draw, 
                borderColor: this.colors.drawBorder, 
                borderWidth: 2,  
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
    var chart = this;
    this.renderChart(this.chartData, {
        responsive: true, 
        maintainAspectRatio: true,
        onClick: function(event, elements) {
            if(elements.length > 0) {
                var element = elements[0];
                chart.$emit('click-street', element._index);
            }
        },
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
                    suggestedMax: 50,
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