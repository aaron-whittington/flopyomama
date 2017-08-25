 <template>
 <section> 
  <h3>Actions</h3>  
  <ol>
     <li v-for='street in streets'> 
        {{street.label}}
        <ol type='A' v-if='street.actions.length > 0'>
           <li v-for='action in street.actions'>
              {{action.who}} {{action.verb}} {{action.amount}}
          </li>
        <ol>  
     </li>
  </ol>
  </section> 
  </template>

  <script>

  </script>