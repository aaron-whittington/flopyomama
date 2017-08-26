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
</script>