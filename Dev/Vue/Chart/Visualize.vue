<template>
 <section> 
     <h4>Visualize</h4>
     <win-loss-draw-bar :streets="streets"/> 
 </section>
</template>

<script>
    import Vue from 'vue';
    import WinLossDrawBar from './WinLossDrawBar.vue';
    export default Vue.component('visualize', {
        props: ['streets']
    });
</script>