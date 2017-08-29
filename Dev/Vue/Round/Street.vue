<template>
 <li> 
    {{street.getLabel()}}
    <ol type='A' v-if='street.actions.length > 0'>
       <li v-for='action in street.actions'>
          {{action.who}} {{action.verb}} {{action.amount}}
      </li>
     </ol>  
  </li>
</template>

<script>
    import Vue from 'vue'
    export default Vue.component('round-street', {
        props: ['street']
    });
</script>