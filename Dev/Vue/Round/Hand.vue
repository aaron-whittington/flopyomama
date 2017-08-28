<template>
 <section>
     <h4>Actions</h4>
        <ol v-if="streets.length > 0">
            <round-street v-for='street in streets' :street='street' ></round-street>
        </ol>
        <i v-else>none</i>
     <!--<h4>
         Hand  
         <span
            @click='showHand = !showHand' 
            :class='{ 
                glyphicon : true,
                "glyphicon-expand"   :!showHand,
                "glyphicon-collapse-up": showHand
                 }' > 
          </span>       
     </h4>
     <div v-if="showHand">
        <div class="form-group form-inline">
            Blinds
            <input class='form-control' placeholder='SB' size="8" v-model.number='SB'/>
            <input class='form-control' placeholder='BB' size="8" v-model.number='BB'/>  
        </div>
        <div class="form-group form-inline">
            Ante 
            <input class='form-control' size="8" v-model.number='ante'/>
        </div>
        <div class="form-group form-inline">
            Players 
            <select class='form-control' v-model.number='playerCount'>
                <option v-for='i in 9' :value='i + 1'>{{i + 1}}</option>
            </select>
        </div>
        <div class="form-group form-inline">
            Hero In 
            <select class='form-control' v-model.number='heroPosition'>
                <option v-for='(pos, index) in positionList' :value='index'>{{pos}}</option>
            </select> 
        </div>
        <table>
            <thead> 
            <th>Pos</th>

            <th>Chips</th>
            </thead>
            <tbody>
            <tr v-for='p in players'>
                <td>
                <strong v-if='p.isHero'>
                    {{positionList[p.position]}}
                </strong> 
                <span v-else>
                    {{positionList[p.position]}}
                </span>  
                
                </td>
        
                <td>
                <input class='form-control' type='text' size='8' v-model.number='p.chips'>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
    <div v-else>
        <i>Click icon to expand</i>
    </div> -->
  </section>     
</template>
<style scoped>
    .form-group {
        font-size: 12px;
        margin-bottom: 8px;
    }
    .form-control {
        font-size: 12px;
        padding: 3px;
        height: 18px;
    }
</style>
<script>
import Vue from 'vue'
import Street from './Street.vue'
import player from '../../JS/Player/NSPlayer'
export default Vue.component('round-hand', {
    props: ['cards'],
    created: function() {
        this.players =  player.playerList(this.playerCount);
    },
    data () {
        console.log('Cards ' + JSON.stringify(this.cards));
        //var cards = this.convertCardsTooStreet();  
        return {
            SB: 25,
            BB: 50,
            ante: 0,
            playerCount : 9,
            players : [],
            showHand : false,
        }
    },
    watch : { 
         playerCount : function(newValue) {
              player.expandReducePlayerList(this.players, newValue);
         }
    }, 
    computed: {
        streets: function() {
            var cards = this.cards;
            var streets = [];
            if(cards.hand.length == 2) {
               streets.push(
                {
                    label: 'preflop',
                    actions: []     
                }
            );
         }

         if(cards.board.length > 2) {
            streets.push(
                {
                    label: 'flop',
                    actions: []     
                }
            );
         }

         if(cards.board.length > 3) {
            streets.push(
                {
                    label: 'turn',
                    actions: []     
                }
            );
         }
         
         if(cards.board.length > 4) {
            streets.push(
                {
                    label: 'river',
                    actions: []     
                }
            );
         }
         return streets;
     },
     positionList: function() {
         var playerCount = this.playerCount;      
         return player.getPositionList(playerCount);
     },
     hero: function() {
        return this.players.find(function(p) {
              return p.isHero == true;
        });
     },
     heroPosition: {
        get : function() {
           var player = this.players.find(function(p) {
              return p.isHero == true;
           });
           if (player) return player.position;
        },
        set : function(val) {
           var player = this.players.find(function(p) {
                return p.position == val;
           });
          
            if (player) {
                this.players.forEach(function(p) {
                    if(p.isHero) {
                        p.isHero = false;
                    }
                });
                player.isHero = true;
            }
        }
    },
        forcedBet : function() {
            return this.hand.sb + this.hand.bb + this.hand.ante * this.hand.playerCount;
        } 
    }  
});
</script>