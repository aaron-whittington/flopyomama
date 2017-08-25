<template>
 <section>
     <h3>Hand</h3>
     SB <input v-model.number='hand.sb'/>
     BB <input v-model.number='hand.bb'/>  
     Ante <input v-model.number='hand.ante'/>
     No. Players 
        <select v-model.number='hand.playerCount'>
            <option v-for='i in 9' v-bind:value='i + 1'>{{i + 1}}</option>
        </select>
     Hero In <select v-model.number='hand.heroPosition'>
    <option v-for='(pos, index) in positionList' v-bind:value='index'>{{pos}}</option>
    </select> 
  </section> 
</template>

<script>
  computed: {
     positionList: function() {
         var playerCount = this.hand.playerCount;      
         
         var blinds = ['SB', 'BB']
         
         var UTG = ['UTG', 'UTG', 'UTG'];
       
         var MP = ['MP', 'MP', 'MP'];
         
         var LP = ['CO', 'Button'];
         
         if (playerCount < 10) {
             MP.pop();
         }
         
         if (playerCount < 9) {
             UTG.pop();
         }
       
         if(playerCount < 8) {
             MP.pop();
         }
       
         if(playerCount < 7) {
             UTG.pop();
         }
       
         if(playerCount < 6) {
             MP.pop();
         }
       
         if(playerCount < 5) {
             UTG.pop();
         }
       
         if(playerCount < 4) {
             LP.shift();
         }
       
         if(playerCount < 3) {
             LP.shift();
         }
         
         //numerate UTG 
         UTG  = UTG.map(function(s, i) {
           if (i > 0) {
              return s = s + '+' + i;
           } else {
             return s;
           }
         }); 
                 
         //numerate MP 
         if (MP.length > 1) {
           MP = MP.map(function(s, i) {
               return s = s + (i + 1);
           });
         }
       
         return blinds.concat(UTG, MP, LP);
     }
</script>